'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/app/logo.webp';
import UserDropdown from '@/components/header/UserDropdown';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="w-full py-2 border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* 桌面版 Header */}
        <div className="hidden md:flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={logo}
                alt="FreeSEED"
                width={32}
                height={32}
                className="rounded-sm"
              />
              <span className="text-xl font-medium text-gray-700">FreeSEED</span>
            </Link>
            <nav className="flex space-x-6">
              <Link
                href="/"
                className={`flex items-center space-x-2 px-3 py-1 ${isActive('/') ? 'text-blue-500 bg-blue-50 rounded-md' : 'text-gray-600 hover:text-blue-500'}`}
              >
                <img src="/icons/nav/chat.svg" alt="Chat" width={20} height={20} />
                <span>AI對話</span>
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <UserDropdown isDesktop={true} />
            <Link href="/daily-topic" className="hidden bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600 transition-colors flex items-center space-x-2">
              <img src="/icons/nav/bulb-white.svg" alt="Bulb" width={18} height={18} />
              <span>每日主題</span>
            </Link>
          </div>
        </div>

        {/* 手機版 Header */}
        <div className="flex md:hidden justify-between items-center relative" ref={menuRef}>
          <button
            className="text-gray-600 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={logo}
              alt="FreeSEED"
              width={28}
              height={28}
              className="rounded-sm"
            />
            <span className="text-xl font-medium text-gray-700">FreeSEED</span>
          </Link>

          <div className="flex items-center space-x-2">
            <UserDropdown isDesktop={false} onOpen={() => setIsMenuOpen(false)} />
            <Link href="/daily-topic" className="hidden focus:outline-none">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <img src="/icons/nav/bulb-white.svg" alt="Bulb" width={20} height={20} />
              </div>
            </Link>
          </div>

          {/* 手機版下拉選單 */}
          {isMenuOpen && (
            <div className="absolute left-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-lg border z-50">
              <nav className="py-5 px-2">
                <Link
                  href="/"
                  className={`flex items-center space-x-3 py-2 px-3 mx-2 ${isActive('/') ? 'text-blue-500 bg-blue-50 rounded-xl' : 'text-gray-700 hover:text-blue-500 hover:bg-gray-50 rounded-xl'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <img src="/icons/nav/chat.svg" alt="Chat" width={18} height={18} />
                  <span className="text-base">AI對話</span>
                </Link>
                <Link
                  href="/game"
                  className={`hidden items-center space-x-3 py-2 px-3 mx-2 ${isActive('/game') ? 'text-blue-500 bg-blue-50 rounded-xl' : 'text-gray-700 hover:text-blue-500 hover:bg-gray-50 rounded-xl'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <img src="/icons/nav/game.svg" alt="Game" width={18} height={18} />
                  <span className="text-base">AI遊戲</span>
                </Link>
                <Link
                  href="/hot"
                  className={`hidden items-center space-x-3 py-2 px-3 mx-2 ${isActive('/hot') ? 'text-blue-500 bg-blue-50 rounded-xl' : 'text-gray-700 hover:text-blue-500 hover:bg-gray-50 rounded-xl'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <img src="/icons/nav/fire.svg" alt="Fire" width={18} height={18} />
                  <span className="text-base">熱門探索</span>
                </Link>
              </nav>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
