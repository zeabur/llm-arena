'use client';

import { Card } from '@/components/ui/card';
import TermsOfService from '@/app/markdown/20250319-使用者條款-v1.3.mdx';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg">
        <div className="prose max-w-none">
          <TermsOfService />
        </div>
      </Card>
    </div>
  );
}
