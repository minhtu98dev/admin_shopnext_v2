"use client";

import Image from "next/image";
import { Product } from "@/types";

type TopProduct = Product & {
  sold: number;
  revenue: number;
};

export default function TopSellingProducts({
  topProducts,
}: {
  topProducts: TopProduct[];
}) {
  return (
    <div className="xl:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Sản phẩm bán chạy
      </h2>
      <div className="space-y-4">
        {topProducts.map((product) => (
          <div key={product._id} className="flex items-center gap-4">
            <Image
              src={
                product.image?.startsWith("http")
                  ? product.image
                  : `https://res.cloudinary.com${product.image}`
              }
              alt={product.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div className="flex-grow">
              <p className="text-sm font-semibold text-gray-800">
                {product.name}
              </p>
              <p className="text-xs text-gray-500">{product.sold} đã bán</p>
            </div>
            <p className="text-sm font-bold text-gray-900">
              {product.revenue.toLocaleString("vi-VN")}₫
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
