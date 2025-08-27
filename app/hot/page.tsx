'use client';

import { useState, useEffect } from 'react';
import { TabType, Exploration, PersonalRanking } from '@/types/exploration';
import TabNavigation from '@/components/hot/TabNavigation';
import ExplorationCard from '@/components/hot/ExplorationCard';
import PersonalRankings from '@/components/hot/PersonalRankings';

const mockExplorations: Exploration[] = [
  {
    id: '1',
    rank: 1,
    prompt: '幫我設計一份學測國文複習計畫，包含每日重點與模擬測驗',
    username: '阿宅日常',
    likes: 2,
    postTime: '2 sec',
    category: '教育'
  },
  {
    id: '2',
    rank: 2,
    prompt: '現在你是一個擁有10年資歷的雜誌編輯，我想要請你幫我......',
    username: '小籠包',
    likes: 0,
    postTime: '1 min',
    category: '職業'
  },
  {
    id: '3',
    rank: 3,
    prompt: '如何訓練 AI 用最道地的台語聊天？',
    username: '這把一定贏',
    likes: 9000,
    postTime: '1 hr',
    category: '語言'
  },
  {
    id: '4',
    rank: 4,
    prompt: '請告訴我LLM的演變歷史，以及簡單的理論介紹',
    username: '摸魚大師',
    likes: 6000,
    postTime: '5 hr',
    category: '科技'
  },
  {
    id: '5',
    rank: 5,
    prompt: '我預計開一家火鍋店，你可以幫我思考開一家店需要考慮哪......',
    username: '晨晨沒吃飽',
    likes: 10,
    postTime: '4 min',
    category: '創業'
  },
  {
    id: '6',
    rank: 6,
    prompt: '幫我整理一份台南小吃地圖，推薦最經典的店家',
    username: '魚住海裡',
    likes: 63,
    postTime: '5 min',
    category: '美食'
  },
  {
    id: '7',
    rank: 7,
    prompt: '分析近十年台灣流行音樂的歌詞趨勢，有哪些常見的主題',
    username: '睡不飽選手',
    likes: 2,
    postTime: '7 min',
    category: '音樂'
  },
  {
    id: '8',
    rank: 8,
    prompt: '幫我規劃一條從台中到花蓮的最佳交通路線，包含轉乘建議',
    username: '想睡覺了',
    likes: 1,
    postTime: '8 min',
    category: '旅遊'
  },
  {
    id: '9',
    rank: 9,
    prompt: '大腸包小腸配什麼飲料好喝',
    username: '一顆葡萄',
    likes: 2,
    postTime: '10 min',
    category: '美食'
  }
];

const mockPersonalRankings: PersonalRanking[] = [
  { id: '1', rank: 1, username: '阿宅日常', title: '知識王', level: 30 },
  { id: '2', rank: 2, username: '小籠包', title: '知識王', level: 30 },
  { id: '3', rank: 3, username: '這把一定贏', title: '知識王', level: 27 },
  { id: '4', rank: 4, username: '摸魚大師', title: '智慧之樹', level: 25 },
  { id: '5', rank: 5, username: '晨晨沒吃飽', title: '智慧之樹', level: 23 },
  { id: '6', rank: 6, username: '魚住海裡', title: '智慧之樹', level: 23 },
  { id: '7', rank: 7, username: '睡不飽選手', title: '智慧之樹', level: 21 },
  { id: '8', rank: 8, username: '想睡覺了', title: '奇幻樹苗', level: 20 },
  { id: '9', rank: 9, username: '一顆葡萄', title: '奇幻樹苗', level: 19 },
  { id: '10', rank: 10, username: '咖哩狂戰士', title: '求知萌芽', level: 15 },
  { id: '11', rank: 11, username: '今天也要加班嗎', title: '求知萌芽', level: 13 },
  { id: '12', rank: 12, username: 'Andy', title: '思維開拓者', level: 10 },
  { id: '13', rank: 13, username: '刀疤傑森', title: '思維開拓者', level: 8 },
  { id: '14', rank: 14, username: '超級工程師', title: '小島探險家', level: 5 },
  { id: '15', rank: 15, username: '豆花要加花生', title: '小島探險家', level: 5 },
  { id: '16', rank: 16, username: '啦啦啦啦啦', title: '小島探險家', level: 5 },
  { id: '17', rank: 17, username: '鍋燒意麵之力', title: '小島探險家', level: 5 },
  { id: '18', rank: 18, username: '阿嬤都比我猛', title: '小島探險家', level: 5 },
  { id: '19', rank: 19, username: '滷肉飯加蛋', title: '小島探險家', level: 5 },
  { id: '20', rank: 20, username: '豆花要加花生', title: '小島探險家', level: 5 },
  { id: '21', rank: 21, username: '啦啦啦啦啦', title: '小島探險家', level: 5 },
  { id: '22', rank: 22, username: '鍋燒意麵之力', title: '小島探險家', level: 5 },
];

export default function HotPage() {
  const [activeTab, setActiveTab] = useState<TabType>('latest');
  const [explorations, setExplorations] = useState<Exploration[]>(mockExplorations);
  const [personalRankings, setPersonalRankings] = useState<PersonalRanking[]>(mockPersonalRankings);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Fetch data based on activeTab
    setLoading(true);
    setTimeout(() => {
      if (activeTab === 'personal') {
        setPersonalRankings(mockPersonalRankings);
      } else {
        setExplorations(mockExplorations);
      }

      setLoading(false);
    }, 300);
  }, [activeTab]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (activeTab === 'personal') {
      return <PersonalRankings rankings={personalRankings} loading={loading} />;
    }

    return (
      <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {explorations.map((exploration) => (
          <ExplorationCard key={exploration.id} exploration={exploration} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
