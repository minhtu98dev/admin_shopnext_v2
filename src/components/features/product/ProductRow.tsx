"use client";
import Image from "next/image";
import { Product } from "@/types";
import StockStatus from "./StockStatus";
import ProductActions from "@/components/features/product/ProductActions";

export default function ProductRow({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 text-sm text-slate-600">{index}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <Image
            src={
              product.image.startsWith("http")
                ? product.image
                : `https://res.cloudinary.com${product.image}`
            }
            alt={product.name}
            width={40}
            height={40}
            className="w-10 h-10 object-cover rounded-md"
          />
          <span className="font-semibold text-slate-800">{product.name}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        {product.price.toLocaleString("vi-VN")} ₫
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
        <StockStatus count={product.countInStock} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span className="inline-block bg-slate-100 text-slate-700 text-xs font-medium px-2 py-1 rounded-full">
          {product.category}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
        <ProductActions product={product} />
      </td>
    </tr>
  );
}
