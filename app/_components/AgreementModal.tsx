'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TermsOfService from '@/app/markdown/20250319-使用者條款-v1.3.mdx';
import PrivacyPolicy from '@/app/markdown/20250305-隱私權政策-v1.6.mdx';
import { useUser } from '@/app/contexts/UserContext';
import { Checkbox } from '@/components/ui/checkbox';

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
    } catch {
      // Error occurred, but we don't need to log it here
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

        <p className="text-center mb-6">
          在使用我們的服務前，請閱讀並同意以下協議：
        </p>

        <div className="space-y-4 mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms-checkbox"
              checked={termsChecked}
              onChange={(e) => setTermsChecked(e.target.checked)}
              className="peer"
            />
            <label
              htmlFor="terms-checkbox"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              <Button
                variant="link"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentView('terms');
                }}
                className="p-0 h-auto text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                使用者條款
              </Button>
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="privacy-checkbox"
              checked={privacyChecked}
              onChange={(e) => setPrivacyChecked(e.target.checked)}
              className="peer"
            />
            <label
              htmlFor="privacy-checkbox"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              <Button
                variant="link"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentView('privacy');
                }}
                className="p-0 h-auto text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                隱私權政策
              </Button>
            </label>
          </div>
        </div>

        <div className="mt-6">
          {(() => {
            let buttonText = '請勾選所有協議';

            if (isSubmitting) {
              buttonText = '處理中...';
            } else if (canAgree) {
              buttonText = '同意並繼續';
            }

            return (
              <Button
                onClick={handleAgree}
                disabled={!canAgree || isSubmitting}
                className="w-full"
              >
                {buttonText}
              </Button>
            );
          })()}
        </div>
      </Card>
    </div>
  );
}
