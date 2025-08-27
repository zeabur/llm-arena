'use client';

import { useGame } from '../context/GameContext';
import HomeScreen from './screens/HomeScreen';
import TimeTravelScreen from './screens/TimeTravelScreen';
import YearSelectionScreen from './screens/YearSelectionScreen';
import DuringTagScreen1 from './screens/DuringTagScreen1';
import DuringTagScreen2 from './screens/DuringTagScreen2';
import DuringTagScreen3 from './screens/DuringTagScreen3';
import AfterTimeTravelScreen from './screens/AfterTimeTravelScreen';
import AfterTagScreen1 from './screens/AfterTagScreen1';
import AfterTagScreen2 from './screens/AfterTagScreen2';
import AfterTagScreen3 from './screens/AfterTagScreen3';
import EmotionSelectionScreen from './screens/EmotionSelectionScreen';
import GeneratingScreen from './screens/GeneratingScreen';
import ResultScreen from './screens/ResultScreen';

export default function GameFlow() {
  const { state } = useGame();

  const renderScreen = () => {
    switch (state.currentStep) {
    case 'home':
      return <HomeScreen />;
    case 'time-travel':
      return <TimeTravelScreen />;
    case 'year-selection':
      return <YearSelectionScreen />;
    case 'during-tag-1':
      return <DuringTagScreen1 />;
    case 'during-tag-2':
      return <DuringTagScreen2 />;
    case 'during-tag-3':
      return <DuringTagScreen3 />;
    case 'after-time-travel':
      return <AfterTimeTravelScreen />;
    case 'after-tag-1':
      return <AfterTagScreen1 />;
    case 'after-tag-2':
      return <AfterTagScreen2 />;
    case 'after-tag-3':
      return <AfterTagScreen3 />;
    case 'emotion-selection':
      return <EmotionSelectionScreen />;
    case 'generating':
      return <GeneratingScreen />;
    case 'result':
      return <ResultScreen />;
    default:
      return <HomeScreen />;
    }
  };

  return (
    <div className="w-full min-h-screen">
      {renderScreen()}
    </div>
  );
}