/**
 * 生成分享用的聊天內容 HTML
 */
export const generateShareContent = (originalQuestion?: string): string => {
  try {
    // 生成題目部分的 HTML
    const questionHtml = originalQuestion
      ? `<div class="text-center mb-10 mt-6">
           <div class="text-gray-500 text-lg leading-relaxed">${originalQuestion}</div>
         </div>`
      : '';

    // 尋找統一的 AI 回應容器
    const aiContainer = document.getElementById('ai-responses-container');

    if (!aiContainer) {
      return questionHtml + '<div class="text-center text-gray-500 p-10">等待您的問題...</div>';
    }

    // 克隆並清理內容
    const clonedContent = cloneAndCleanContent(aiContainer);

    // 組合題目和回應內容，添加強制桌面版布局的樣式
    const wrappedContent = `
      <style>
        /* 強制桌面版布局樣式 */
        .md\\:hidden { display: none !important; }
        .hidden.md\\:flex, .hidden { display: flex !important; }
        .w-1\\/2 { width: 50% !important; }
        .flex-row { display: flex !important; flex-direction: row !important; }
        .gap-4 { gap: 1rem !important; }
        
        /* 針對固定寬度的優化 */
        * { 
          box-sizing: border-box !important; 
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
        
        /* 確保文字不會溢出 */
        p, div, span { 
          max-width: 100% !important; 
          word-break: break-word !important;
        }
        
        /* 調整圖片大小 */
        img { 
          max-width: 100% !important; 
          height: auto !important; 
        }
      </style>
      ${questionHtml}${clonedContent}
    `;

    return wrappedContent;
  } catch {
    // 生成分享內容失敗時，不阻斷流程

    return '<div class="text-center text-gray-500 p-10">預覽生成失敗</div>';
  }
};

/**
 * 克隆並清理內容
 */
const cloneAndCleanContent = (container: HTMLElement): string => {
  const cloned = container.cloneNode(true) as HTMLElement;

  // 移除不需要的按鈕和輸入框
  cloned.querySelectorAll('button, input, textarea').forEach(el => el.remove());

  // 移除分享相關元素
  cloned.querySelectorAll('[id*="share"]').forEach(el => el.remove());

  // 移除收合狀態的思考過程區塊
  // 查找所有思考過程容器，檢查是否有收合狀態的內容
  cloned.querySelectorAll('.bg-gray-50.border.border-gray-200.rounded-md').forEach(thinkingBlock => {
    const thinkingContent = thinkingBlock.querySelector('[id^="plan-"]');
    // 如果思考過程內容不存在（被收合），則移除整個思考過程區塊
    if (!thinkingContent) {
      const parentDiv = thinkingBlock.parentElement;
      if (parentDiv && parentDiv.classList.contains('mb-4')) {
        parentDiv.remove();
      } else {
        thinkingBlock.remove();
      }
    }
  });

  // 強制使用桌面版布局 - 隱藏手機版的水平滾動容器
  cloned.querySelectorAll('.md\\:hidden').forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });

  // 強制顯示桌面版的並排布局
  cloned.querySelectorAll('.hidden.md\\:flex').forEach(el => {
    (el as HTMLElement).style.display = 'flex';
    (el as HTMLElement).classList.remove('hidden');
    (el as HTMLElement).classList.add('flex');
  });

  return cloned.innerHTML;
};