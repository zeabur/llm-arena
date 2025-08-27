'use client';

import { useGame } from '../../context/GameContext';
import SelectionScreen from './SelectionScreen';

const options = [
  { id: 'politics', name: '政治動盪', color: 'bg-red-500' },
  { id: 'economy', name: '經濟發展', color: 'bg-green-500' },
  { id: 'culture', name: '文化變遷', color: 'bg-blue-500' },
  { id: 'society', name: '社會運動', color: 'bg-purple-500' },
];

export default function DuringTagScreen1() {
  const { selectDuringTag } = useGame();

  return (
    <SelectionScreen
      title="當時最關注的議題是......"
      options={options}
      onSelect={selectDuringTag}
    />
  );
}