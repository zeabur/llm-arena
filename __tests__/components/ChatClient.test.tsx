import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { UserContext } from '../../app/contexts/UserContext';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock('lucide-react', () => ({ __esModule: true }));
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock('../../app/_components/chat/ShareModal', () => ({
  __esModule: true,
  ShareModal: () => null,
}));
jest.mock('../../app/_components/chat/hooks/useShare', () => ({
  __esModule: true,
  useShare: () => ({
    isShareModalOpen: false,
    isConversationComplete: () => false,
    handleShare: jest.fn(),
    closeShareModal: jest.fn(),
  }),
}));

import ChatClient from '../../app/_components/chat/ChatClient';

// Mock ESM-only markdown libs to plain renderers
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));
jest.mock('remark-gfm', () => ({}));
jest.mock('rehype-raw', () => ({}));
jest.mock('rehype-sanitize', () => ({}));

describe('ChatClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows welcome header when no history and no initial question', async () => {
    (global.fetch as any) = jest.fn(async (url: string) => {
      if (url.includes('/api/chat/history')) {
        return { ok: true, json: async () => ({ messagesLeft: [], messagesRight: [] }) } as any;
      }
      if (url.includes('/api/thread/info')) {
        return { ok: false, status: 404 } as any;
      }
      return { ok: true, json: async () => ({}) } as any;
    });

    render(
      <UserContext.Provider value={null}>
        <ChatClient threadId="t1" />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('歡迎來到 AI 競技場')).toBeInTheDocument();
    });
  });
});


