'use client';

import { useState } from 'react';
import { useGame } from '../../context/GameContext';

export default function HomeScreen() {
  const { startGame } = useGame();
  const [playerName, setPlayerName] = useState('');

  const handleStart = () => {
    if (playerName.trim()) {
      startGame(playerName.trim());
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <p className="mb-4">FreeSEED 打造懂台灣的 AI</p>

        <h1 className="text-3xl font-bold mb-4">《台灣歷史生成中⋯ 請稍候》</h1>

        <h2 className="text-xl mb-8">誤觸AI時光機，捲入從未出現的歷史現場</h2>

        <div className="mb-8">
          <p className="mb-4">
            你是懷抱理想，想協助打造台灣的大型 LLM 系統的善心人士。某天，你不小心按下了一個從未出現過的神祕按鈕……
          </p>

          <p className="mb-4 text-xl font-bold">！！！</p>

          <p className="mb-4">
            世界突然模糊，你穿越了！
            <br />
            <br />
            你的出現，將改變某段關鍵歷史的走向 —— 一則嶄新的新聞，即將在歷史上悄悄誕生⋯⋯
          </p>
        </div>

        <div className="mb-8">
          <label className="block mb-2 font-semibold">穿越者：</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="請在此輸入你的名字"
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <button
          onClick={handleStart}
          disabled={!playerName.trim()}
          className={`px-6 py-2 rounded ${
            playerName.trim()
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          開始一鍵穿越
        </button>
      </div>
    </div>
  );
}