'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function DailyTopicPage() {
  const { toast } = useToast();

  const handleFeatureUnderConstruction = () => {
    toast({
      title: "功能建置中",
      description: "此功能正在開發中，敬請期待！",
      variant: "default",
    });
  };

  const handleNewConversation = handleFeatureUnderConstruction;
  // 假資料：每日主題
  const dailyTopic = {
    id: 'topic-20250511',
    title: '#台灣小吃 想AI聊聊台灣有名的小吃吧!',
    description: '一起來探討台灣的小吃文化，分享你的最愛與推薦！',
    views: 128,
    comments: 42
  };

  // 假資料：熱門問題
  const topResponses = [
    { id: 1, title: '如果未來 AI 出題，考試會變成什麼樣子？', views: 35, days: 2 },
    { id: 2, title: '幫我分析歷年台灣高雄地區的立委選舉各行政區趨勢，數據......', views: 52, days: 2 },
    { id: 3, title: '如何訓練 AI 用最道地的台語聊天？', views: 35, days: 2 },
    { id: 4, title: '請告訴我LLM的演變歷史，以及簡單的理論介紹', views: 35, days: 2 },
    { id: 5, title: '請幫設計一款結合台灣夜市文化的手遊(包含玩法)', views: 35, days: 2 }
  ];

  return (
    <div className="w-full min-h-screen md:pb-0 pb-16 relative">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 via-teal-400/30 to-green-400/30 -z-10"></div>

      {/* 主要內容區 */}
      <main className="container mx-auto px-4 py-8">
        {/* 頂部主題卡片 - 只在桌面版顯示 */}
        <section className="bg-[#F8FAFF] rounded-xl py-8 mb-8 p-6 md:p-8 text-center shadow-md hidden md:block">
          <h1 className="text-xl md:text-2xl font-medium mb-6">
            {dailyTopic.title}
          </h1>

          <div className="max-w-2xl mx-auto relative">
            <div className="relative p-2">
              <div className="relative flex items-center">
                <Input
                  className="pr-32 py-7 text-base border border-gray-100 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg"
                  placeholder="一起來探討台灣的小吃文化，分享你的最愛與推薦！"
                />
                <Button
                  className="absolute right-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2"
                  onClick={handleNewConversation}
                >
                  <img src="/icons/chat/send.svg" alt="Send" width={16} height={16} />
                  <span>新的交談</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 手機版固定在底部的輸入框 */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-2 z-20">
          <div className="relative flex items-center">
            <Input
              className="pr-14 py-3 text-base border border-gray-100 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg"
              placeholder="一起來探討台灣的小吃文化，分享你的最愛與推薦！"
            />
            <Button
              className="absolute right-1 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center"
              onClick={handleNewConversation}
            >
              <img src="/icons/chat/send.svg" alt="Send" width={16} height={16} />
            </Button>
          </div>
        </div>

        {/* 熱門問題區 */}
        <section className="mt-8 md:bg-gray-50 rounded-xl p-6 md:p-8">
          {/* 手機版標題 - 只在手機版顯示 */}
          <h2 className="text-xl font-medium text-gray-700 mb-6 md:hidden text-left">熱門問題 TOP-5 (開發中)</h2>

          {/* 桌面版標題和搜尋 - 只在桌面版顯示 */}
          <div className="hidden md:flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-medium text-gray-700">熱門問題 TOP-5 (開發中)</h2>
            <div className="relative w-64">
              <Input
                className="pl-10"
                placeholder="搜尋"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* 回應列表 */}
          <div className="space-y-4">
            {topResponses.map((response) => (
              <div
                key={response.id}
                onClick={handleFeatureUnderConstruction}
                className="block bg-white rounded-xl p-4 hover:shadow-md transition-shadow duration-200 border border-gray-100 shadow-sm md:shadow-none cursor-pointer"
              >
                <div className="md:flex md:justify-between md:items-center">
                  <h3 className="text-base md:text-lg font-medium text-gray-800 text-center md:text-left w-full">{response.title}</h3>
                  {/* 觀看數和時間只在桌面版顯示 */}
                  <div className="hidden md:flex items-center text-gray-500 text-sm whitespace-nowrap">
                    <div className="flex items-center mr-6">
                      <img src="/icons/answernumber.svg" alt="Views" width={16} height={16} className="mr-2" />
                      <span>{response.views}</span>
                    </div>
                    <div className="flex items-center">
                      <img src="/icons/time.svg" alt="Time" width={16} height={16} className="mr-2" />
                      <span>{response.days}days</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
