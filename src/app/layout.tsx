import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Nav from "@/components/nav";
import PageViewTracker from "@/components/page-view-tracker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Josh | 部落格與自我介紹",
  description: "個人部落格與自我介紹網站",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col bg-[#05070d] text-slate-100">
        <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(56,189,248,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.05)_1px,transparent_1px)] bg-[size:28px_28px]" />
        <div className="pointer-events-none fixed -top-32 -left-32 z-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="pointer-events-none fixed top-1/3 -right-32 z-0 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/5 blur-[110px]" />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          <PageViewTracker />
          <Nav />
          <div className="flex flex-1 flex-col">{children}</div>
        </div>
      </body>
    </html>
  );
}
