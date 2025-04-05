'use client';

import { ReactNode } from 'react';
import { UserContext } from '../contexts/UserContext';

interface UserProviderProps {
	readonly user: {
		_id: string;
		username: string;
		avatar: string;
		hasAgreedToTerms?: boolean;
	}
	readonly children: ReactNode;
}

export function UserProvider({ user, children }: UserProviderProps) {
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}