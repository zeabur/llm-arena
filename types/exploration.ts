export interface Exploration {
  id: string;
  rank: number;
  prompt: string;
  username: string;
  userAvatar?: string;
  likes: number;
  postTime: string;
  category?: string;
}

export interface PersonalRanking {
  id: string;
  rank: number;
  username: string;
  title: string;
  level: number;
  userAvatar?: string;
}

export type TabType = 'latest' | 'hot' | 'daily' | 'history' | 'personal';

export interface ExplorationCardProps {
  exploration: Exploration;
}

export interface PersonalRankingRowProps {
  ranking: PersonalRanking;
}