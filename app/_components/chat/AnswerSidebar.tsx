"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

type AnswerSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  threadId?: string; // 添加 threadId 屬性
  onSuccess?: () => void; // 成功提交後的回調
};

export const AnswerSidebar = ({ isOpen, onClose, threadId, onSuccess }: AnswerSidebarProps) => {
  const [answer, setAnswer] = useState("");
  const sidebarRef = useRef<HTMLDivElement>(null);

  // 處理點擊外部關閉側邊欄以及控制背後內容滾動
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // 當側邊欄打開時禁止背後內容滾動
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // 處理提交回答
  const handleSubmit = async () => {
    if (!answer.trim()) return;

    try {
      if (!threadId) {
        // 如果沒有 threadId，顯示功能建置中
        toast({
          title: "功能建置中",
          description: "您的回答已記錄",
          variant: "default",
          duration: 3000,
        });
        onClose();

        return;
      }

      // 直接調用 API 提交回答
      const response = await fetch('/api/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threadID: threadId, // 使用大寫的 threadID
          userAnswer: answer.trim() // 使用 userAnswer 而不是 answer
        })
      });

      if (response.ok) {
        toast({
          title: "您已成功送出回答！",
          description: "台灣的AI會變得更好！謝謝您！",
          variant: "default",
          duration: 3000,
        });

        // 如果有成功回調，執行它
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error('提交失敗');
      }

      // 關閉側邊欄並清空回答
      onClose();
      setAnswer("");
    } catch {
      toast({
        title: "提交失敗",
        description: "請稍後再試",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // 處理關閉側邊欄
  const handleClose = () => {
    onClose();
    setAnswer("");
  };

  // 如果側邊欄未開啟，不渲染任何內容
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div
        ref={sidebarRef}
        className="bg-white w-[85%] max-w-md md:max-w-lg h-full overflow-y-auto shadow-lg animate-in slide-in-from-right duration-300"
      >
        {/* 第一行：圖標+離開（置左） */}
        <div className="p-4">
          <div className="flex justify-start items-center">
            <button
              onClick={handleClose}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100"
            >
              <Image
                src="/icons/chat/leave.svg"
                alt="Close"
                width={20}
                height={20}
              />
              <span>離開</span>
            </button>
          </div>
        </div>

        {/* 第二行：標題（置左） */}
        <div className="px-4 py-2">
          <h2 className="text-lg font-medium text-left">需要你幫助 AI 學習</h2>
        </div>

        {/* 第三行：輸入框 */}
        <div className="p-4">
          <textarea
            className="w-full h-48 p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="請輸入您的回答..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            autoFocus
          />
        </div>

        {/* 第四行：圖標+提交按鈕（置左） */}
        <div className="p-4 flex justify-start">
          <button
            onClick={handleSubmit}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${answer.trim() ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            disabled={!answer.trim()}
          >
            <Image
              src="/icons/chat/send.svg"
              alt="Send"
              width={20}
              height={20}
            />
            <span>提交</span>
          </button>
        </div>
      </div>
    </div>
  );
};
