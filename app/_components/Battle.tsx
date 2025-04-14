'use client';

import { useState } from "react";
import { redirect } from "next/navigation";
import { CardsChat } from "@/components/cards/chat";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useUser } from "../contexts/UserContext";

type Message = {
  role: string;
  content: string;
};

export default function Battle(props: { threadId: string }) {
  const { threadId } = props;

  const user = useUser();

  const [input, setInput] = useState<string>('');
  const [messagesLeft, setMessagesLeft] = useState<Message[]>([]);
  const [messagesRight, setMessagesRight] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showUserAnswer, setShowUserAnswer] = useState<boolean>(false);
  const [userAnswer, setUserAnswer] = useState<string>('');

  const handleSubmit = async (): Promise<void> => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    const newUserMessage: Message = { role: 'user', content: userMessage };
    const loadingMessage: Message = { role: 'assistant', content: '思考中...' };

    setMessagesLeft(prev => [...prev, newUserMessage, loadingMessage]);
    setMessagesRight(prev => [...prev, newUserMessage, loadingMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          threadId,
          message: userMessage
        }),
      });

      if (!response.body) {
        setIsLoading(false);

        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let openaiResponse = '';
      let geminiResponse = '';

      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const textChunk = decoder.decode(value, { stream: true });
          const lines = textChunk.split('\n').filter(Boolean);

          for (const line of lines) {
            const data = JSON.parse(line);

            switch (data.type) {
            case 'model1':
              openaiResponse += data.content;
              setMessagesLeft(prev => [
                ...prev.slice(0, -1),
                { role: 'assistant', content: openaiResponse }
              ]);
              break;
            case 'model2':
              geminiResponse += data.content;
              setMessagesRight(prev => [
                ...prev.slice(0, -1),
                { role: 'assistant', content: geminiResponse }
              ]);
            }
          }
        }
      }

    } catch {
      setMessagesLeft(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: '請求處理時發生錯誤' }
      ]);
      setMessagesRight(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: '請求處理時發生錯誤' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitResult = async (result: 'A_IS_BETTER' | 'B_IS_BETTER' | 'TIE' | 'BOTH_BAD'): Promise<void> => {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify({ threadID: threadId, result })
    })

    if (response.ok) {
      toast({
        title: '提交成功',
        description: '感謝您的參與！'
      })
    } else {
      toast({
        title: '提交失敗',
        description: '請稍後再試'
      })
    }
  };

  const handleSubmitUserAnswer = async (): Promise<void> => {
    if (!userAnswer.trim()) {
      toast({
        title: '冒險者！你的答案卷軸是空的',
        description: '在踏上征途前，請先寫下你的智慧之語！'
      });

      return;
    }

    const response = await fetch('/api/submit-answer', {
      method: 'POST',
      body: JSON.stringify({
        threadID: threadId,
        userAnswer
      })
    });

    if (response.ok) {
      toast({
        title: '答案已收入知識寶庫！',
        description: '太厲害了！你的智慧之光照亮了整個魔法世界！'
      });

      setUserAnswer('');
      setShowUserAnswer(false);
    } else {
      toast({
        title: '魔法傳送失敗',
        description: '哎呀！魔法能量不足，請稍後再試一次吧～'
      });
    }
  };

  return (
    <div className="flex flex-col flex-grow h-full">
      <div className="w-full flex flex-col md:flex-row flex-1 flex-grow overflow-hidden">
        <div className="w-full h-full overflow-y-auto border-2 md:w-1/2 md:border-1 relative">
          <CardsChat messages={messagesLeft} title="模型 A" />
        </div>
        <div className="w-full h-full overflow-y-auto border-2 md:w-1/2 md:border-1 relative">
          <CardsChat messages={messagesRight} title="模型 B" />
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="w-full md:w-[800px] bg-white hover:shadow-2xl shadow-xl transition-all rounded-xl p-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex gap-2 items-center"
          >
            <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
            <Input
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              placeholder={isLoading ? "AI 正在回答中..." : "輸入你想要問 AI 的問題 ..."}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "處理中..." : "送出"}
            </Button>
          </form>
          <div className="mt-3 flex flex-col gap-2">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 items-center">
              <Button
                onClick={() => { handleSubmitResult('A_IS_BETTER') }}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                👈 模型 A 比較讚
              </Button>
              <Button
                onClick={() => { handleSubmitResult('B_IS_BETTER') }}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                👉 模型 B 比較讚
              </Button>
              <Button
                onClick={() => { handleSubmitResult('TIE') }}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                🤝 平手
              </Button>
              <Button
                onClick={() => { handleSubmitResult('BOTH_BAD') }}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                👎 兩個都很爛
              </Button>
              <Button
                onClick={() => {
                  if (messagesLeft.length === 0 || messagesRight.length === 0) {
                    toast({
                      title: '等等！冒險尚未開始',
                      description: '先向智慧大師提出你的問題，才能記錄你的答案卷軸！'
                    });

                    return;
                  }

                  setShowUserAnswer(true);
                }}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                ✍️ 提供正確答案
              </Button>
              <Button
                onClick={() => { redirect('/') }}
                variant="outline"
                type="button"
                disabled={isLoading}
                className="w-full"
              >
                🥊 開始新對決
              </Button>
            </div>
            {showUserAnswer && (
              <div className="mt-3">
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="請提供您的答案..."
                  className="w-full p-2 border rounded-md min-h-[100px]"
                  disabled={isLoading}
                />
                <div className="flex justify-end mt-2">
                  <Button
                    onClick={() => { setShowUserAnswer(false); setUserAnswer(''); }}
                    variant="outline"
                    className="mr-2"
                    disabled={isLoading}
                  >
                    取消
                  </Button>
                  <Button
                    onClick={() => { handleSubmitUserAnswer(); }}
                    disabled={isLoading || !userAnswer.trim()}
                  >
                    送出答案
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
