import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
// streaming handled via services/models.getModelTextStream
import { verifyToken } from "@/lib/jwt";
import logger from "@/lib/logger";
import { getAvailableModels, selectRandomModels, getModelTextStream } from "@/lib/services/models";
import { appendThreadMessage, getThreadById, saveThreadModels, saveThreadPlan } from "@/lib/services/threads";

export const dynamic = 'force-dynamic';
// moved to lib/services/models

export async function POST(request: NextRequest) {
  logger.info('POST /api/chat - Request started');
  const { threadId, message, category, initialContext } = await request.json();
  logger.debug('Request data:', { threadId, messageLength: message?.length, category, initialContext });

  const cookies = request.cookies;
  const token = cookies.get('token')?.value;

  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userID = verifyToken(token);

  if (!userID) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (!threadId || !message) {
    return new Response('Invalid request', { status: 400 });
  }

  if (typeof message !== 'string' || typeof threadId !== 'string') {
    return new Response('Invalid message', { status: 400 });
  }

  const threadID = new ObjectId(threadId);

  logger.info('Getting thread messages for:', threadID.toString());
  let thread = await getThreadById(threadID);

  if (!thread) {
    logger.info('Thread not found, creating new thread');
    const selectedModels = await selectRandomModels();
    logger.debug('Selected models:', selectedModels);

    // 使用傳入的參數或預設值
    const threadCategory = category || '一般對話';
    const threadInitialContext = initialContext || {
      question: message,
      source: 'unknown'
    };

    await saveThreadModels(threadID, selectedModels, userID, threadCategory, threadInitialContext);
    thread = await getThreadById(threadID);
  } else if (!thread.selectedModels || thread.selectedModels.length === 0) {
    // Thread 存在但沒有選擇模型（由 create API 創建的新 thread）
    logger.info('Thread exists but no models selected, selecting models now');
    const selectedModels = await selectRandomModels();
    logger.debug('Selected models for existing thread:', selectedModels);

    await saveThreadModels(threadID, selectedModels, userID, thread.category, thread.initialContext);
    thread = await getThreadById(threadID);
  }

  if (!thread) {
    logger.error('ERROR: Thread not found and failed to create new');

    return new Response('Thread not found and failed to create new', { status: 404 });
  }

  logger.info('Thread loaded successfully:', {
    selectedModels: thread.selectedModels,
    model1MessagesCount: thread.model1Messages?.length || 0,
    model2MessagesCount: thread.model2Messages?.length || 0
  });

  const encoder = new TextEncoder();
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  // 立即發送歷史訊息（如果有的話）
  if (thread.model1Messages?.length > 0 || thread.model2Messages?.length > 0) {
    logger.info('Sending existing history');
    await writer.write(encoder.encode(JSON.stringify({
      type: 'history',
      messagesLeft: thread.model1Messages || [],
      messagesRight: thread.model2Messages || []
    }) + '\n'));
  }

  const updateThread = async (modelId: string, fullResponse: string) => {
    await appendThreadMessage(threadID, modelId, { role: 'assistant', content: fullResponse });
  };

  for (const modelId of thread.selectedModels) {
    await appendThreadMessage(threadID, modelId, { role: 'user', content: message });
  }

  (async () => {
    try {
      logger.info('Starting model processing');
      const availableModels = await getAvailableModels();
      logger.debug('Available models count:', availableModels.length);

      const modelPromises = thread.selectedModels.map(async (modelId: string, index: number) => {
        logger.info(`Processing model ${index + 1}/${thread.selectedModels.length}:`, modelId);
        const modelConfig = availableModels.find((model) => model.model === modelId);

        if (!modelConfig) {
          logger.error(`ERROR: Model configuration not found for model ${modelId}`);
          throw new Error(`Model configuration not found for model ${modelId}`);
        }

        const messages = thread[index === 0 ? 'model1Messages' : 'model2Messages'] || [];
        logger.debug(`Model ${modelId} existing messages count:`, messages.length);
        const updatedMessages = [...messages, { role: 'user', content: message } as { role: 'user' | 'assistant', content: string }];

        let planAccumulator = '';
        const textStream = await getModelTextStream(modelConfig, updatedMessages, {
          onPlan: async (planText: string) => {
            const planType = modelId === thread.selectedModels[0] ? 'model1_plan' : 'model2_plan';
            planAccumulator += planText;
            await writer.write(encoder.encode(JSON.stringify({ type: planType, content: planText }) + '\n'));
          },
        });

        return { modelId, textStream, planAccumulatorRef: () => planAccumulator };
      });

      const responsePromises = modelPromises.map(async (modelPromise) => {
        const { modelId, textStream, planAccumulatorRef } = await modelPromise;
        let fullResponse = '';

        for await (const text of textStream) {
          fullResponse += text;
          const responseType = modelId === thread.selectedModels[0] ? 'model1' : 'model2';
          await writer.write(encoder.encode(JSON.stringify({ type: responseType, content: text }) + '\n'));
        }

        await updateThread(modelId, fullResponse);
        const finalPlan = planAccumulatorRef();

        if (finalPlan && finalPlan.length > 0) {
          await saveThreadPlan(threadID, modelId, finalPlan);
        }

        logger.info(`Model ${modelId} processing completed. Final response saved to database.`);

        return { modelId, done: true };
      });

      logger.info('Waiting for all model responses to complete...');
      await Promise.all(responsePromises);
      logger.info('All model responses completed. Closing writer.');
      await writer.close();

    } catch (error) {
      logger.error('ERROR in model processing:', error);
      await writer.close();
    }
  })();

  logger.info('Returning streaming response');

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store'
    },
  });
}

// GET API 已移除 - 歷史訊息現在通過 POST API 一併處理
