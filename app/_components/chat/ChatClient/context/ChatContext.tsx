'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Message } from '../../types';

interface ChatContextType {
  messagesLeft: Message[];
  messagesRight: Message[];
  isLoading: boolean;
  selectedVote: string | null;
  hasVoted: boolean;
  threadId: string;
  // 新增：規劃/思考文本（左右模型）
  planLeft: string;
  planRight: string;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({
  children,
  value
}: {
  children: ReactNode;
  value: ChatContextType
}) {
  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);

  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }

  return context;
}
