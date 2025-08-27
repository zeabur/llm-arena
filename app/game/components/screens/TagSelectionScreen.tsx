'use client';

import { useGame } from '../../context/GameContext';

const tagOptions = [
  { id: 'politics', name: '政治風雲', color: 'bg-red-500' },
  { id: 'culture', name: '文化變遷', color: 'bg-blue-500' },
  { id: 'economy', name: '經濟發展', color: 'bg-green-500' },
  { id: 'society', name: '社會議題', color: 'bg-purple-500' },
];

export default function TagSelectionScreen() {
  const { selectDuringTag } = useGame();

  const handleTagSelect = (tagId: string) => {
    selectDuringTag(tagId);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-semibold text-gray-700 mb-12">
          你最想了解當時的......
        </h1>

        <div className="grid grid-cols-2 gap-8 max-w-3xl mx-auto mb-8">
          {tagOptions.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagSelect(tag.id)}
              className={`${tag.color} text-white font-bold text-2xl py-16 px-8 rounded-2xl hover:opacity-90 transition-opacity`}
            >
              {tag.name}
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <button className="bg-white border border-gray-300 text-gray-600 px-6 py-2 rounded-xl text-lg">
            🎲 換一組（剩3次）
          </button>
        </div>
      </div>
    </div>
  );
}