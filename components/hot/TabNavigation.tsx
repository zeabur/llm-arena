'use client';

import { TabType } from '@/types/exploration';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: 'latest', label: '最新榜' },
  { id: 'hot', label: '熱門榜' },
  { id: 'daily', label: '每日主題榜' },
  { id: 'history', label: '歷史主題' },
  { id: 'personal', label: '個人榜' },
];

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto scrollbar-hide">
          <div className="flex space-x-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 md:px-6 py-2 md:py-3 text-xs md:text-lg font-bold whitespace-nowrap transition-all relative ${
                  activeTab === tab.id
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}