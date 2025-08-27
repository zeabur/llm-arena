import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { Toaster } from "@/components/ui/toaster";
import { verifyToken } from "@/lib/jwt";
import { getDb } from "@/lib/mongo";
import logger from '@/lib/logger';
import { UserProvider } from './providers/UserProvider';
import AgreementModal from './_components/AgreementModal';
import Header from './_components/Header';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FreeSEED 聊天機器人競技場",
  description: "測試系統、提出問題並提供回饋，甚至進一步補充「正確」的答案。這些回饋資料可以協助我們打造更好的模型。",
  openGraph: {
    images: [
      {
        url: "https://cdn.zeabur.com/freeseed/freeseed.png",
      },
    ],
  },
};

const getUserByID = async (userID: ObjectId) => {
  const db = await getDb('arena');

  return await db.collection('users').findOne({ _id: userID });
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  let user = null;

  if (token) {
    try {
      const userID = verifyToken(token);
      user = await getUserByID(userID);
    } catch (error) {
      // Token 無效，但不重定向，讓使用者留在當前頁面
      logger.warn('Invalid token:', error);
    }
  }

  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen h-full flex flex-col`}>
        <UserProvider user={user ? {
          _id: user._id.toString(),
          username: user.username,
          avatar: user.avatar,
          hasAgreedToTerms: user.hasAgreedToTerms || false
        } : null}>
          <Header />
          <div className="flex-grow">
            {children}
          </div>
          <Toaster />
          <AgreementModal />
        </UserProvider>
      </body>
    </html>
  );
}
