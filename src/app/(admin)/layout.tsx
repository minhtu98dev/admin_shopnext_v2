// src/app/(admin)/layout.tsx

import React from "react";
import Link from "next/link";
import LogoutButton from "@/components/common/LogoutButton";
import AdminSidebarNav from "@/components/common/AdminSidebarNav"; // Import component menu mới
import { LayoutDashboard } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Sidebar đã thiết kế lại */}
      <aside className="hidden w-64 flex-col border-r border-gray-200  sm:flex">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center px-6">
            <Link
              className="flex items-center gap-2 font-semibold"
              href="/dashboard"
            >
              <LayoutDashboard className="h-6 w-6 text-black" />
              <span className="text-xl font-bold">Admin Panel</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2 px-4">
            {/* Sử dụng component menu đã tạo ở Bước 1 */}
            <AdminSidebarNav />
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col ">
        {/* Header đã thiết kế lại */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-gray-200 bg-gray-50 px-6 ">
          <div className="flex items-end gap-4 ml-auto">
            <LogoutButton />
          </div>
        </header>

        {/* Nội dung chính của trang */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
