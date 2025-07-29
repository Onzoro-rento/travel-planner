import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import Header from "@/components/layout/Header";
import { NextAuthProvider } from "@/lib/auth/provider";
import NextAuth from "next-auth";
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
        <Header />
        {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
