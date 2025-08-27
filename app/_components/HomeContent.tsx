'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import logger from '@/lib/logger';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/app/contexts/UserContext';
import { startNewConversation, ConversationInitConfig } from '../utils/conversationStarter';
import { useHotTopics } from '../hooks/useHotTopics';

export default function HomeContent() {
  const { toast } = useToast();
  const user = useUser();
  const router = useRouter();
  const [input, setInput] = useState('');
  const [mobileMessage, setMobileMessage] = useState('');

  // 獲取熱門問題數據
  const { hotTopics, loading: hotTopicsLoading, error: hotTopicsError } = useHotTopics(10);

  const handleFeatureUnderConstruction = () => {
    toast({
      title: "功能建置中",
      description: "此功能正在開發中，敬請期待！",
      variant: "default",
    });
  };

  const handleLoginRequired = async () => {
    if (!user) {
      toast({
        title: "需要登入",
        description: (
          <div className="flex flex-col space-y-3">
            <span>請先登入以使用此功能</span>
            <Button
              onClick={() => window.location.href = '/api/auth/login'}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-fit"
            >
              立即登入
            </Button>
          </div>
        ),
        variant: "default",
        duration: 5000,
      });

      return;
    }

    handleFeatureUnderConstruction();
  };

  const handleStartNewConversation = async (question: string, source: string = 'homepage') => {
    // 檢查用戶是否已登入
    if (!user) {
      toast({
        title: "需要登入",
        description: "請先登入才能開始對話",
        variant: "destructive",
      });
      // 導航到 Discord OAuth 登入
      window.location.href = '/api/auth/login';

      return;
    }

    try {
      const config: ConversationInitConfig = {
        question,
        category: '一般對話',
        source,
        metadata: {
          startedAt: new Date().toISOString()
        }
      };

      // 調用後端 API 創建新對話
      const newThreadId = await startNewConversation(config);

      // 導航到新的對話頁面（不再在 URL 中傳遞問題）
      router.push(`/chat/${newThreadId}`);
    } catch (error) {
      logger.error('創建對話失敗:', error);

      // 檢查是否為未登入錯誤
      if (error instanceof Error && error.message.includes('用戶未登入')) {
        toast({
          title: "需要登入",
          description: "您的登入狀態已過期，請重新登入",
          variant: "destructive",
        });
        window.location.href = '/api/auth/login';
      } else {
        toast({
          title: "錯誤",
          description: "創建對話失敗，請重試",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      // 未登入時直接導向登入頁面，不檢查輸入
      window.location.href = '/api/auth/login';

      return;
    }

    if (input.trim()) {
      handleStartNewConversation(input, 'homepage_input');
    }
  };

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      // 未登入時直接導向登入頁面，不檢查輸入
      window.location.href = '/api/auth/login';

      return;
    }

    if (mobileMessage.trim()) {
      handleStartNewConversation(mobileMessage, 'homepage_input');
    }
  };

  const handleTopicClick = (topic: string) => {
    handleStartNewConversation(topic, 'hot_topics');
  };

  return (
    <div className="w-full min-h-screen bg-white md:pb-0 pb-16">
      {/* 主要內容區 */}
      <main className="container mx-auto px-4 py-8">
        {/* 頂部區塊 - 只在桌面版顯示 */}
        <section className="hidden md:block bg-[#F8FAFF] rounded-xl py-12 mb-8 p-6 md:p-8 text-center">
          <h1 className="text-2xl md:text-3xl font-medium mb-8 leading-relaxed">
            AI 能理解台灣歷史與價值，是因為有你的參與
          </h1>
          <div className="max-w-4xl mx-auto relative px-4">
            <div className="relative">
              <div className="relative w-full">
                <form onSubmit={handleSubmit} className="w-full">
                  <div className="relative w-full">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="w-full pr-32 py-7 text-base border border-gray-100 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg shadow-sm"
                      placeholder="AI 想聽你說說話......"
                    />
                    <Button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2"
                    >
                      <img src="/icons/chat/send.svg" alt="Send" width={16} height={16} />
                      <span>{user ? '新的交談' : '登入開始對話'}</span>
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* 手機版固定在底部的輸入框 */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-2 z-20">
          <div className="relative flex items-center">
            <form onSubmit={handleMobileSubmit} className="w-full">
              <div className="relative">
                <Input
                  value={mobileMessage}
                  onChange={(e) => setMobileMessage(e.target.value)}
                  className="pr-14 py-3 text-base border border-gray-100 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg"
                  placeholder="AI想聽你說說話!"
                />
                <Button
                  type="submit"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center"
                >
                  <img src="/icons/chat/send.svg" alt="Send" width={16} height={16} />
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* 熱門問題區 */}
        <section className="mt-8 md:bg-gray-50 rounded-xl p-6 md:p-8">
          {/* 手機版標題 - 只在手機版顯示 */}
          <h2 className="text-xl font-medium text-gray-700 mb-6 md:hidden text-left">熱門問題 TOP-10</h2>

          {/* 桌面版標題和搜尋框 - 只在桌面版顯示 */}
          <div className="hidden md:flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-700">熱門問題 TOP-10</h2>
            <div className="relative">
              <Input className="pl-10 py-1 text-sm border-gray-200 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg" placeholder="搜尋" />
              <img src="/icons/search.svg" alt="Search" width={16} height={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* 問題列表 */}
          <div className="space-y-4">
            {hotTopicsLoading ? (
              <div className="text-center text-gray-500 py-8">
                載入中...
              </div>
            ) : hotTopicsError ? (
              <div className="text-center text-red-500 py-8">
                {hotTopicsError}
              </div>
            ) : (
              hotTopics.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => user ? handleTopicClick(topic.title) : handleLoginRequired()}
                  className="block bg-white rounded-xl p-4 hover:shadow-md transition-shadow duration-200 border border-gray-100 shadow-sm md:shadow-none cursor-pointer"
                >
                  <div className="md:flex md:justify-between md:items-center">
                    <h3 className="text-base md:text-lg font-medium text-gray-800 text-center md:text-left w-full">{topic.title}</h3>
                    {/* 觀看數和時間只在桌面版顯示 */}
                    <div className="hidden md:flex items-center text-gray-500 text-sm whitespace-nowrap">
                      <div className="flex items-center mr-6">
                        <img src="/icons/answernumber.svg" alt="Views" width={16} height={16} className="mr-2" />
                        <span>{topic.views}</span>
                      </div>
                      <div className="flex items-center">
                        <img src="/icons/time.svg" alt="Time" width={16} height={16} className="mr-2" />
                        <span>{topic.days}days</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
