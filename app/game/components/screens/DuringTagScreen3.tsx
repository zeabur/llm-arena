'use client';

import { useGame } from '../../context/GameContext';
import SelectionScreen from './SelectionScreen';

const options = [
  { id: 'media', name: '媒體言論', color: 'bg-yellow-500' },
  { id: 'religion', name: '宗教信仰', color: 'bg-amber-600' },
  { id: 'gender', name: '性別議題', color: 'bg-pink-500' },
  { id: 'youth', name: '青年文化', color: 'bg-teal-500' },
];

export default function DuringTagScreen3() {
  const { selectDuringTag } = useGame();

  return (
    <SelectionScreen
      title="還有一個重要的面向......"
      options={options}
      onSelect={selectDuringTag}
    />
  );
}