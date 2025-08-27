'use client';

import { InputBox } from '../../InputBox';

interface ChatControlsProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  hasVoted: boolean;
}

export default function ChatControls({
  input,
  setInput,
  onSubmit,
  disabled,
  hasVoted,
}: ChatControlsProps) {
  return (
    <div className="space-y-2">
      <InputBox
        placeholder={hasVoted ? "開始新的一輪對話 - 輸入你的問題..." : "點一下回覆的評價按鈕就能開啟新的對話！"}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onSubmit={onSubmit}
        disabled={disabled}
        hasVoted={hasVoted}
      />
    </div>
  );
}
