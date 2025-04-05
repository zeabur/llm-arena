'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TermsOfService from '@/app/markdown/20250319-使用者條款-v1.3.mdx';
import PrivacyPolicy from '@/app/markdown/20250305-隱私權政策-v1.6.mdx';
import { useUser } from '@/app/contexts/UserContext';

export default function AgreementModal() {
  const [open, setOpen] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'terms' | 'privacy'>('main');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const user = useUser();

  useEffect(() => {
    // Check if user has already agreed from user object
    const hasAgreed = user.hasAgreedToTerms;

    if (!hasAgreed) {
      setOpen(true);
    }
  }, [user]);

  useEffect(() => {
    if (currentView !== 'main' && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [currentView]);

  const handleAgree = async () => {
    if (!canAgree || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/user/agreement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update agreement information');
      }

      setOpen(false);
    } catch (error) {
      console.error('Error updating agreement information:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canAgree = privacyChecked && termsChecked;

  if (!open) {
    return null;
  }

  const renderDocumentView = (
    type: 'terms' | 'privacy',
    content: React.ReactNode,
    isChecked: boolean,
    setChecked: (checked: boolean) => void,
    label: string
  ) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-[800px] max-h-[90vh] overflow-y-auto p-6 bg-white rounded-lg" ref={contentRef}>
        <div className="flex justify-end">
          <Button
            onClick={() => setCurrentView('main')}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
          >
            X
          </Button>
        </div>
        <div className="prose max-w-none mb-8">
          {content}
        </div>

        <div className="border-t pt-4 mt-8">
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id={`${type}-checkbox`}
              checked={isChecked}
              onChange={(e) => setChecked(e.target.checked)}
              className="mt-1"
            />
            <div>
              <label htmlFor={`${type}-checkbox`} className="text-sm font-medium">
                {label}
              </label>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => setCurrentView('main')}
              className="w-full"
            >
              返回協議頁面
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  if (currentView === 'terms') {
    return renderDocumentView(
      'terms',
      <TermsOfService />,
      termsChecked,
      setTermsChecked,
      '我已閱讀並同意使用者條款'
    );
  }

  if (currentView === 'privacy') {
    return renderDocumentView(
      'privacy',
      <PrivacyPolicy style={{ listStyle: 'trad-chinese-informal' }} />,
      privacyChecked,
      setPrivacyChecked,
      '我已閱讀並同意隱私權政策'
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 bg-white rounded-lg">
        <h2 className="text-xl font-bold text-center mb-4">
          使用者協議
        </h2>

        <p className="text-center">
          在使用我們的服務前，請閱讀並同意以下協議：
        </p>

        <div className="space-y-4 mt-6">
          <div className="flex flex-col space-y-2">
            <Button
              onClick={() => setCurrentView('terms')}
              variant="outline"
              className="w-full"
            >
              閱讀使用者條款
              {termsChecked && <span className="ml-2 text-green-500">✓</span>}
            </Button>
          </div>

          <div className="flex flex-col space-y-2">
            <Button
              onClick={() => setCurrentView('privacy')}
              variant="outline"
              className="w-full"
            >
              閱讀隱私權政策
              {privacyChecked && <span className="ml-2 text-green-500">✓</span>}
            </Button>
          </div>
        </div>

        <div className="text-sm text-gray-500 mt-4">
          請閱讀並同意上述協議以繼續使用本服務。您需要閱讀完整內容並在每個文件底部勾選同意選項。
        </div>

        <div className="mt-6">
          <Button
            onClick={handleAgree}
            disabled={!canAgree || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? '處理中...' : '同意並繼續'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
