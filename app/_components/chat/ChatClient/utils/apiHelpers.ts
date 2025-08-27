import logger from '@/lib/logger';
import type { ChatStreamEvent } from '@/types/chat';
import { VoteResult } from '../../types';

// 請求去重：追蹤正在進行的請求
const activeRequests = new Set<string>();

export async function fetchChatResponse(
  threadId: string,
  message: string,
  callbacks: {
    onModel1Update: (content: string) => void,
    onModel2Update: (content: string) => void,
    onComplete: () => void,
    onHistoryLoaded?: (messagesLeft: Array<{role: string, content: string}>, messagesRight: Array<{role: string, content: string}>) => void,
    onModel1PlanUpdate?: (content: string) => void,
    onModel2PlanUpdate?: (content: string) => void,
  },
  category?: string,
  initialContext?: { question: string; source: string; metadata?: Record<string, unknown> },
  abortSignal?: AbortSignal
) {
  // 請求去重 key 改為 threadId+message，避免不同訊息被視為同一請求
  const dedupeKey = `${threadId}::${message}`;

  if (activeRequests.has(dedupeKey)) {
    logger.debug('Duplicate request detected for threadId:', threadId, 'skipping...');
    callbacks.onComplete();

    return;
  }

  // 標記請求開始
  activeRequests.add(dedupeKey);
  logger.info('Starting request for threadId:', threadId);
  const requestBody: Record<string, unknown> = {
    threadId,
    message
  };

  // 如果有對話配置參數，添加到請求中
  if (category) {
    requestBody.category = category;
  }

  if (initialContext) {
    requestBody.initialContext = initialContext;
  }

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(requestBody),
    signal: abortSignal,
  });

  if (!response.body) {
    // 清理請求標記
    activeRequests.delete(dedupeKey);
    logger.info('Request completed for threadId:', threadId);
    callbacks.onComplete();

    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let openaiResponse = '';
  let geminiResponse = '';

  let done = false;
  let plan1 = '';
  let plan2 = '';

  // 使用串流讀取回應
  let buffer = '';

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;

    if (value) {
      buffer += decoder.decode(value, { stream: true });
      let newlineIndex: number;

      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);

        if (!line) continue;

        try {
          const data = JSON.parse(line) as ChatStreamEvent;

          switch (data.type) {
          case 'history':
            logger.debug('Received history:', { leftCount: data.messagesLeft.length, rightCount: data.messagesRight.length });
            callbacks.onHistoryLoaded?.(data.messagesLeft, data.messagesRight);
            break;
          case 'model1':
            openaiResponse += data.content;
            callbacks.onModel1Update(openaiResponse);
            break;
          case 'model2':
            geminiResponse += data.content;
            callbacks.onModel2Update(geminiResponse);
            break;
          case 'model1_plan':
            plan1 += data.content;
            callbacks.onModel1PlanUpdate?.(plan1);
            break;
          case 'model2_plan':
            plan2 += data.content;
            callbacks.onModel2PlanUpdate?.(plan2);
            break;
          }
        } catch (e) {
          logger.warn('Skipping malformed stream line:', line);
        }
      }
    }
  }

  // 清理請求標記
  activeRequests.delete(dedupeKey);
  logger.info('Request completed for threadId:', threadId);
  callbacks.onComplete();
}

export async function submitVoteResult(threadId: string, result: VoteResult): Promise<boolean> {
  const response = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ threadID: threadId, result })
  });

  return response.ok;
}
