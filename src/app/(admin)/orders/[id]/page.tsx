// src/app/(admin)/orders/[id]/page.tsx

import { getOrderById_Server } from "@/lib/api";
import UpdateOrderActions from "@/components/features/order/UpdateOrderActions";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers"; // **QUAN TRỌNG: Import cookies**
import { ArrowLeftCircle } from "lucide-react";
import { Order } from "@/types";

// Helper Component để hiển thị một dòng thông tin
const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex flex-col sm:flex-row py-2">
    <dt className="w-full sm:w-1/3 font-semibold text-gray-800">{label}</dt>
    <dd className="w-full sm:w-2/3 text-gray-600 mt-1 sm:mt-0">{value}</dd>
  </div>
);

// Helper Component để hiển thị trạng thái bằng màu sắc
const StatusBadge = ({
  isSuccess,
  text,
}: {
  isSuccess: boolean;
  text: string;
}) => (
  <div
    className={`mt-2 py-1 px-3 rounded-full text-sm font-semibold inline-block ${
      isSuccess
        ? "bg-green-100 text-green-800"
        : "bg-yellow-100 text-yellow-800"
    }`}
  >
    {text}
  </div>
);

// Component chính của trang
export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let order: Order | null = null;
  let error: string | null = null;

  try {
    // SỬA LỖI LOGIC: Lấy token từ cookie và truyền vào hàm API
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
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Không thể tải chi tiết đơn hàng
        </h1>
        <p className="text-gray-600">
          {error || "Không tìm thấy đơn hàng với ID này."}
        </p>
        <Link
          href="/orders"
          className="mt-6 inline-flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          <ArrowLeftCircle size={20} />
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  // Giao diện chính khi có dữ liệu đơn hàng
  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-full">
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-2 font-medium"
      >
        <ArrowLeftCircle size={20} />
        Quay lại danh sách đơn hàng
      </Link>

      <h1 className="text-3xl font-bold text-gray-800">
        Chi tiết Đơn hàng{" "}
        <span className="font-mono text-xl text-gray-500">
          #{order._id.slice(-8)}
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái: Thông tin chính */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 border-b pb-3">
              Thông tin giao hàng
            </h2>
            <dl className="space-y-2">
              <InfoRow
                label="Tên người nhận"
                value={order.shippingAddress.fullName}
              />
              <InfoRow
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
              <InfoRow
                label="Địa chỉ"
                value={`${order.shippingAddress.address}, ${order.shippingAddress.city}`}
              />
              <InfoRow
                label="Số điện thoại"
                value={order.shippingAddress.phoneNumber}
              />
              <InfoRow
                label="Trạng thái"
                value={
                  <span
                    className={`py-1 px-3 rounded-full text-sm font-semibold ${
                      order.isDelivered
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.isDelivered
                      ? `Đã giao vào ${new Date(
                          order.deliveredAt!
                        ).toLocaleDateString("vi-VN")}`
                      : "Chưa giao hàng"}
                  </span>
                }
              />
            </dl>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 border-b pb-3">
              Thông tin thanh toán
            </h2>
            <dl className="space-y-2">
              <InfoRow
                label="Phương thức"
                value={
                  order.paymentMethod === "cash"
                    ? "Thanh toán khi nhận hàng (COD)"
                    : "Chuyển khoản ngân hàng"
                }
              />
              <InfoRow
                label="Trạng thái"
                value={
                  <StatusBadge
                    isSuccess={order.paymentStatus === "paid"}
                    text={
                      order.paymentStatus === "paid"
                        ? "Đã thanh toán"
                        : "Chờ thanh toán"
                    }
                  />
                }
              />
            </dl>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 border-b pb-3">
              Các sản phẩm trong đơn ({order.items.length})
            </h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={item.product || index}
                  className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} x {item.price.toLocaleString("vi-VN")} ₫
                    </p>
                  </div>
                  <p className="font-semibold text-lg text-gray-900">
                    {(item.quantity * item.price).toLocaleString("vi-VN")} ₫
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cột phải: Tóm tắt và hành động */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-3">
              Tóm tắt đơn hàng
            </h2>
            <dl className="space-y-2 text-base">
              <div className="flex justify-between">
                <dt className="text-gray-600">Tiền hàng:</dt>{" "}
                <dd className="font-medium text-gray-800">
                  {order.itemsPrice.toLocaleString("vi-VN")} ₫
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Phí giao hàng:</dt>{" "}
                <dd className="font-medium text-gray-800">
                  {order.shippingPrice.toLocaleString("vi-VN")} ₫
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Thuế:</dt>{" "}
                <dd className="font-medium text-gray-800">
                  {order.taxPrice.toLocaleString("vi-VN")} ₫
                </dd>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <dt>Tổng cộng:</dt>{" "}
                <dd>{order.totalAmount.toLocaleString("vi-VN")} ₫</dd>
              </div>
            </dl>
            <div className="mt-6 border-t pt-6">
              <h3 className="text-md font-semibold mb-4 text-gray-800">
                Hành động
              </h3>
              <UpdateOrderActions order={order} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
