// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
// 1. Import Toaster từ sonner
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Quản lý cửa hàng của bạn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {children}
        {/* 2. Đặt Toaster ở đây, phía trên thẻ đóng body */}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
