'use client';

import { useEffect } from 'react';
import logger from '@/lib/logger';
import type { Message } from '../../types';
import { mapApiMessagesToClientMessages } from '../utils/message';

interface UseThreadBootstrapParams {
  threadId: string;
  messagesLeft: Message[];
  messagesRight: Message[];
  setMessagesLeft: React.Dispatch<React.SetStateAction<Message[]>>;
  setMessagesRight: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoadingRef: React.MutableRefObject<boolean>;
  loadedThreadIdRef: React.MutableRefObject<string | null>;
  handleSubmitWithMessage: (messageText: string) => void;
  // 新增：設定規劃文本
  setPlanLeft?: React.Dispatch<React.SetStateAction<string>>;
  setPlanRight?: React.Dispatch<React.SetStateAction<string>>;
}

export function useThreadBootstrap({
  threadId,
  messagesLeft,
  messagesRight,
  setMessagesLeft,
  setMessagesRight,
  isLoadingRef,
  loadedThreadIdRef,
  handleSubmitWithMessage,
  setPlanLeft,
  setPlanRight,
}: UseThreadBootstrapParams) {
  useEffect(() => {
    async function loadThreadData() {
      // 防止重複載入：檢查是否已經載入過相同的 threadId
      if (isLoadingRef.current || loadedThreadIdRef.current === threadId) {
        logger.debug('Skipping duplicate load for threadId:', threadId);

        return;
      }

      // 如果已經有訊息，不重複載入
      if (messagesLeft.length > 0 || messagesRight.length > 0) {
        logger.debug('Messages already exist, skipping load');

        return;
      }

      // 標記開始載入
      isLoadingRef.current = true;
      loadedThreadIdRef.current = threadId;

      logger.info('Loading thread data for threadId:', threadId);

      try {
        // 載入歷史對話
        const response = await fetch('/api/chat/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ threadId })
        });

        if (response.ok) {
          const { messagesLeft: left, messagesRight: right, planLeft, planRight } = await response.json();
          logger.debug('History loaded:', { leftCount: left.length, rightCount: right.length });

          if (left.length > 0 || right.length > 0) {
            // 有歷史對話，直接載入
            setMessagesLeft(mapApiMessagesToClientMessages(left));
            setMessagesRight(mapApiMessagesToClientMessages(right));
            if (typeof planLeft === 'string') setPlanLeft?.(planLeft);
            if (typeof planRight === 'string') setPlanRight?.(planRight);
          } else {
            // 沒有歷史對話，嘗試獲取 thread 的初始問題
            await loadInitialQuestion();
          }
        }
      } catch (error) {
        logger.error('Error loading thread data:', error);
      } finally {
        // 載入完成，重置載入狀態
        isLoadingRef.current = false;
      }
    }

    async function loadInitialQuestion() {
      // 重試機制：新創建的 thread 可能需要一點時間才能在數據庫中可用
      const maxRetries = 3;
      const retryDelay = 1000; // 1秒

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          logger.debug(`Attempting to load thread info (attempt ${attempt}/${maxRetries})`);

          // 獲取 thread 詳細信息
          const response = await fetch('/api/thread/info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ threadId })
          });

          if (response.ok) {
            const threadInfo = await response.json();
            const initialQuestion = threadInfo.initialContext?.question;

            if (initialQuestion && initialQuestion.trim()) {
              logger.info('Found initial question, auto-submitting:', initialQuestion);
              // 自動提交初始問題
              setTimeout(() => {
                handleSubmitWithMessage(initialQuestion);
              }, 100);

              return; // 成功後退出
            } else {
              logger.info('Thread found but no initial question');

              return; // thread 存在但沒有問題，也退出
            }
          } else if (response.status === 404 && attempt < maxRetries) {
            // Thread 不存在，等待一下再重試
            logger.warn(`Thread not found, retrying in ${retryDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            continue;
          } else {
            logger.warn(`Failed to load thread info: ${response.status}`);
            break;
          }
        } catch (error) {
          logger.error(`Error loading initial question (attempt ${attempt}):`, error);

          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
          }
        }
      }

      logger.warn('Failed to load initial question after all retries');
    }

    loadThreadData();
  }, [threadId, messagesLeft.length, messagesRight.length, setMessagesLeft, setMessagesRight, isLoadingRef, loadedThreadIdRef, handleSubmitWithMessage, setPlanLeft, setPlanRight]);
}
