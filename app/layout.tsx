import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { Toaster } from "@/components/ui/toaster";
import { verifyToken } from "@/lib/jwt";
import getMongoClient from "@/lib/mongo";
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
  const mongo = await getMongoClient();

  try {
    return await mongo.db('arena').collection('users').findOne({ _id: userID });
  } finally {
    await mongo.close();
  }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!process.env.OAUTH_CALLBACK_URL) {
    throw new Error('OAUTH_CALLBACK_URL is not set');
  }

  const oauthCallbackURLEncoded = encodeURIComponent(process.env.OAUTH_CALLBACK_URL)
  const oauthURL = `https://discord.com/oauth2/authorize?client_id=${process.env.OAUTH_CLIENT_ID}&response_type=code&redirect_uri=${oauthCallbackURLEncoded}&scope=identify+email`

  if (!token) {
    redirect(oauthURL)
  }

  let userID;

  try {
    userID = verifyToken(token)
  } catch {
    redirect(oauthURL)
  }

  const user = await getUserByID(userID);

  if (!user) {
    redirect(oauthURL)
  }

  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen h-full flex flex-col`}>
        <UserProvider user={{
          _id: user._id.toString(),
          username: user.username,
          avatar: user.avatar,
          hasAgreedToTerms: user.hasAgreedToTerms || false
        }}>
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
