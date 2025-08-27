import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { VoteButton } from '../../app/_components/chat/VoteButton';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe('VoteButton', () => {
  it('renders and triggers onClick', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <VoteButton icon="/icon.svg" alt="icon" text="按鈕" isActive={false} onClick={onClick} />
    );

    fireEvent.click(getByText('按鈕'));
    expect(onClick).toHaveBeenCalled();
  });

  it('applies active styles when isActive is true', () => {
    const { getByText } = render(
      <VoteButton icon="/icon.svg" alt="icon" text="Active" isActive onClick={() => {}} />
    );

    expect(getByText('Active')).toBeInTheDocument();
  });
});


