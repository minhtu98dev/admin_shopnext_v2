import React from "react";
import { cookies } from "next/headers";
import {
  getOrders_Server,
  getUsers_Server,
  getProducts_Server,
} from "@/lib/api";
import StatCards from "@/components/features/dashboard/StatCards";
import RecentOrders from "@/components/features/dashboard/RecentOrders";
import TopSellingProducts from "@/components/features/dashboard/TopSellingProducts";

export default async function DashboardPage() {
  try {
    // ✅ Lấy token từ cookie
    const token = cookies().get("authToken")?.value;
    if (!token) throw new Error("Yêu cầu xác thực.");

    // ✅ Gọi API song song
    const [orders, users, productsRes] = await Promise.all([
      getOrders_Server(token),
      getUsers_Server(token),
      getProducts_Server({ page: 1, limit: 1000 }),
    ]);

    const products = productsRes.products;

    // ✅ Tính tổng doanh thu ALL TIME
    const totalRevenueAllTime = orders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );

    // ✅ Tính doanh thu tháng này & tháng trước
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const ordersThisMonth = orders.filter(
      (o) => new Date(o.createdAt) >= startOfThisMonth
    );
    const ordersLastMonth = orders.filter(
      (o) =>
        new Date(o.createdAt) >= startOfLastMonth &&
        new Date(o.createdAt) < startOfThisMonth
    );

    const revenueThisMonth = ordersThisMonth.reduce(
      (sum, o) => sum + Number(o.totalAmount || 0),
      0
    );
    const revenueLastMonth = ordersLastMonth.reduce(
      (sum, o) => sum + Number(o.totalAmount || 0),
      0
    );

    const percentRevenueChange = revenueLastMonth
      ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100
      : 0;

    const percentOrderChange = ordersLastMonth.length
      ? ((ordersThisMonth.length - ordersLastMonth.length) /
          ordersLastMonth.length) *
        100
      : 0;

    // ✅ Tính số user và sản phẩm
    const totalUsers = users.length;
    const totalProducts = products.length;

    // ✅ Đơn hàng gần đây
    const recentOrders = [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);

    // ✅ SP bán chạy — demo random
    const topSellingProducts = [...products].slice(0, 5).map((p) => {
      const sold = Math.floor(Math.random() * 200) + 50;
      return {
        ...p,
        sold,
        revenue: Number(p.price || 0) * sold,
      };
    });

    return (
      <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-full">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

        <StatCards
          revenueThisMonth={revenueThisMonth}
          percentRevenueChange={percentRevenueChange}
          ordersThisMonth={ordersThisMonth.length}
          percentOrderChange={percentOrderChange}
          totalRevenueAllTime={totalRevenueAllTime}
          totalUsers={totalUsers}
          totalProducts={totalProducts}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <RecentOrders recentOrders={recentOrders} />
          <TopSellingProducts topProducts={topSellingProducts} />
        </div>
      </div>
    );
  } catch (err) {
    return (
      <div className="p-6 text-center text-red-500">
        Lỗi Dashboard:{" "}
        {err instanceof Error ? err.message : "Lỗi không xác định"}
      </div>
    );
  }
}
