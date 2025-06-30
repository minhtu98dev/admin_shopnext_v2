// src/components/features/product/ProductActions.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FilePenLine, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteProduct } from "@/lib/api-client";
import { Product } from "@/types";

export default function ProductActions({ product }: { product: Product }) {
  const router = useRouter();

  // Hàm xử lý việc xóa sau khi đã xác nhận
  const handleDelete = () => {
    // Dùng toast.promise để tự động hiển thị các trạng thái
    toast.promise(deleteProduct(product._id), {
      loading: `Đang xóa sản phẩm "${product.name}"...`,
      success: (data) => {
        // Làm mới dữ liệu trên trang hiện tại
        router.refresh();
        return data.message || `Sản phẩm "${product.name}" đã được xóa.`;
      },
      error: (err) => err.message,
    });
  };

  // Hàm hiển thị toast xác nhận trước khi xóa
  const showDeleteConfirm = () => {
    toast.warning(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`, {
      action: {
        label: "Xóa",
        onClick: handleDelete, // Chỉ gọi handleDelete khi người dùng nhấn "Xóa"
      },
      cancel: {
        label: "Hủy",
        onClick: () => {},
      },
      duration: 5000, // Toast tự đóng sau 5 giây
      position: "top-center",
    });
  };

  return (
    <div className="flex items-center justify-end gap-3">
      {/* Icon Sửa */}
      <Link href={`/products/edit/${product._id}`} title="Sửa sản phẩm">
        <FilePenLine className="w-5 h-5 text-gray-500 hover:text-indigo-600 transition-colors" />
      </Link>

      {/* Icon Xóa */}
      <button onClick={showDeleteConfirm} title="Xóa sản phẩm">
        <Trash2 className="w-5 h-5 text-gray-500 hover:text-red-600 transition-colors" />
      </button>
    </div>
  );
}
