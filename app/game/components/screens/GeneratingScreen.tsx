'use client';

import { useEffect } from 'react';
import { useGame } from '../../context/GameContext';

export default function GeneratingScreen() {
  const { generateResult } = useGame();

  useEffect(() => {
    generateResult();
  }, [generateResult]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="inline-block p-6 bg-white rounded-full shadow-lg mb-6">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            正在穿越時空...
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            AI 正在為您生成個人化的時光穿越體驗
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <div className="flex items-center text-gray-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
              <span>分析您選擇的年代和議題...</span>
            </div>

            <div className="flex items-center text-gray-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse animation-delay-200"></div>
              <span>查找相關歷史事件...</span>
            </div>

            <div className="flex items-center text-gray-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse animation-delay-400"></div>
              <span>結合您的情緒偏好...</span>
            </div>

            <div className="flex items-center text-gray-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse animation-delay-600"></div>
              <span>生成個人化內容...</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          請稍候，這個過程可能需要幾秒鐘時間...
        </div>
      </div>
    </div>
  );
}