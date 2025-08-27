'use client';

import { useGame } from '../../context/GameContext';

const emotionOptions = [
  { id: 'hopeful', name: '充滿希望', color: 'bg-yellow-500' },
  { id: 'curious', name: '好奇探索', color: 'bg-indigo-500' },
  { id: 'nostalgic', name: '懷舊感傷', color: 'bg-amber-600' },
  { id: 'critical', name: '理性批判', color: 'bg-gray-600' },
];

export default function EmotionSelectionScreen() {
  const { selectEmotion } = useGame();

  const handleEmotionSelect = (emotionId: string) => {
    selectEmotion(emotionId);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-semibold text-gray-700 mb-12">
          你想以什麼樣的心情體驗？
        </h1>

        <div className="grid grid-cols-2 gap-8 max-w-3xl mx-auto mb-8">
          {emotionOptions.map((emotion) => (
            <button
              key={emotion.id}
              onClick={() => handleEmotionSelect(emotion.id)}
              className={`${emotion.color} text-white font-bold text-2xl py-16 px-8 rounded-2xl hover:opacity-90 transition-opacity`}
            >
              {emotion.name}
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