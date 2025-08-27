'use client';

import { useState } from 'react';
import { Message } from '../../types';

export function useChatMessages() {
  const [messagesLeft, setMessagesLeft] = useState<Message[]>([]);
  const [messagesRight, setMessagesRight] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 新增：規劃/思考文本（不影響原有訊息流）
  const [planLeft, setPlanLeft] = useState<string>('');
  const [planRight, setPlanRight] = useState<string>('');

  return {
    messagesLeft,
    messagesRight,
    isLoading,
    setMessagesLeft,
    setMessagesRight,
    setIsLoading,
    planLeft,
    planRight,
    setPlanLeft,
    setPlanRight,
  };
}
