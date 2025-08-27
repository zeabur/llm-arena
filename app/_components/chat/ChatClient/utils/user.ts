'use client';

import type { User } from '@/app/contexts/UserContext';

export function getDisplayUsername(user: User | null): string {
  const name = user?.username?.trim();

  return name && name.length > 0 ? name : '知識狂熱士';
}
