"use client";

import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import logger from '@/lib/logger';

// AI 回應元件
export type AIResponseProps = {
  number: string; // AI 編號，例如 "1號" 或 "2號"
  content: string; // 回應內容
  planContent?: string; // 規劃/思考內容（可選）
  className?: string;
};

export const AIResponse = React.memo(({
  number,
  content,
  planContent,
  className = ""
}: AIResponseProps) => {
  // 思考過程預設展開，使用者可手動收合
  const [planCollapsed, setPlanCollapsed] = useState(false);
  // 調試：追蹤重新渲染
  logger.debug(`[AIResponse-${number}] Rendering with content length:`, content.length, 'at', new Date().toISOString());

  // 穩定 plugin 配置，避免每次渲染時重新創建
  const remarkPlugins = useMemo(() => [remarkGfm], []);
  const rehypePlugins = useMemo(() => [rehypeRaw, rehypeSanitize], []);

  // 穩定化內容，避免因為微小變化導致的重新渲染
  const stableContent = useMemo(() => {
    // 如果內容為空或只是載入訊息，直接返回
    if (!content || content === '思考中...' || content === '等待您的問題...') {
      return content;
    }

    // 對於實際內容，確保穩定性
    return content.trim();
  }, [content]);

  return (
    <div className={`flex-1 bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col ${className}`}>
      <div className="px-4 py-2 bg-gray-100 text-sm font-medium text-gray-500">
        <div className="inline-block bg-white rounded-full px-3 py-1">AI {number}</div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 prose prose-sm max-w-none text-sm text-gray-700">
          {planContent && (
            <div className="mb-4">
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-gray-600 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium">💭 思考過程</div>
                  <button
                    type="button"
                    className="text-[11px] text-gray-600 hover:text-gray-800 px-2 py-1 rounded border border-transparent hover:border-gray-300"
                    onClick={() => setPlanCollapsed(v => !v)}
                    aria-expanded={!planCollapsed}
                    aria-controls={`plan-${number}`}
                  >
                    {planCollapsed ? '展開' : '收合'}
                  </button>
                </div>
                {!planCollapsed && (
                  <div id={`plan-${number}`} className="whitespace-pre-wrap">
                    {planContent}
                  </div>
                )}
              </div>
            </div>
          )}
          <ReactMarkdown
            remarkPlugins={remarkPlugins}
            rehypePlugins={rehypePlugins}
          >
            {stableContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // 自定義比較函數，只有在內容真正改變時才重新渲染
  const contentChanged = prevProps.content !== nextProps.content;
  const numberChanged = prevProps.number !== nextProps.number;
  const classNameChanged = prevProps.className !== nextProps.className;

  // 如果內容長度相同且都不是載入狀態，可能是重複更新
  if (prevProps.content.length === nextProps.content.length &&
      prevProps.content.length > 10 &&
      !prevProps.content.includes('思考中') &&
      !nextProps.content.includes('思考中')) {
    // 檢查內容是否實質相同（忽略微小的空白差異）
    const prevTrimmed = prevProps.content.trim();
    const nextTrimmed = nextProps.content.trim();

    if (prevTrimmed === nextTrimmed) {
      logger.debug(`[AIResponse-${nextProps.number}] Skipping render - content unchanged`);

      return true; // 不重新渲染
    }
  }

  const shouldSkipRender = !contentChanged && !numberChanged && !classNameChanged;

  if (shouldSkipRender) {
    logger.debug(`[AIResponse-${nextProps.number}] Skipping render - no changes`);
  } else {
    logger.debug(`[AIResponse-${nextProps.number}] Will render - changes detected:`, {
      contentChanged,
      numberChanged,
      classNameChanged
    });
  }

  return shouldSkipRender;
});

// 為 React.memo 組件添加 displayName
AIResponse.displayName = 'AIResponse';
