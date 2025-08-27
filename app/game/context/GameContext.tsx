'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, GameStep, GameResult } from '../types';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  startGame: (playerName?: string) => void;
  proceedToYearSelection: () => void;
  selectYear: (year: string) => void;
  selectDuringTag: (tag: string) => void;
  selectAfterTag: (tag: string) => void;
  selectEmotion: (emotion: string) => void;
  proceedToAfterTimeTravel: () => void;
  generateResult: () => void;
  resetGame: () => void;
}

type GameAction =
  | { type: 'START_GAME'; payload?: string }
  | { type: 'SELECT_YEAR'; payload: string }
  | { type: 'SELECT_DURING_TAG'; payload: string }
  | { type: 'SELECT_AFTER_TAG'; payload: string }
  | { type: 'SELECT_EMOTION'; payload: string }
  | { type: 'SET_STEP'; payload: GameStep }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_RESULT'; payload: GameResult }
  | { type: 'RESET_GAME' };

const initialState: GameState = {
  currentStep: 'home',
  duringTags: [],
  afterTags: [],
  isGenerating: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
  case 'START_GAME':
    return { ...state, playerName: action.payload, currentStep: 'time-travel' };
  case 'SELECT_YEAR':
    return { ...state, selectedYear: action.payload, currentStep: 'during-tag-1' };
  case 'SELECT_DURING_TAG':
    const newDuringTags = [...state.duringTags, action.payload];
    let nextStep: GameStep = 'during-tag-2';
    if (newDuringTags.length === 2) nextStep = 'during-tag-3';
    if (newDuringTags.length === 3) nextStep = 'after-time-travel';

    return { ...state, duringTags: newDuringTags, currentStep: nextStep };
  case 'SELECT_AFTER_TAG':
    const newAfterTags = [...state.afterTags, action.payload];
    let nextAfterStep: GameStep = 'after-tag-2';
    if (newAfterTags.length === 2) nextAfterStep = 'after-tag-3';
    if (newAfterTags.length === 3) nextAfterStep = 'emotion-selection';

    return { ...state, afterTags: newAfterTags, currentStep: nextAfterStep };
  case 'SELECT_EMOTION':
    return { ...state, selectedEmotion: action.payload, currentStep: 'generating' };
  case 'SET_STEP':
    return { ...state, currentStep: action.payload };
  case 'SET_GENERATING':
    return { ...state, isGenerating: action.payload };
  case 'SET_RESULT':
    return { ...state, result: action.payload, currentStep: 'result', isGenerating: false };
  case 'RESET_GAME':
    return initialState;
  default:
    return state;
  }
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = (playerName?: string) => dispatch({ type: 'START_GAME', payload: playerName });
  const proceedToYearSelection = () => dispatch({ type: 'SET_STEP', payload: 'year-selection' });
  const selectYear = (year: string) => dispatch({ type: 'SELECT_YEAR', payload: year });
  const selectDuringTag = (tag: string) => dispatch({ type: 'SELECT_DURING_TAG', payload: tag });
  const selectAfterTag = (tag: string) => dispatch({ type: 'SELECT_AFTER_TAG', payload: tag });
  const selectEmotion = (emotion: string) => dispatch({ type: 'SELECT_EMOTION', payload: emotion });
  const proceedToAfterTimeTravel = () => dispatch({ type: 'SET_STEP', payload: 'after-tag-1' });
  const resetGame = () => dispatch({ type: 'RESET_GAME' });

  const generateResult = async () => {
    dispatch({ type: 'SET_GENERATING', payload: true });

    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockResult: GameResult = {
      title: '時光穿越報告',
      content: `您成功穿越到了${state.selectedYear}年，體驗了${state.duringTags.join('、')}等議題，並以${state.selectedEmotion}的心情探索了${state.afterTags.join('、')}等面向...`,
      keywords: [...state.duringTags, ...state.afterTags],
      timestamp: new Date().toISOString(),
    };

    dispatch({ type: 'SET_RESULT', payload: mockResult });
  };

  return (
    <GameContext.Provider value={{
      state,
      dispatch,
      startGame,
      proceedToYearSelection,
      selectYear,
      selectDuringTag,
      selectAfterTag,
      selectEmotion,
      proceedToAfterTimeTravel,
      generateResult,
      resetGame,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);

  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }

  return context;
}