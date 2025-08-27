'use client';

import Image from 'next/image';
import { ExplorationCardProps } from '@/types/exploration';

export default function ExplorationCard({ exploration }: ExplorationCardProps) {
  const formatLikes = (likes: number): string => {
    if (likes >= 1000) {
      return `${(likes / 1000).toFixed(0)}k 聖筊`;
    }

    return `${likes} 聖筊`;
  };

  const getRankColor = (rank: number): string => {
    if (rank === 1) return 'bg-yellow-500';
    if (rank === 2) return 'bg-gray-400';
    if (rank === 3) return 'bg-amber-600';

    return 'bg-gray-300';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 md:p-4 cursor-pointer">
      <div className="flex items-start justify-between mb-2 md:mb-3">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className={`w-4 h-4 md:w-6 md:h-6 rounded-full ${getRankColor(exploration.rank)} flex items-center justify-center`}>
            <span className="text-white text-xs md:text-xs font-medium">{exploration.rank}</span>
          </div>
        </div>
        <span className="text-xs md:text-xs text-gray-500">{exploration.postTime}</span>
      </div>

      <h3 className="text-xs md:text-base font-semibold text-gray-800 mb-2 md:mb-3 line-clamp-2 leading-relaxed">
        {exploration.prompt}
      </h3>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 md:space-x-2">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            {exploration.userAvatar ? (
              <Image
                src={exploration.userAvatar}
                alt={exploration.username}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-3 h-3 md:w-5 md:h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <span className="text-xs md:text-sm text-gray-600">{exploration.username}</span>
        </div>

        <div className="flex items-center space-x-1 text-gray-500">
          <span className="text-xs md:text-xs font-medium">{formatLikes(exploration.likes)}</span>
          <span className="text-xs md:text-xs">讚</span>
        </div>
      </div>
    </div>
  );
}