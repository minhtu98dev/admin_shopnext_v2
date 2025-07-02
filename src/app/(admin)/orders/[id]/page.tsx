// src/app/(admin)/orders/[id]/page.tsx

import { getOrderById_Server } from "@/lib/api";
import UpdateOrderActions from "@/components/features/order/UpdateOrderActions";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowLeftCircle, AlertTriangle } from "lucide-react";
import { Order } from "@/types";
import { ReactNode } from "react";

// --- Helper Components được thiết kế lại ---

// Component Card chung cho các khối thông tin
const Card = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="bg-white rounded-xl shadow-md">
    <div className="p-6 border-b border-slate-200">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
    </div>
    <div className="p-6 space-y-4">{children}</div>
  </div>
);

// Component hiển thị một dòng thông tin (key-value)
const ItemRow = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex justify-between items-center py-2">
    <p className="text-slate-500">{label}</p>
    <div className="text-right font-medium text-slate-700">{value}</div>
  </div>
);

// Component hiển thị trạng thái tinh tế hơn
const StatusIndicator = ({
  isSuccess,
  text,
}: {
  isSuccess: boolean;
  text: string;
}) => (
  <div className="flex items-center justify-end gap-2">
    <span
      className={`h-2 w-2 rounded-full ${
        isSuccess ? "bg-green-500" : "bg-amber-500"
      }`}
    />
    <span>{text}</span>
  </div>
);

// --- Component chính của trang ---

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let order: Order | null = null;
  let error: string | null = null;

  try {
    const cookieStore = cookies();
    const token = cookieStore.get("authToken")?.value;
    if (!token) throw new Error("Yêu cầu xác thực. Vui lòng đăng nhập lại.");

    order = await getOrderById_Server(params.id, token);
  } catch (err) {
    console.error("Failed to fetch order details:", err);
    error =
      err instanceof Error ? err.message : "Đã có lỗi xảy ra khi tải đơn hàng.";
  }

  // Giao diện hiển thị khi có lỗi
  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Không thể tải chi tiết đơn hàng
        </h1>
        <p className="text-slate-500 max-w-md">
          {error || "Không tìm thấy đơn hàng với ID này."}
        </p>
        <Link
          href="/orders"
          className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          <ArrowLeftCircle size={20} />
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  // Giao diện chính khi có dữ liệu đơn hàng
  return (
    <div className="bg-slate-50 min-h-full p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-6 font-medium"
        >
          <ArrowLeftCircle size={20} />
          Quay lại danh sách đơn hàng
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Đơn hàng #{order._id.slice(-8)}
          </h1>
          <p className="text-slate-500 mt-1">
            Đặt ngày{" "}
            {new Date(order.createdAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột chính: Chi tiết và sản phẩm */}
          <main className="lg:col-span-2 space-y-8">
            <Card title={`Sản phẩm trong đơn (${order.items.length})`}>
              <ul className="divide-y divide-slate-100">
                {order.items.map((item, index) => (
                  <li
                    key={item.product || index}
                    className="flex items-center gap-4 py-4"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-slate-800">
                        {item.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {item.quantity} x {item.price.toLocaleString("vi-VN")} ₫
                      </p>
                    </div>
                    <p className="font-semibold text-slate-900">
                      {(item.quantity * item.price).toLocaleString("vi-VN")} ₫
                    </p>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Thông tin chi tiết">
              <ItemRow
                label="Tên người nhận"
                value={order.shippingAddress.fullName}
              />
              <ItemRow
                label="Số điện thoại"
                value={order.shippingAddress.phoneNumber}
              />
              <ItemRow
                label="Email"
                value={
                  <a
                    href={`mailto:${
                      order.user?.email || order.guestDetails?.email
                    }`}
                    className="text-blue-600 hover:underline"
                  >
                    {order.user?.email || order.guestDetails?.email}
                  </a>
                }
              />
              <ItemRow
                label="Địa chỉ giao hàng"
                value={`${order.shippingAddress.address}, ${order.shippingAddress.city}`}
              />
              <ItemRow
                label="Phương thức thanh toán"
                value={
                  order.paymentMethod === "cash"
                    ? "Khi nhận hàng (COD)"
                    : "Chuyển khoản"
                }
              />
            </Card>
          </main>

          {/* Cột phụ: Tóm tắt và hành động */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-4 mb-4">
                  Trạng thái & Tổng tiền
                </h3>

                <div className="space-y-3 mb-6">
                  <ItemRow
                    label="Thanh toán"
                    value={
                      <StatusIndicator
                        isSuccess={order.paymentStatus === "paid"}
                        text={
                          order.paymentStatus === "paid"
                            ? "Đã thanh toán"
                            : "Chờ thanh toán"
                        }
                      />
                    }
                  />
                  <ItemRow
                    label="Vận chuyển"
                    value={
                      <StatusIndicator
                        isSuccess={order.isDelivered}
                        text={order.isDelivered ? `Đã giao` : "Chưa giao hàng"}
                      />
                    }
                  />
                </div>

                <div className="space-y-2 border-t border-slate-200 pt-4">
                  <ItemRow
                    label="Tiền hàng"
                    value={`${order.itemsPrice.toLocaleString("vi-VN")} ₫`}
                  />
                  <ItemRow
                    label="Phí giao hàng"
                    value={`${order.shippingPrice.toLocaleString("vi-VN")} ₫`}
                  />
                  <ItemRow
                    label="Thuế"
                    value={`${order.taxPrice.toLocaleString("vi-VN")} ₫`}
                  />
                  <div className="flex justify-between items-center pt-4 mt-2 border-t border-slate-200">
                    <p className="text-lg font-bold text-slate-900">
                      Tổng cộng
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {order.totalAmount.toLocaleString("vi-VN")} ₫
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-200 pt-6">
                  <h3 className="text-md font-semibold mb-4 text-slate-800">
                    Hành động
                  </h3>
                  <UpdateOrderActions order={order} />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
