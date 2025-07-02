"use client";
import React from "react";
import ProductRow from "./ProductRow";
import { Product } from "@/types";
import { Inbox } from "lucide-react";

export default function ProductTable({
  products,
  page,
  limit,
}: {
  products: Product[];
  page: number;
  limit: number;
}) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-md">
      <table className="min-w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 tracking-wider">
              STT
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 tracking-wider">
              Sản phẩm
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 tracking-wider">
              Giá
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 tracking-wider">
              Trong kho
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 tracking-wider">
              Danh mục
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 tracking-wider">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {products.length > 0 ? (
            products.map((product, i) => (
              <ProductRow
                key={product._id}
                product={product}
                index={(page - 1) * limit + i + 1}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-16">
                <Inbox className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-lg font-medium text-slate-800">
                  Không có sản phẩm nào
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Hãy thêm sản phẩm mới để bắt đầu.
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
