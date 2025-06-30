// src/app/(admin)/products/page.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts_Server } from "@/lib/api";
import { Product } from "@/types";
import ProductActions from "@/components/features/product/ProductActions";
import { PlusCircle } from "lucide-react";

export default async function ProductsPage() {
  const products: Product[] = await getProducts_Server();

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý Sản phẩm</h1>
        <Link
          href="/products/new"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle size={20} />
          Thêm sản phẩm mới
        </Link>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ảnh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tên sản phẩm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Giá
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Trong kho
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Danh mục
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4">
                  <Image
                    src={
                      product.image.startsWith("http")
                        ? product.image
                        : `https://res.cloudinary.com${product.image}`
                    }
                    alt={product.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {product.price.toLocaleString("vi-VN")} ₫
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                  {product.countInStock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <ProductActions product={product} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
