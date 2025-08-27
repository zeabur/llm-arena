import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChatProvider, useChatContext } from '../../app/_components/chat/ChatClient/context/ChatContext';

function ShowThread() {
  const ctx = useChatContext();
  return <div data-testid="tid">{ctx.threadId}</div>;
}

describe('ChatContext', () => {
  it('throws if used outside provider', () => {
    expect(() => render(<ShowThread />)).toThrow('useChatContext must be used within a ChatProvider');
  });

  it('provides value via ChatProvider', () => {
    render(
      <ChatProvider
        value={{ messagesLeft: [], messagesRight: [], isLoading: false, selectedVote: null, hasVoted: false, threadId: 't1' }}
      >
        <ShowThread />
      </ChatProvider>
    );

    expect(screen.getByTestId('tid').textContent).toBe('t1');
  });
});


