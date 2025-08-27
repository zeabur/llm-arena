'use client';

import type { ApiMessage } from '@/types/chat';
import type { Message } from '../../types';

export function mapApiMessagesToClientMessages(apiMessages: ApiMessage[]): Message[] {
  return apiMessages.map((msg) => ({
    role: (msg.role === 'user' || msg.role === 'assistant') ? msg.role : 'assistant',
    content: msg.content,
  }));
}
