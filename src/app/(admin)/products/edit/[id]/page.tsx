// src/app/(admin)/products/edit/[id]/page.tsx

import { getProductById_Server } from "@/lib/api";
import EditProductForm from "@/components/features/product/EditProductForm";
import Link from "next/link";
import { ArrowLeftCircle, AlertTriangle } from "lucide-react";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const product = await getProductById_Server(params.id);

    return (
      <div className="bg-slate-50 min-h-full p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-6 font-medium"
          >
            <ArrowLeftCircle size={20} />
            Quay lại danh sách sản phẩm
          </Link>
          <main>
            <EditProductForm product={product} />
          </main>
        </div>
      </div>
    );
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Lỗi không xác định");
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Không thể tải dữ liệu sản phẩm
        </h1>
        <p className="text-slate-500 max-w-md">{error.message}</p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          <ArrowLeftCircle size={20} />
          Quay lại danh sách
        </Link>
      </div>
    );
  }
}
