"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccountDropdown() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.log(error);
      alert("Không thể đăng xuất, vui lòng thử lại.");
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className="p-2 rounded-full hover:bg-gray-100"
        onClick={() => setOpen((v) => !v)}
      >
        <User className="w-6 h-6" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-[150px] bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          <button
            className="flex items-center w-full gap-3 px-4 py-2 text-red-500 hover:bg-gray-100"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" /> Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
