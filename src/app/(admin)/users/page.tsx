// src/app/(admin)/users/page.tsx
import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { getUsers_Server, getOrders_Server } from "@/lib/api";
import { User, Order } from "@/types";
import { ShieldCheck, ShieldOff } from "lucide-react";

interface UserWithOrderCount extends User {
  orderCount: number;
}

export default async function UsersPage() {
  let users: UserWithOrderCount[] = [];
  let error: string | null = null;

  try {
    const cookieStore = cookies();
    const token = cookieStore.get("authToken")?.value;
    if (!token) throw new Error("Yêu cầu xác thực. Vui lòng đăng nhập lại.");

    const [allUsers, allOrders] = await Promise.all([
      getUsers_Server(token),
      getOrders_Server(token),
    ]);

    const orderCountMap = new Map<string, number>();
    for (const order of allOrders) {
      if (order.user?._id) {
        const userId = order.user._id.toString();
        orderCountMap.set(userId, (orderCountMap.get(userId) || 0) + 1);
      }
    }

    users = allUsers.map((user) => ({
      ...user,
      orderCount: orderCountMap.get(user._id.toString()) || 0,
    }));
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "Lỗi không xác định khi tải dữ liệu.";
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <h1 className="text-2xl font-bold mb-4">Đã xảy ra lỗi</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý Người dùng</h1>
        <p className="text-gray-600 font-medium">
          Tổng số: {users.length} người dùng
        </p>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tên Người dùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Quyền Admin
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Số đơn hàng
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 font-mono text-sm">
                  ...{user._id.slice(-6)}
                </td>
                <td className="px-6 py-4 font-medium">
                  <Link
                    href={`/users/${user._id}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {user.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-center">
                  {user.isAdmin ? (
                    <ShieldCheck className="w-5 h-5 text-green-500 mx-auto" />
                  ) : (
                    <ShieldOff className="w-5 h-5 text-gray-400 mx-auto" />
                  )}
                </td>
                <td className="px-6 py-4 text-center font-semibold">
                  {user.orderCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
