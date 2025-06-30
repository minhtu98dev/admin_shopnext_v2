import { getProductById_Server } from "@/lib/api";
import EditProductForm from "@/components/features/product/EditProductForm";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const product = await getProductById_Server(params.id);

    return (
      <div className="p-4 sm:p-6 space-y-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ArrowLeftCircle size={20} />
          Quay lại danh sách sản phẩm
        </Link>
        <h1 className="text-2xl font-bold">Chỉnh sửa sản phẩm</h1>
        <EditProductForm product={product} />
      </div>
    );
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Lỗi không xác định");
    return (
      <div className="p-6 text-center text-red-500">
        <h1 className="text-2xl font-bold mb-4">
          Không thể tải dữ liệu sản phẩm
        </h1>
        <p>{error.message}</p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          <ArrowLeftCircle size={20} />
          Quay lại danh sách
        </Link>
      </div>
    );
  }
}
