// src/components/common/AdminSidebarNav.tsx
"use client"; // Bắt buộc phải là Client Component để dùng hook

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users } from "lucide-react";

// Danh sách các link và icon tương ứng
const navLinks = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/orders", label: "Đơn hàng", icon: ShoppingCart },
  { href: "/products", label: "Sản phẩm", icon: Package },
  { href: "/users", label: "Người dùng", icon: Users },
];

export default function AdminSidebarNav() {
  // Dùng hook usePathname để lấy đường dẫn URL hiện tại
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-2">
      {navLinks.map((link) => {
        const isActive = pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-[13px] hover:text-gray-300 font-semibold  ${
              isActive ? "bg-gray-100 text-black " : "text-gray-500"
            }`}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
