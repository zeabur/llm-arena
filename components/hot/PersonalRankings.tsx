'use client';

import Image from 'next/image';
import { PersonalRanking, PersonalRankingRowProps } from '@/types/exploration';

function PersonalRankingRow({ ranking }: PersonalRankingRowProps) {
  const getRankStyle = (rank: number) => {
    if (rank <= 3) {
      return 'font-medium text-blue-600';
    }

    return 'font-regular text-gray-600';
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-2 md:px-4 py-1 md:py-3 text-center">
        <span className={`text-xs md:text-sm ${getRankStyle(ranking.rank)}`}>
          {ranking.rank}
        </span>
      </td>
      <td className="px-2 md:px-4 py-1 md:py-3">
        <div className="flex items-center space-x-1 md:space-x-3">
          {/* Show avatar only on desktop */}
          <div className="hidden md:flex w-8 h-8 rounded-full bg-gray-200 overflow-hidden items-center justify-center">
            {ranking.userAvatar ? (
              <Image
                src={ranking.userAvatar}
                alt={ranking.username}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-5 h-5 text-gray-400"
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
          <span className="text-xs md:text-sm font-medium text-gray-900">
            {ranking.username}
          </span>
        </div>
      </td>
      <td className="px-2 md:px-4 py-1 md:py-3">
        <span className="text-xs md:text-sm text-gray-600">{ranking.title}</span>
      </td>
      <td className="px-2 md:px-4 py-1 md:py-3">
        <span className="text-xs md:text-sm text-gray-600">Lv. {ranking.level}</span>
      </td>
    </tr>
  );
}

interface PersonalRankingsProps {
  rankings: PersonalRanking[];
  loading?: boolean;
}

export default function PersonalRankings({ rankings, loading }: PersonalRankingsProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-xs font-medium text-gray-500 uppercase tracking-wider w-16 md:w-20">
                排名
              </th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-xs font-medium text-gray-500 uppercase tracking-wider">
                暱稱
              </th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-xs font-medium text-gray-500 uppercase tracking-wider w-20 md:w-32">
                稱謂
              </th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-xs font-medium text-gray-500 uppercase tracking-wider w-16 md:w-24">
                等級
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {rankings.map((ranking) => (
              <PersonalRankingRow key={ranking.id} ranking={ranking} />
            ))}
          </tbody>
        </table>
      </div>

      {rankings.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="mt-2 text-sm">目前還沒有排名資料</p>
        </div>
      )}
    </div>
  );
}