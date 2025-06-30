// src/app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra token trong localStorage
    const token = localStorage.getItem("authToken");

    if (token) {
      // Nếu có token, chuyển đến trang dashboard
      router.push("/dashboard");
    } else {
      // Nếu không có, chuyển đến trang đăng nhập
      router.push("/login");
    }
  }, [router]);

  // Hiển thị một thông báo loading trong lúc chờ điều hướng
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Đang chuyển hướng...</p>
    </div>
  );
}
