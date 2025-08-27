import { renderHook, act } from '@testing-library/react';
import { useChatMessages } from '../../app/_components/chat/ChatClient/hooks/useChatMessages';

describe('useChatMessages', () => {
  it('initializes and updates state', () => {
    const { result } = renderHook(() => useChatMessages());
    expect(result.current.messagesLeft).toEqual([]);
    expect(result.current.messagesRight).toEqual([]);
    expect(result.current.isLoading).toBe(false);

    act(() => {
      result.current.setMessagesLeft([{ role: 'assistant', content: 'A' }]);
      result.current.setMessagesRight([{ role: 'assistant', content: 'B' }]);
      result.current.setIsLoading(true);
    });

    expect(result.current.messagesLeft.length).toBe(1);
    expect(result.current.messagesRight.length).toBe(1);
    expect(result.current.isLoading).toBe(true);
  });
});


