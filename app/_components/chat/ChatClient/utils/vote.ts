'use client';

import type { VoteResult } from '../../types';

export const VoteLabels = {
  aBetter: '1號比較讚',
  bBetter: '2號比較讚',
  tie: '平手',
  bothBad: '兩邊都很爛',
  iWillAnswer: '我來回答',
} as const;

export type VoteLabel = typeof VoteLabels[keyof typeof VoteLabels];

export function mapLabelToResult(label: VoteLabel | string): VoteResult | null {
  switch (label) {
  case VoteLabels.aBetter:
    return 'A_IS_BETTER';
  case VoteLabels.bBetter:
    return 'B_IS_BETTER';
  case VoteLabels.tie:
    return 'TIE';
  case VoteLabels.bothBad:
    return 'BOTH_BAD';
  default:
    return null;
  }
}
