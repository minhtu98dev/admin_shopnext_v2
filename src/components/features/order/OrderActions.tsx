// src/components/features/order/OrderActions.tsx
"use client";

import Link from "next/link";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteOrder } from "@/lib/api-client";
import { Order } from "@/types";

// =======================================================
// SỬA Ở ĐÂY: Thêm onOrderDeleted vào danh sách props
// =======================================================
export default function OrderActions({
  order,
  onOrderDeleted,
}: {
  order: Order;
  onOrderDeleted: (orderId: string) => void;
}) {
  const handleDelete = () => {
    toast.promise(deleteOrder(order._id), {
      loading: "Đang xóa đơn hàng...",
      success: (data) => {
        // Gọi hàm callback thay vì router.refresh()
        onOrderDeleted(order._id);
        return data.message;
      },
      error: (err) => err.message,
    });
  };

  const showDeleteConfirm = () => {
    // ... logic không đổi
    toast.warning(
      `Bạn có chắc chắn muốn xóa đơn hàng #${order._id.slice(-6)}?`,
      {
        action: {
          label: "Xóa",
          onClick: () => handleDelete(),
        },
        cancel: {
          label: "Hủy",
          onClick: () => {},
        },
        duration: 5000,
      }
    );
  };

  return (
    <div className="flex items-center justify-end gap-3">
      <Link href={`/orders/${order._id}`} title="Xem chi tiết">
        <Eye className="w-5 h-5 text-gray-500 hover:text-indigo-600 transition-colors" />
      </Link>
      <button onClick={showDeleteConfirm} title="Xóa đơn hàng">
        <Trash2 className="w-5 h-5 text-gray-500 hover:text-red-600 transition-colors" />
      </button>
    </div>
  );
}
