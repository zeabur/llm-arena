'use client';

import Link from 'next/link';
import Image from 'next/image';
import logo from '@/app/logo.webp';

export default function Header() {
  return (
    <header className="w-full py-2 border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-gray-500">
          <div className="flex gap-4 items-center">
            <Link
              href="https://FreeSEED.ai"
              target="_blank"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src={logo}
                alt="FreeSEED"
                width={32}
                height={32}
                className="rounded-sm"
              />
            </Link>
            <Link
              href="/"
              className="hover:text-gray-700 hover:underline"
            >
              首頁
            </Link>
            <Link
              href="/terms-of-service"
              target="_blank"
              className="hover:text-gray-700 hover:underline"
            >
              使用者條款
            </Link>
            <Link
              href="/privacy-policy"
              target="_blank"
              className="hover:text-gray-700 hover:underline"
            >
              隱私權政策
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
