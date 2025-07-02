"use client";

import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import StatCard from "@/components/common/StatCard";

interface StatCardsProps {
  revenueThisMonth: number;
  percentRevenueChange: number;
  ordersThisMonth: number;
  percentOrderChange: number;
  totalRevenueAllTime: number;
  totalUsers: number;
  totalProducts: number;
}

export default function StatCards({
  revenueThisMonth,
  percentRevenueChange,
  ordersThisMonth,
  percentOrderChange,
  totalRevenueAllTime,
  totalUsers,
  totalProducts,
}: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 ">
      <StatCard
        title="Tổng doanh thu"
        value={`${totalRevenueAllTime.toLocaleString("vi-VN")} ₫`}
        icon={<DollarSign className="w-3.5 h-3.5 text-gray-600" />}
        changeText="Cộng dồn từ trước đến nay"
      />
      <StatCard
        title="Doanh thu tháng này"
        value={`${revenueThisMonth.toLocaleString("vi-VN")} ₫`}
        icon={<DollarSign className="w-3.5 h-3.5 text-gray-600" />}
        changeText={`${percentRevenueChange.toFixed(1)}% so với tháng trước`}
      />

      <StatCard
        title="Đơn hàng tháng này"
        value={ordersThisMonth.toLocaleString("vi-VN")}
        icon={<ShoppingCart className="w-3.5 h-3.5 text-gray-600" />}
        changeText={`${percentOrderChange.toFixed(1)}% so với tháng trước`}
      />
      <StatCard
        title="Tổng khách hàng"
        value={totalUsers.toLocaleString("vi-VN")}
        icon={<Users className="w-3.5 h-3.5 text-gray-600" />}
        changeText="Cập nhật hôm nay"
      />
      <StatCard
        title="Tổng sản phẩm"
        value={totalProducts.toLocaleString("vi-VN")}
        icon={<Package className="w-3.5 h-3.5 text-gray-600" />}
        changeText="Cập nhật hôm nay"
      />
    </div>
  );
}
