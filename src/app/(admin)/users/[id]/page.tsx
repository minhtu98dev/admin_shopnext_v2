// src/app/(admin)/users/[id]/page.tsx

import { getUserById_Server, getOrdersByUserId_Server } from "@/lib/api";
import { User, Order } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { ArrowLeftCircle, ShieldCheck, ShieldOff } from "lucide-react";

// Helper Component nhỏ để hiển thị trạng thái
const StatusBadge = ({
  status,
  type,
}: {
  status: string;
  type: "payment" | "delivery";
}) => {
  let classes = "px-2 py-1 text-xs font-medium rounded-full ";
  let text = "";
  if (type === "payment") {
    classes +=
      status === "paid"
        ? "bg-green-100 text-green-800"
        : "bg-yellow-100 text-yellow-800";
    text = status === "paid" ? "Đã thanh toán" : "Chờ xử lý";
  } else {
    classes +=
      status === "delivered"
        ? "bg-blue-100 text-blue-800"
        : "bg-gray-100 text-gray-800";
    text = status === "delivered" ? "Đã giao" : "Chưa giao";
  }
  return <span className={classes}>{text}</span>;
};

// Component chính của trang
export default async function UserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("authToken")?.value;
    if (!token) throw new Error("Yêu cầu xác thực. Vui lòng đăng nhập lại.");

    // Gọi song song 2 API để lấy dữ liệu hiệu quả
    const [user, userOrders] = await Promise.all([
      getUserById_Server(params.id, token),
      getOrdersByUserId_Server(params.id, token), // Gọi API lấy đơn hàng của riêng user này
    ]);

    return (
      <div className="p-4 sm:p-6 space-y-6">
        <Link
          href="/users"
          className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-2"
        >
          <ArrowLeftCircle size={20} />
          Quay lại danh sách người dùng
        </Link>

        {/* Card thông tin người dùng */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Image
              src={user.avatar || "/default-avatar.png"}
              alt={`Avatar của ${user.name}`}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full border-2 border-gray-200 object-cover"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                {user.name}
                {user.isAdmin ? (
                  <ShieldCheck
                    className="w-7 h-7 text-green-600"
                    title="Admin"
                  />
                ) : (
                  <ShieldOff className="w-7 h-7 text-gray-400" title="User" />
                )}
              </h1>
              <a
                href={`mailto:${user.email}`}
                className="text-gray-500 hover:text-blue-600"
              >
                {user.email}
              </a>
              {user.createdAt && (
                <p className="text-sm text-gray-400 mt-1">
                  Tham gia ngày:{" "}
                  {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bảng lịch sử đơn hàng */}
        <div className="bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold p-6 border-b">
            Lịch sử đơn hàng ({userOrders.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID Đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ngày đặt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Thanh toán
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Giao hàng
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {userOrders.length > 0 ? (
                  userOrders.map((order: Order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 font-mono text-sm text-gray-700">
                        ...{order._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        {order.totalAmount.toLocaleString("vi-VN")} ₫
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge
                          status={order.paymentStatus}
                          type="payment"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge
                          status={order.isDelivered ? "delivered" : "pending"}
                          type="delivery"
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/orders/${order._id}`}
                          className="text-indigo-600 hover:text-indigo-900 hover:underline text-sm font-medium"
                        >
                          Xem chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500">
                      Người dùng này chưa có đơn hàng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <h1 className="text-2xl font-bold mb-4">
          Không thể tải thông tin người dùng
        </h1>
        <p className="text-gray-600">{(error as Error).message}</p>
        <Link
          href="/users"
          className="mt-6 inline-flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          <ArrowLeftCircle size={20} /> Quay lại danh sách
        </Link>
      </div>
    );
  }
}
