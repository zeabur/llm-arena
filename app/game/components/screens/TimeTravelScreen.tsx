'use client';

import { useGame } from '../../context/GameContext';

export default function TimeTravelScreen() {
  const { proceedToYearSelection } = useGame();

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <p className="text-4xl leading-relaxed">
            你感覺時間停止了，空氣中漂浮著舊時代的聲音
          </p>
          <p className="text-4xl leading-relaxed mt-4">
            你正慢慢靠近某個重要節點，而記憶開始亂竄
          </p>
          <p className="text-4xl leading-relaxed mt-8">
            就在這時，你腦中浮現了幾個想法……
          </p>
        </div>

        <div className="mt-12">
          <button
            onClick={proceedToYearSelection}
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 text-lg"
          >
            繼續
          </button>
        </div>
      </div>
    </div>
  );
}