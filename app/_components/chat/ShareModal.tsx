"use client";
import { Download } from "lucide-react";
import { useRef, useState, useEffect } from 'react';
import logger from "@/lib/logger";
import { useScreenshot } from "./hooks/useScreenshot";
import { generateShareContent } from "./utils/shareContentGenerator";
import { useChatContext } from "./ChatClient/context/ChatContext";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal = ({ isOpen, onClose }: ShareModalProps) => {
  const { loading, error, takeScreenshot } = useScreenshot();
  const { messagesLeft } = useChatContext();
  const elementRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Get the original question from the first user message
  const originalQuestion = messagesLeft.find(msg => msg.role === 'user')?.content || '';

  // 檢測螢幕寬度
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDownload = async () => {
    if (!elementRef.current) return;

    try {
      const imageUrl = await takeScreenshot(elementRef.current);
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'chat-screenshot.png';
      link.click();
      onClose();
    } catch (err) {
      logger.error('Screenshot failed:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl p-6 w-[95%] max-w-5xl mx-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            下載對話截圖並分享吧！
          </h2>
          <hr className="w-full border-gray-300" />
        </div>

        {/* Share card preview */}
        <div className="max-h-[60vh] overflow-y-auto mb-6 border rounded-lg p-2">
          <div
            ref={elementRef}
            className="bg-[#F4F9FF] p-4 w-full min-w-[320px] md:min-w-full"
            id="share-card-preview"
            style={{
              // 手機版固定寬度 600px，桌面版使用 100%
              width: isMobile ? '600px' : '100%',
              minWidth: isMobile ? '600px' : '100%'
            }}
            dangerouslySetInnerHTML={{
              __html: generateShareContent(originalQuestion)
            }}
          />
        </div>

        {/* Status and Action button */}
        <div className="text-center">
          {loading && (
            <div className="mb-4 flex items-center justify-center text-gray-600">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>正在生成截圖...</span>
            </div>
          )}
          {error && (
            <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-md">
              <span>發生錯誤：{error}</span>
            </div>
          )}
          <button
            onClick={handleDownload}
            disabled={loading}
            className={`px-8 py-3 text-white rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl mx-auto w-full sm:w-auto ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
            }`}
          >
            <Download size={16} />
            <span>{loading ? '正在處理...' : '下載圖片'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};