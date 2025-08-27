'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import logger from '@/lib/logger';
import { Message } from '../../types';
import { fetchChatResponse } from '../utils/apiHelpers';
import { mapApiMessagesToClientMessages } from '../utils/message';
import { startNewConversation } from '../../../../utils/conversationStarter';

interface UseChatSubmissionProps {
  threadId: string;
  messagesLeft: Message[];
  messagesRight: Message[];
  setMessagesLeft: React.Dispatch<React.SetStateAction<Message[]>>;
  setMessagesRight: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  hasVoted?: boolean; // 新增：是否已投票
  // 新增：規劃/思考文本 setter
  setPlanLeft?: React.Dispatch<React.SetStateAction<string>>;
  setPlanRight?: React.Dispatch<React.SetStateAction<string>>;
}

export function useChatSubmission({
  threadId,
  messagesLeft,
  messagesRight,
  setMessagesLeft,
  setMessagesRight,
  setIsLoading,
  hasVoted = false,
  setPlanLeft,
  setPlanRight,
}: UseChatSubmissionProps) {
  const [input, setInput] = useState<string>('');
  const router = useRouter();

  // 移除了來自 URL 的初始訊息處理邏輯，現在由 ChatClient 直接處理

  const handleSubmitWithMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim()) return;

    setInput('');
    setIsLoading(true);

    const newUserMessage: Message = { role: 'user', content: messageText };
    const loadingMessage: Message = { role: 'assistant', content: '思考中...' };

    setMessagesLeft(prev => [...prev, newUserMessage, loadingMessage]);
    setMessagesRight(prev => [...prev, newUserMessage, loadingMessage]);
    // 重置規劃/思考內容
    setPlanLeft?.('');
    setPlanRight?.('');

    try {
      await fetchChatResponse(threadId, messageText, {
        onHistoryLoaded: (left, right) => {
          if (left.length > 0 || right.length > 0) {
            setMessagesLeft([...mapApiMessagesToClientMessages(left), newUserMessage, loadingMessage]);
            setMessagesRight([...mapApiMessagesToClientMessages(right), newUserMessage, loadingMessage]);
          }
        },
        onModel1Update: (content) => {
          setMessagesLeft(prev => [
            ...prev.slice(0, -1),
            { role: 'assistant', content }
          ]);
        },
        onModel2Update: (content) => {
          setMessagesRight(prev => [
            ...prev.slice(0, -1),
            { role: 'assistant', content }
          ]);
        },
        // 規劃/思考串流（左右模型）
        onModel1PlanUpdate: (plan) => setPlanLeft?.(plan),
        onModel2PlanUpdate: (plan) => setPlanRight?.(plan),
        onComplete: () => {
          setIsLoading(false);
        }
      });
    } catch (error) {
      logger.error("Error fetching chat response:", error);
      const errorMessage = { role: 'assistant' as const, content: '請求處理時發生錯誤' };
      setMessagesLeft(prev => [...prev.slice(0, -1), errorMessage]);
      setMessagesRight(prev => [...prev.slice(0, -1), errorMessage]);
      setIsLoading(false);
    }
  }, [setInput, setIsLoading, threadId, setMessagesLeft, setMessagesRight, setPlanLeft, setPlanRight]);

  const handleSubmit = useCallback(async () => {
    // 如果已投票，創建新對話而不是在當前 thread 中繼續
    if (hasVoted && input.trim()) {
      try {
        logger.info('Creating new conversation after voting');

        const config = {
          question: input.trim(),
          category: 'general',
          source: 'post_vote_question',
          metadata: {
            previousThreadId: threadId,
            startedAt: new Date().toISOString()
          }
        };

        // 創建新對話
        const newThreadId = await startNewConversation(config);

        // 導航到新對話頁面
        router.push(`/chat/${newThreadId}`);

      } catch (error) {
        logger.error('Failed to create new conversation:', error);
        // 如果創建新對話失敗，回退到在當前 thread 中繼續
        await handleSubmitWithMessage(input);
      }
    } else {
      // 未投票或空輸入，在當前 thread 中繼續
      await handleSubmitWithMessage(input);
    }
  }, [hasVoted, input, threadId, router, handleSubmitWithMessage]);

  return {
    input,
    setInput,
    handleSubmit,
    handleSubmitWithMessage // 導出此函數供初始問題自動提交使用
  };
}
