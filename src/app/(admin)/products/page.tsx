import React from "react";
import Link from "next/link";
import { getProducts_Server } from "@/lib/api";
import { PlusCircle } from "lucide-react";
import ProductTable from "@/components/features/product/ProductTable";
import Pagination from "@/components/features/product/Pagination";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || "1", 10);
  const limit = 10;

  const { products, total } = await getProducts_Server({
    page,
    limit,
  });

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="bg-slate-50 min-h-full p-4 sm:p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Quản lý Sản phẩm
          </h1>
          <p className="text-slate-500 mt-1">Có {total} sản phẩm.</p>
        </div>
        <Link
          href="/products/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={20} />
          Thêm sản phẩm
        </Link>
      </header>

      <ProductTable products={products} page={page} limit={limit} />

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}
    </div>
  );
}
