// src/app/(auth)/layout.tsx

import React from "react";

// Layout này là một function component đơn giản, đồng bộ
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Nó phải trả về JSX
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* children ở đây chính là page.tsx của trang /login */}
      {children}
    </main>
  );
}
