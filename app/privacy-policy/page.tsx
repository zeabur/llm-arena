'use client';

import { Card } from '@/components/ui/card';
import PrivacyPolicy from '@/app/markdown/20250305-隱私權政策-v1.6.mdx';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg">
        <div className="prose max-w-none">
          <PrivacyPolicy style={{ listStyle: 'trad-chinese-informal' }} />
        </div>
      </Card>
    </div>
  );
}
