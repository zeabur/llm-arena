'use client';

import { useGame } from '../../context/GameContext';
import SelectionScreen from './SelectionScreen';

const options = [
  { id: 'international', name: '國際關係', color: 'bg-emerald-600' },
  { id: 'minorities', name: '弱勢群體', color: 'bg-rose-600' },
  { id: 'future-vision', name: '未來願景', color: 'bg-violet-600' },
  { id: 'traditions', name: '傳統文化', color: 'bg-amber-700' },
];

export default function AfterTagScreen3() {
  const { selectAfterTag } = useGame();

  return (
    <SelectionScreen
      title="最後還想知道......"
      options={options}
      onSelect={selectAfterTag}
    />
  );
}