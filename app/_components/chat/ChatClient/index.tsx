'use client';

import { useState, useRef } from 'react';
import { useUser } from '@/app/contexts/UserContext';
import { UserMessage } from '../UserMessage';
import { AnswerSidebar } from '../AnswerSidebar';
import { ChatProvider } from './context/ChatContext';
import AIResponseContainer from './components/AIResponseContainer';
import VotingSection from './components/VotingSection';
import ChatHeader from './components/ChatHeader';
import ChatControls from './components/ChatControls';
import { useChatMessages } from './hooks/useChatMessages';
import { useChatSubmission } from './hooks/useChatSubmission';
import { useVoting } from './hooks/useVoting';
import { getDisplayUsername } from './utils/user';
import { useThreadBootstrap } from './hooks/useThreadBootstrap';

export default function ChatClient({ threadId }: { threadId: string }) {
  const user = useUser();

  // 使用 ref 追蹤載入狀態，防止重複載入
  const isLoadingRef = useRef(false);
  const loadedThreadIdRef = useRef<string | null>(null);

  // 使用自定義 hooks 管理狀態和邏輯
  const {
    messagesLeft,
    messagesRight,
    isLoading,
    setMessagesLeft,
    setMessagesRight,
    setIsLoading,
    planLeft,
    planRight,
    setPlanLeft,
    setPlanRight,
  } = useChatMessages();

  // （effect moved below after useChatSubmission）

  // 控制回答側邊欄的顯示
  const [showAnswerSidebar, setShowAnswerSidebar] = useState(false);

  // 先調用 useVoting 來獲取投票狀態
  const {
    selectedVote,
    hasVoted,
    setHasVoted,
    handleVoteSelect
  } = useVoting({
    threadId,
    onShowAnswerSidebar: () => setShowAnswerSidebar(true) // 傳遞回調函數
  });

  // 再調用 useChatSubmission，傳遞投票狀態
  const {
    input,
    setInput,
    handleSubmit,
    handleSubmitWithMessage
  } = useChatSubmission({
    threadId,
    messagesLeft,
    messagesRight,
    setMessagesLeft,
    setMessagesRight,
    setIsLoading,
    hasVoted, // 傳遞投票狀態
    setPlanLeft,
    setPlanRight,
  });

  // 移除顯示思考過程切換，改為永遠展示規劃內容

  useThreadBootstrap({
    threadId,
    messagesLeft,
    messagesRight,
    setMessagesLeft,
    setMessagesRight,
    isLoadingRef,
    loadedThreadIdRef,
    handleSubmitWithMessage,
    setPlanLeft,
    setPlanRight,
  });

  // 關閉側邊欄
  const handleCloseSidebar = () => {
    setShowAnswerSidebar(false);
  };

  return (
    <ChatProvider value={{
      messagesLeft,
      messagesRight,
      isLoading,
      selectedVote,
      hasVoted,
      threadId,
      planLeft,
      planRight,
    }}>
      <div className="w-full h-full">
        {/* 回答側邊欄 */}
        <AnswerSidebar
          isOpen={showAnswerSidebar}
          onClose={handleCloseSidebar}
          threadId={threadId}
          onSuccess={() => setHasVoted(true)}
        />

        {/* Main content container */}
        <div className="container mx-auto px-2 sm:px-4 mt-6 mb-20 md:mb-0">
          <div className="bg-[#F4F9FF] rounded-lg p-4 flex flex-col items-center">
            {messagesLeft.length === 0 ? (
              // 初始狀態顯示歡迎訊息
              <ChatHeader showWelcome={true} />
            ) : (
              // 顯示聊天記錄
              <>
                {/* 顯示用戶訊息 - 改進邏輯以處理各種情況 */}
                {(() => {
                  // 情況1：有至少2條訊息，顯示倒數第二條（用戶問題）
                  if (messagesLeft.length >= 2 && messagesLeft[messagesLeft.length - 2].role === 'user') {
                    return (
                      <UserMessage
                        username={getDisplayUsername(user)}
                        time={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        content={messagesLeft[messagesLeft.length - 2].content}
                        className="mb-4 w-full max-w-[1024px]"
                      />
                    );
                  }
                  // 情況2：只有1條訊息且是用戶問題，直接顯示
                  else if (messagesLeft.length === 1 && messagesLeft[0].role === 'user') {
                    return (
                      <UserMessage
                        username={getDisplayUsername(user)}
                        time={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        content={messagesLeft[0].content}
                        className="mb-4 w-full max-w-[1024px]"
                      />
                    );
                  }
                  // 情況3：最後一條是用戶訊息（可能正在等待AI回應）
                  else if (messagesLeft.length > 0 && messagesLeft[messagesLeft.length - 1].role === 'user') {
                    return (
                      <UserMessage
                        username={getDisplayUsername(user)}
                        time={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        content={messagesLeft[messagesLeft.length - 1].content}
                        className="mb-4 w-full max-w-[1024px]"
                      />
                    );
                  }

                  return null;
                })()}

                <ChatHeader showWelcome={false} />
                <AIResponseContainer />
                <VotingSection onVoteSelect={handleVoteSelect} />
              </>
            )}
          </div>
        </div>

        <ChatControls
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          disabled={isLoading || !hasVoted}
          hasVoted={hasVoted}
        />
      </div>
    </ChatProvider>
  );
}
