'use client';

import { createContext, useContext } from 'react';

export interface User {
	_id: string;
	username: string;
	avatar: string;
	hasAgreedToTerms?: boolean;
}

export const UserContext = createContext<User | null>(null);

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}