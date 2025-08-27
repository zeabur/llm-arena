'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/app/contexts/UserContext';
import logger from '@/lib/logger';
import DiscordButton from './DiscordButton';

interface UserDropdownProps {
  isDesktop?: boolean;
  onOpen?: () => void;
}

export default function UserDropdown({ isDesktop = true, onOpen }: UserDropdownProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = useUser();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleProfile = () => {
    if (!isProfileOpen && onOpen) {
      onOpen(); // 關閉其他選單
    }

    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.redirectUrl;
      }
    } catch (error) {
      logger.error('Logout failed:', error);
    }
  };

  return (
    <div className="relative" ref={profileRef}>
      <button
        onClick={toggleProfile}
        className={`w-10 h-10 ${isDesktop ? 'rounded-full' : 'rounded-lg'} bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors focus:outline-none`}
      >
        <img src="/icons/nav/profile.svg" alt="Profile" width={20} height={20} />
      </button>

      {isProfileOpen && (
        <div className="absolute mt-2 w-72 max-w-[calc(100vw-1rem)] bg-white rounded-2xl shadow-lg py-5 z-50 border
                        -left-14 -translate-x-1/2 xs:left-1/2 xs:-translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0">
          {user ? (
            <>
              {/* 使用者資訊區域 */}
              <div className="px-5 pb-5">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{user.username}</h3>
                    <div className="hidden items-center space-x-1">
                      <span className="text-lg font-bold text-gray-900">積分</span>
                      <span className="text-lg font-bold text-blue-500">3000</span>
                    </div>
                    <div className="hidden items-center space-x-1">
                      <span className="text-lg font-bold text-gray-900">稱號</span>
                      <span className="text-lg font-bold text-blue-500">智慧之樹</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-full overflow-hidden m-2">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* 按鈕區域 */}
              <div className="px-5 space-y-3">
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors text-center border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  登出
                </button>
                <DiscordButton
                  isDesktop={isDesktop}
                  onClose={() => setIsProfileOpen(false)}
                />
              </div>
            </>
          ) : (
            <>
              {/* 按鈕區域 */}
              <div className="px-5 py-5 space-y-3">
                <Link
                  href="/api/auth/login"
                  className="block w-full py-2 text-gray-600 hover:text-gray-800 transition-colors text-center border border-gray-200 rounded-xl hover:bg-gray-50"
                  onClick={() => setIsProfileOpen(false)}
                >
                  登入
                </Link>
                <DiscordButton
                  isDesktop={isDesktop}
                  onClose={() => setIsProfileOpen(false)}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}