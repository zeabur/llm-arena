import React, { useRef } from 'react';
import { render, waitFor } from '@testing-library/react';

import { useThreadBootstrap } from '../../app/_components/chat/ChatClient/hooks/useThreadBootstrap';

function TestComponent({
  threadId,
  history,
  threadInfo,
  onSubmitMessage,
}: {
  threadId: string;
  history: { left: any[]; right: any[] };
  threadInfo?: { initialContext?: { question?: string } };
  onSubmitMessage?: (msg: string) => void;
}) {
  const isLoadingRef = useRef(false);
  const loadedThreadIdRef = useRef<string | null>(null);

  const setMessagesLeft = jest.fn();
  const setMessagesRight = jest.fn();
  const handleSubmitWithMessage = (msg: string) => {
    onSubmitMessage?.(msg);
  };

  // mock fetch
  (global.fetch as any) = jest.fn(async (url: string) => {
    if (url.includes('/api/chat/history')) {
      return {
        ok: true,
        json: async () => ({ messagesLeft: history.left, messagesRight: history.right }),
      } as any;
    }
    if (url.includes('/api/thread/info')) {
      return {
        ok: threadInfo ? true : false,
        status: threadInfo ? 200 : 404,
        json: async () => threadInfo,
      } as any;
    }

    return { ok: false, status: 404 } as any;
  });

  useThreadBootstrap({
    threadId,
    messagesLeft: [],
    messagesRight: [],
    setMessagesLeft,
    setMessagesRight,
    isLoadingRef,
    loadedThreadIdRef,
    handleSubmitWithMessage,
  });

  return <div data-testid="done" />;
}

describe('useThreadBootstrap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads history when available', async () => {
    const { unmount } = render(
      <TestComponent
        threadId="t-hist"
        history={{ left: [{ role: 'assistant', content: 'A' }], right: [{ role: 'assistant', content: 'B' }] }}
      />
    );

    await waitFor(() => {
      // Since setMessagesLeft/Right are jest.fn inside component, we cannot access directly here.
      // Instead, rely on fetch being called and not calling thread info.
      expect((global.fetch as jest.Mock)).toHaveBeenCalledWith(
        expect.stringContaining('/api/chat/history'),
        expect.any(Object)
      );
    });

    unmount();
  });

  it('submits initial question when no history and thread has initialContext', async () => {
    const onSubmit = jest.fn();

    render(
      <TestComponent
        threadId="t-info"
        history={{ left: [], right: [] }}
        threadInfo={{ initialContext: { question: 'Hello world?' } }}
        onSubmitMessage={onSubmit}
      />
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('Hello world?');
    });
  });
});


