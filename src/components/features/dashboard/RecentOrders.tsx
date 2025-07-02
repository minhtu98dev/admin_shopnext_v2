"use client";

import Link from "next/link";
import { Order } from "@/types";

export default function RecentOrders({
  recentOrders,
}: {
  recentOrders: Order[];
}) {
  return (
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
            <tr className="text-left text-xs text-gray-800 uppercase">
              <th className="py-3 font-bold">Đơn hàng</th>
              <th className="py-3 font-bold">Khách hàng</th>
              <th className="py-3 font-bold text-right">Số tiền</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order._id} className="border-t border-gray-100">
                <td className="py-3 text-sm font-mono text-gray-700">
                  #{order._id.slice(-6)}
                </td>
                <td className="py-3 text-sm text-gray-600">
                  {order.shippingAddress?.fullName || "Không có tên"}
                </td>
                <td className="py-3 text-sm font-semibold text-gray-800 text-right">
                  {Number(order.totalAmount || 0).toLocaleString("vi-VN")}₫
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
