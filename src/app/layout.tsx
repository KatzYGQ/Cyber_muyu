import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "赛博木鱼 · Cyber Muyu",
  description: "全球累计功德",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen bg-[var(--bg)] text-stone-100">
        {children}
      </body>
    </html>
  );
}
