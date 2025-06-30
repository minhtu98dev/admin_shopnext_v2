import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import {
  getOrders_Server,
  getUsers_Server,
  getProducts_Server,
} from "@/lib/api";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react"; // Thay icon cho phù hợp
import StatCard from "@/components/common/StatCard";

export default async function DashboardPage() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("authToken")?.value;
    if (!token) throw new Error("Yêu cầu xác thực.");

    const [orders, users, products] = await Promise.all([
      getOrders_Server(token),
      getUsers_Server(token),
      getProducts_Server(),
    ]);

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const totalOrders = orders.length;
    const totalUsers = users.length;
    const totalProducts = products.length;

    const recentOrders = [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);

    const topSellingProducts = [...products].slice(0, 5).map((p) => ({
      ...p,
      sold: Math.floor(Math.random() * 200) + 50,
      revenue: p.price * (Math.floor(Math.random() * 200) + 50),
    }));

    return (
      <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-full">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

        {/* Hàng chứa các thẻ thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Tổng doanh thu"
            value={`${totalRevenue.toLocaleString("vi-VN")} ₫`}
            icon={<DollarSign className="w-3.5 h-3.5 text-gray-600" />}
            changeText="+23.1% so với tháng trước"
          />
          <StatCard
            title="Tổng đơn hàng"
            value={totalOrders.toLocaleString("vi-VN")}
            icon={<ShoppingCart className="w-3.5 h-3.5 text-gray-600" />}
            changeText="+18.1% so với tháng trước"
          />
          <StatCard
            title="Tổng khách hàng"
            value={totalUsers.toLocaleString("vi-VN")}
            icon={<Users className="w-3.5 h-3.5 text-gray-600" />}
            changeText="+5.2% so với tháng trước"
          />
          <StatCard
            title="Tổng sản phẩm"
            value={totalProducts.toLocaleString("vi-VN")}
            icon={<Package className="w-3.5 h-3.5 text-gray-600" />} // Dùng icon Package cho sản phẩm
            changeText="Cập nhật hôm nay"
          />
        </div>

        {/* Hàng chứa 2 card lớn */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Card Đơn hàng gần đây */}
          <div className="xl:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Đơn hàng gần đây
              </h2>
              <Link
                href="/orders"
                className="text-sm font-medium text-indigo-600 hover:underline"
              >
                Xem tất cả
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b-2 border-gray-100">
                  <tr className="text-left text-xs text-gray-500 uppercase">
                    <th className="py-3 font-semibold">Đơn hàng</th>
                    <th className="py-3 font-semibold">Khách hàng</th>
                    <th className="py-3 font-semibold text-right">Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-t border-gray-100">
                      <td className="py-3 text-sm font-mono text-gray-700">
                        #{order._id.slice(-6)}
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {order.shippingAddress.fullName}
                      </td>
                      <td className="py-3 text-sm font-semibold text-gray-800 text-right">
                        {order.totalAmount.toLocaleString("vi-VN")}₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card Sản phẩm bán chạy */}
          <div className="xl:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Sản phẩm bán chạy
            </h2>
            <div className="space-y-4">
              {topSellingProducts.map((product) => (
                <div key={product._id} className="flex items-center gap-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div className="flex-grow">
                    <p className="text-sm font-semibold text-gray-800">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.sold} đã bán
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {product.revenue.toLocaleString("vi-VN")}₫
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Lỗi không xác định");
    return (
      <div className="p-6 text-center text-red-500">
        Lỗi tải dữ liệu Dashboard: {error.message}
      </div>
    );
  }
}
