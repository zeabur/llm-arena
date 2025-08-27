import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { InputBox } from '../../app/_components/chat/InputBox';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe('InputBox', () => {
  it('calls onSubmit on form submit (desktop)', () => {
    const onSubmit = jest.fn();
    const { container } = render(
      <InputBox placeholder="p" value="hi" onChange={() => {}} onSubmit={onSubmit} hasVoted disabled={false} />
    );
    const form = container.querySelector('form')!;
    fireEvent.submit(form);
    expect(onSubmit).toHaveBeenCalled();
  });

  it('calls onSubmit on button click (mobile)', () => {
    const onSubmit = jest.fn();
    const { getAllByAltText } = render(
      <InputBox placeholder="p" value="hi" onChange={() => {}} onSubmit={onSubmit} hasVoted disabled={false} />
    );
    const buttons = getAllByAltText('Send');
    fireEvent.click(buttons[0]);
    expect(onSubmit).toHaveBeenCalled();
  });
});


