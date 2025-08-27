import 'server-only';
import { OpenAI } from 'openai';
import { BedrockRuntimeClient, ConverseStreamCommand, ConverseStreamOutput } from '@aws-sdk/client-bedrock-runtime';
import type { Stream } from 'openai/streaming.mjs';
import type { ChatCompletionChunk } from 'openai/resources/index.mjs';
import { getDb } from '@/lib/mongo';

export interface ModelConfig {
  model: string;
  baseURL: string;
  apiKey: string;
  enabled?: boolean;
}

export async function getAvailableModels(): Promise<ModelConfig[]> {
  const db = await getDb('arena');
  const models = db.collection<ModelConfig>('models');
  const find = await models.find({}).toArray();

  // Filter to only return enabled models, treating missing enabled field as enabled for backward compatibility
  return find.filter(model => model.enabled !== false);
}

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

export async function selectRandomModels(count: number = 2): Promise<string[]> {
  const availableModels = await getAvailableModels();
  const shuffledModels = shuffle(availableModels);

  return shuffledModels.slice(0, count).map((item) => item.model);
}

export type ModelMessage = { role: 'user' | 'assistant'; content: string };

export async function getModelTextStream(
  modelConfig: ModelConfig,
  messages: ModelMessage[],
  options?: { onPlan?: (text: string) => void | Promise<void> },
): Promise<AsyncIterable<string>> {
  // Harmony-style models: stream begins with `analysis` and switches at `assistantfinal`.
  // Usage: set model id as `harmony@<underlying-model-id>`. Analysis tokens go to onPlan, final is yielded.
  if (modelConfig.model.startsWith('harmony@')) {
    const realModel = modelConfig.model.split('@')[1] || modelConfig.model;
    const openai = new OpenAI({ baseURL: modelConfig.baseURL, apiKey: modelConfig.apiKey });
    const stream = await openai.chat.completions.create({ model: realModel, messages, stream: true });
    const openaiStream = stream as Stream<ChatCompletionChunk>;

    const ANALYSIS = 'analysis';
    const ASSISTANT_FINAL = 'assistantfinal';

    async function* iterator() {
      let mode: 'pre' | 'analysis' | 'final' = 'pre';
      let buffer = '';
      const hold = ASSISTANT_FINAL.length - 1; // keep suffix for cross-chunk token detection

      const flushPlan = async (text: string) => {
        if (text) await options?.onPlan?.(text);
      };

      const stripLeadingAnalysisHeader = () => {
        const lower = buffer.toLowerCase();

        if (lower.startsWith(ANALYSIS)) {
          // remove header token and optional separators like ':' '：' whitespace/newline
          let cut = ANALYSIS.length;
          while (cut < buffer.length && /[:：\s\n\r\t-]/.test(buffer[cut])) cut++;
          buffer = buffer.slice(cut);
          mode = 'analysis';
        }
      };

      for await (const chunk of openaiStream) {
        const text = chunk.choices[0]?.delta.content;
        if (!text) continue;
        buffer += text;

        if (mode === 'pre') {
          // try to detect explicit analysis header, otherwise treat as analysis by default until assistantfinal
          stripLeadingAnalysisHeader();
          if (mode === 'pre') mode = 'analysis';
        }

        if (mode === 'analysis') {
          // check for assistantfinal boundary
          const lower = buffer.toLowerCase();
          const idx = lower.indexOf(ASSISTANT_FINAL);

          if (idx >= 0) {
            // flush analysis up to boundary
            const before = buffer.slice(0, idx);
            await flushPlan(before);
            // switch to final, drop the boundary token and any trailing separators
            let cut = idx + ASSISTANT_FINAL.length;
            while (cut < buffer.length && /[:：\s\n\r\t-]/.test(buffer[cut])) cut++;
            buffer = buffer.slice(cut);
            mode = 'final';
          } else {
            // no boundary yet: flush safe part, keep suffix for boundary detection
            if (buffer.length > hold) {
              const safe = buffer.slice(0, buffer.length - hold);
              await flushPlan(safe);
              buffer = buffer.slice(buffer.length - hold);
            }

            continue;
          }
        }

        if (mode === 'final') {
          if (buffer) {
            yield buffer;
            buffer = '';
          }
        }
      }

      // stream ended: flush remainder
      if (mode !== 'final') {
        // If boundary never arrived, treat remainder as analysis by default
        if (buffer) await flushPlan(buffer);
      } else if (buffer) {
        yield buffer;
      }
    }

    return iterator();
  }

  if (modelConfig.model.startsWith('bedrock@')) {
    const client = new BedrockRuntimeClient({
      region: 'us-east-1',
      credentials: {
        accessKeyId: modelConfig.apiKey.split(':')[0],
        secretAccessKey: modelConfig.apiKey.split(':')[1],
      },
    });

    const response = await client.send(new ConverseStreamCommand({
      inferenceConfig: {},
      modelId: modelConfig.model.split('@')[1],
      messages: messages.map((message) => ({ role: message.role, content: [{ text: message.content }] })),
    }));

    if (!response.stream) {
      throw new Error(JSON.stringify(response));
    }

    const stream = response.stream as AsyncIterable<ConverseStreamOutput>;

    function extractBedrockReasoning(chunk: ConverseStreamOutput): string | undefined {
      const cbd = (chunk as unknown as Record<string, unknown>).contentBlockDelta as unknown;
      if (typeof cbd !== 'object' || cbd === null) return undefined;
      const delta = (cbd as Record<string, unknown>).delta as unknown;
      if (typeof delta !== 'object' || delta === null) return undefined;
      const rc = (delta as Record<string, unknown>).reasoningContent as unknown;
      if (typeof rc !== 'object' || rc === null) return undefined;

      const rt = (rc as Record<string, unknown>).reasoningText as unknown;

      if (typeof rt === 'object' && rt !== null) {
        const t = (rt as Record<string, unknown>).text;
        if (typeof t === 'string') return t;
      }

      const t2 = (rc as Record<string, unknown>).text;

      return typeof t2 === 'string' ? t2 : undefined;
    }

    async function* iterator() {
      for await (const chunk of stream) {
        // 提取 Bedrock ConverseStream 的 reasoning 文本：
        // reasoningContent 屬性為聯合類型，常見為 { reasoningText: { text: string, signature?: string } }
        const reasoning = extractBedrockReasoning(chunk);

        if (reasoning) {
          // 推理/規劃內容，透過回呼傳遞給上游（不當作最終回覆輸出）
          await options?.onPlan?.(reasoning);
        }

        const contentText = chunk.contentBlockDelta?.delta?.text;

        if (contentText) {
          yield contentText;
        }
      }
    }

    return iterator();
  }

  const openai = new OpenAI({ baseURL: modelConfig.baseURL, apiKey: modelConfig.apiKey });
  const stream = await openai.chat.completions.create({ model: modelConfig.model, messages, stream: true });
  const openaiStream = stream as Stream<ChatCompletionChunk>;

  async function* iterator() {
    for await (const chunk of openaiStream) {
      const text = chunk.choices[0]?.delta.content;
      if (text) yield text;
    }
  }

  return iterator();
}
