export interface GameState {
  currentStep: GameStep;
  playerName?: string;
  selectedYear?: string;
  duringTags: string[];
  afterTags: string[];
  selectedEmotion?: string;
  isGenerating: boolean;
  result?: GameResult;
}

export type GameStep =
  | 'home'
  | 'time-travel'
  | 'year-selection'
  | 'during-tag-1'
  | 'during-tag-2'
  | 'during-tag-3'
  | 'after-time-travel'
  | 'after-tag-1'
  | 'after-tag-2'
  | 'after-tag-3'
  | 'emotion-selection'
  | 'generating'
  | 'result';

export interface GameResult {
  title: string;
  content: string;
  keywords: string[];
  timestamp: string;
}

export interface Tag {
  id: string;
  name: string;
  description?: string;
}

export interface Emotion {
  id: string;
  name: string;
  color: string;
}