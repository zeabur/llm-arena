'use client';

import { useGame } from '../../context/GameContext';

export default function AfterTimeTravelScreen() {
  const { proceedToAfterTimeTravel } = useGame();

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <p className="text-4xl leading-relaxed">
            你停下來了，但周遭的一切感覺有點熟悉
          </p>
          <p className="text-4xl leading-relaxed mt-4">
            你的直覺告訴你：你得先搞清楚自己現在的狀況
          </p>
          <p className="text-4xl leading-relaxed mt-8">
            你試著抓住一些線索......
          </p>
        </div>

        <div className="mt-12">
          <button
            onClick={proceedToAfterTimeTravel}
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 text-lg"
          >
            繼續
          </button>
        </div>
      </div>
    </div>
  );
}