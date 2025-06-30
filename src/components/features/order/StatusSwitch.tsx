// src/components/features/order/StatusSwitch.tsx
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { markOrderAsPaid, markOrderAsDelivered } from "@/lib/api-client";
import { Order } from "@/types";

// Định nghĩa kiểu cho props
interface StatusSwitchProps {
  order: Order;
  type: "payment" | "delivery";
}

export default function StatusSwitch({ order, type }: StatusSwitchProps) {
  const router = useRouter();

  const handleUpdate = () => {
    let updatePromise;

    if (type === "payment") {
      // Chỉ cho phép cập nhật nếu chưa thanh toán
      if (order.paymentStatus === "paid") return;
      updatePromise = markOrderAsPaid(order._id);
    } else {
      // Chỉ cho phép cập nhật nếu chưa giao hàng
      if (order.isDelivered) return;
      updatePromise = markOrderAsDelivered(order._id);
    }

    toast.promise(updatePromise, {
      loading: "Đang cập nhật...",
      success: () => {
        router.refresh(); // Tải lại dữ liệu trang để cập nhật UI
        return "Cập nhật trạng thái thành công!";
      },
      error: (err) => err.message,
    });
  };

  if (type === "payment") {
    const isPaid = order.paymentStatus === "paid";
    return (
      <button
        onClick={handleUpdate}
        disabled={isPaid} // Vô hiệu hóa nút nếu đã thanh toán
        className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${
          isPaid
            ? "bg-green-100 text-green-800 cursor-not-allowed"
            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
        }`}
      >
        {isPaid ? "Đã thanh toán" : "Chờ xử lý"}
      </button>
    );
  }

  if (type === "delivery") {
    const isDelivered = order.isDelivered;
    return (
      <button
        onClick={handleUpdate}
        disabled={isDelivered} // Vô hiệu hóa nút nếu đã giao
        className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${
          isDelivered
            ? "bg-blue-100 text-blue-800 cursor-not-allowed"
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }`}
      >
        {isDelivered ? "Đã giao" : "Chưa giao"}
      </button>
    );
  }

  return null;
}
