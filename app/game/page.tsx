'use client';

import { GameProvider } from './context/GameContext';
import GameFlow from './components/GameFlow';

export default function GamePage() {
  return (
    <GameProvider>
      <div className="w-full min-h-screen bg-gray-50">
        <GameFlow />
      </div>
    </GameProvider>
  );
}
