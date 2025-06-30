// src/components/features/order/UpdateOrderActions.tsx
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { markOrderAsPaid, markOrderAsDelivered } from "@/lib/api-client";
import { Order } from "@/types";

export default function UpdateOrderActions({ order }: { order: Order }) {
  const router = useRouter();

  const handleMarkAsPaid = () => {
    toast.promise(markOrderAsPaid(order._id), {
      loading: "Đang cập nhật trạng thái thanh toán...",
      success: () => {
        router.refresh();
        return "Cập nhật thanh toán thành công!";
      },
      error: (err) => err.message,
    });
  };

  const handleMarkAsDelivered = () => {
    toast.promise(markOrderAsDelivered(order._id), {
      loading: "Đang cập nhật trạng thái giao hàng...",
      success: () => {
        router.refresh();
        return "Cập nhật giao hàng thành công!";
      },
      error: (err) => err.message,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {order.paymentStatus !== "paid" && (
        <button
          onClick={handleMarkAsPaid}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full"
        >
          Đánh dấu Đã thanh toán
        </button>
      )}
      {!order.isDelivered && (
        <button
          onClick={handleMarkAsDelivered}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
        >
          Đánh dấu Đã giao hàng
        </button>
      )}
    </div>
  );
}
