'use client';

import { useGame } from '../../context/GameContext';
import SelectionScreen from './SelectionScreen';

const options = [
  { id: 'daily-life', name: '日常生活', color: 'bg-blue-600' },
  { id: 'values', name: '價值觀念', color: 'bg-indigo-600' },
  { id: 'innovation', name: '創新突破', color: 'bg-cyan-600' },
  { id: 'challenges', name: '面臨挑戰', color: 'bg-slate-600' },
];

export default function AfterTagScreen2() {
  const { selectAfterTag } = useGame();

  return (
    <SelectionScreen
      title="以及當時的......"
      options={options}
      onSelect={selectAfterTag}
    />
  );
}