'use client';

import { useGame } from '../../context/GameContext';
import SelectionScreen from './SelectionScreen';

const options = [
  { id: 'education', name: '教育改革', color: 'bg-indigo-500' },
  { id: 'technology', name: '科技發展', color: 'bg-cyan-500' },
  { id: 'environment', name: '環境保護', color: 'bg-emerald-500' },
  { id: 'healthcare', name: '醫療衛生', color: 'bg-rose-500' },
];

export default function DuringTagScreen2() {
  const { selectDuringTag } = useGame();

  return (
    <SelectionScreen
      title="人們也很在意......"
      options={options}
      onSelect={selectDuringTag}
    />
  );
}