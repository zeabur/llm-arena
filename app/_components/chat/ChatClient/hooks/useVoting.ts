'use client';

import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { submitVoteResult } from '../utils/apiHelpers';
import { VoteLabels, mapLabelToResult } from '../utils/vote';

interface UseVotingProps {
  threadId: string;
  onShowAnswerSidebar?: () => void; // 新增：顯示回答側邊欄的回調
}

export function useVoting({ threadId, onShowAnswerSidebar }: UseVotingProps) {
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  const handleVoteSelect = async (text: string) => {
    if (!text) {
      return;
    }

    // 如果選中的是已經選中的按鈕，則取消選中
    if (selectedVote === text) {
      setSelectedVote(null);

      return;
    }

    setSelectedVote(text);

    // 根據選擇的按鈕，提交相應的結果
    if (text === VoteLabels.iWillAnswer) {
      if (onShowAnswerSidebar) onShowAnswerSidebar();

      return;
    }

    const result = mapLabelToResult(text);
    if (!result) return;

    // 提交投票結果
    try {
      const success = await submitVoteResult(threadId, result);

      if (success) {
        toast({
          title: '提交成功',
          description: '感謝您的參與！'
        });
        setHasVoted(true);
      } else {
        toast({
          title: '提交失敗',
          description: '請稍後再試'
        });
      }
    } catch {
      toast({
        title: '提交失敗',
        description: '請稍後再試'
      });
    }
  };

  return {
    selectedVote,
    hasVoted,
    setHasVoted,
    handleVoteSelect
  };
}
