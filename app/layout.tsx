import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import { NextAuthProvider } from "@/lib/auth/provider";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
const inter = Inter({ subsets: ['latin'] })



export const metadata: Metadata = {
  title: "旅プランナー",
  description: "友達と一緒に旅行を計画しよう！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={inter.className}
      >
        <NextAuthProvider>
          <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            {/* ヘッダー - 固定 */}
            <Header />
            
            {/* メインレイアウト */}
            <div className="flex flex-1 min-h-0">
              {/* メインコンテンツエリア */}
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>

              {/* サイドバー - 固定 */}
              <Sidebar />
            </div>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
