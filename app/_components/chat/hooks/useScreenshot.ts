import { useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
import logger from '@/lib/logger';

export const useScreenshot = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const takeScreenshot = useCallback(async (element: HTMLElement) => {
    if (!element) {
      const err = new Error('Screenshot target element not found');
      setError(err.message);
      throw err;
    }

    setLoading(true);
    setError(null);

    try {
      // 檢測是否為手機版 (寬度小於 768px)
      const isMobile = window.innerWidth < 768;
      // 手機版使用固定寬度 600px，桌面版使用原本的 scrollWidth
      const targetWidth = isMobile ? 600 : element.scrollWidth;

      const options = {
        // Use device pixel ratio for better quality on high-res screens (mobile)
        pixelRatio: window.devicePixelRatio || 2,
        // 手機版使用固定寬度，桌面版使用 scroll dimensions
        width: targetWidth,
        height: element.scrollHeight,
        // A fix for some images not loading
        cacheBust: true,
      };

      const dataUrl = await toPng(element, options);

      return dataUrl;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      logger.error('Screenshot failed:', err);
      throw err; // Re-throw to be caught in the component
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, takeScreenshot };
};
