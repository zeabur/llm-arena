import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';

jest.mock('../../app/_components/chat/ChatClient/utils/apiHelpers', () => ({
  submitVoteResult: jest.fn(),
}));

jest.mock('../../hooks/use-toast', () => ({
  toast: jest.fn(),
}));

import { submitVoteResult } from '../../app/_components/chat/ChatClient/utils/apiHelpers';
import { useVoting } from '../../app/_components/chat/ChatClient/hooks/useVoting';

function TestComponent({ threadId, onShow }: { threadId: string; onShow?: () => void }) {
  const { selectedVote, hasVoted, handleVoteSelect } = useVoting({ threadId, onShowAnswerSidebar: onShow });

  return (
    <div>
      <button onClick={() => handleVoteSelect('1號比較讚')}>voteA</button>
      <button onClick={() => handleVoteSelect('我來回答')}>iWillAnswer</button>
      <div data-testid="selected">{selectedVote || ''}</div>
      <div data-testid="voted">{hasVoted ? 'yes' : 'no'}</div>
    </div>
  );
}

describe('useVoting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits vote and sets hasVoted', async () => {
    (submitVoteResult as jest.Mock).mockResolvedValueOnce(true);

    render(<TestComponent threadId="t1" />);

    fireEvent.click(screen.getByText('voteA'));

    await waitFor(() => {
      expect(screen.getByTestId('selected').textContent).toBe('1號比較讚');
      expect(screen.getByTestId('voted').textContent).toBe('yes');
    });
  });

  it('calls onShowAnswerSidebar when selecting "我來回答"', async () => {
    const onShow = jest.fn();
    render(<TestComponent threadId="t2" onShow={onShow} />);

    fireEvent.click(screen.getByText('iWillAnswer'));

    expect(onShow).toHaveBeenCalled();
  });
});


