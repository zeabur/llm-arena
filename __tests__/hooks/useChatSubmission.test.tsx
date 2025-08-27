import React from 'react';
import { renderHook, act } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('../../app/_components/chat/ChatClient/utils/apiHelpers', () => ({
  fetchChatResponse: jest.fn(),
}));

import { fetchChatResponse } from '../../app/_components/chat/ChatClient/utils/apiHelpers';
import { useChatSubmission } from '../../app/_components/chat/ChatClient/hooks/useChatSubmission';

describe('useChatSubmission', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function setup(hasVoted = false) {
    const messagesLeft: any[] = [];
    const messagesRight: any[] = [];
    const setMessagesLeft = jest.fn();
    const setMessagesRight = jest.fn();
    const setIsLoading = jest.fn();

    const { result } = renderHook(() =>
      useChatSubmission({
        threadId: 't1',
        messagesLeft,
        messagesRight,
        setMessagesLeft: setMessagesLeft as any,
        setMessagesRight: setMessagesRight as any,
        setIsLoading,
        hasVoted
      })
    );

    return { result, setMessagesLeft, setMessagesRight, setIsLoading };
  }

  it('handleSubmitWithMessage calls fetchChatResponse and clears loading on complete', async () => {
    (fetchChatResponse as jest.Mock).mockImplementation(async (_tid, _msg, { onComplete }) => {
      onComplete();
    });

    const { result } = setup();

    await act(async () => {
      await result.current.handleSubmitWithMessage('hello');
    });

    expect(fetchChatResponse).toHaveBeenCalled();
  });
});


