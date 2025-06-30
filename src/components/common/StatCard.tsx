// src/components/common/StatCard.tsx

import React from "react";

// Định nghĩa kiểu (interface) cho các props mà component sẽ nhận
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  changeText: string;
}

// Export component để các file khác có thể import và sử dụng
export default function StatCard({
  title,
  value,
  icon,
  changeText,
}: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {icon}
      </div>
      <div className="mt-2">
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        <p className="text-xs text-green-600 mt-1">{changeText}</p>
      </div>
    </div>
  );
}
