// src/components/features/order/OrderActions.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Trash2 } from "lucide-react"; // Import icons
import { toast } from "sonner"; // Import toast
import { deleteOrder } from "@/lib/api-client"; // Import hàm xóa
import { Order } from "@/types";

export default function OrderActions({ order }: { order: Order }) {
  const router = useRouter();

  const handleDelete = () => {
    // Sử dụng toast.promise để xử lý các trạng thái
    toast.promise(deleteOrder(order._id), {
      loading: "Đang xóa đơn hàng...",

      // KHI THÀNH CÔNG (SUCCESS)
      success: (data) => {
        // =======================================================
        // ĐÂY CHÍNH LÀ DÒNG THỰC HIỆN VIỆC LÀM MỚI DỮ LIỆU
        router.refresh();
        // =======================================================

        // Trả về message để hiển thị trên toast
        return data.message;
      },

      error: (err) => err.message,
    });
  };

  const showDeleteConfirm = () => {
    // Hiển thị toast xác nhận
    toast.warning(
      `Bạn có chắc chắn muốn xóa đơn hàng #${order._id.slice(-6)}?`,
      {
        action: {
          label: "Xóa",
          onClick: () => handleDelete(), // Gọi hàm xóa nếu người dùng nhấn 'Xóa'
        },
        cancel: {
          label: "Hủy",
          onClick: () => {}, // Thêm một hàm trống để bỏ qua
        },
        duration: 5000,
      }
    );
  };

  return (
    <div className="flex items-center justify-end gap-3">
      {/* Icon Eye để xem chi tiết */}
      <Link href={`/orders/${order._id}`} title="Xem chi tiết">
        <Eye className="w-5 h-5 text-gray-500 hover:text-indigo-600 transition-colors" />
      </Link>
      {/* Icon Delete để xóa */}
      <button onClick={showDeleteConfirm} title="Xóa đơn hàng">
        <Trash2 className="w-5 h-5 text-gray-500 hover:text-red-600 transition-colors" />
      </button>
    </div>
  );
}
