'use client';

import { VoteButton } from '../../VoteButton';
import { useChatContext } from '../context/ChatContext';
import { VoteLabels } from '../utils/vote';

interface VotingSectionProps {
  onVoteSelect: (text: string) => void;
}

export default function VotingSection({ onVoteSelect }: VotingSectionProps) {
  const { selectedVote } = useChatContext();

  return (
    <>
      {/* Voting buttons - 1號 and 2號 */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-[1024px] mt-6">
        <VoteButton
          icon="/icons/chat/thumb-left.svg"
          alt="Thumb Left"
          text={VoteLabels.aBetter}
          className="flex-1"
          isActive={selectedVote === VoteLabels.aBetter}
          onClick={() => onVoteSelect(VoteLabels.aBetter)}
        />
        <VoteButton
          icon="/icons/chat/thumb-right.svg"
          alt="Thumb Right"
          text={VoteLabels.bBetter}
          className="flex-1"
          isActive={selectedVote === VoteLabels.bBetter}
          onClick={() => onVoteSelect(VoteLabels.bBetter)}
        />
      </div>

      {/* Additional voting options - 3 buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-[1024px] mt-4">
        <VoteButton
          icon="/icons/chat/tie.svg"
          alt="Tie"
          text={VoteLabels.tie}
          isActive={selectedVote === VoteLabels.tie}
          onClick={() => onVoteSelect(VoteLabels.tie)}
        />
        <VoteButton
          icon="/icons/chat/badface.svg"
          alt="Both Bad"
          text={VoteLabels.bothBad}
          isActive={selectedVote === VoteLabels.bothBad}
          onClick={() => onVoteSelect(VoteLabels.bothBad)}
        />
        <VoteButton
          icon="/icons/chat/write.svg"
          alt="Provide Answer"
          text={VoteLabels.iWillAnswer}
          isActive={selectedVote === VoteLabels.iWillAnswer}
          onClick={() => onVoteSelect(VoteLabels.iWillAnswer)}
        />
      </div>
    </>
  );
}
