'use client';

import { useGame } from '../../context/GameContext';
import SelectionScreen from './SelectionScreen';

const options = [
  { id: 'leadership', name: '領導人物', color: 'bg-orange-500' },
  { id: 'events', name: '重大事件', color: 'bg-red-600' },
  { id: 'trends', name: '社會趨勢', color: 'bg-purple-600' },
  { id: 'conflicts', name: '衝突矛盾', color: 'bg-gray-600' },
];

export default function AfterTagScreen1() {
  const { selectAfterTag } = useGame();

  return (
    <SelectionScreen
      title="你想深入了解......"
      options={options}
      onSelect={selectAfterTag}
    />
  );
}