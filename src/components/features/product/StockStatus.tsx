"use client";
import React from "react";

export default function StockStatus({ count }: { count: number }) {
  const inStock = count > 0;
  return (
    <div className="flex items-center justify-center gap-2">
      <span
        className={`h-2 w-2 rounded-full ${
          inStock ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className={inStock ? "text-slate-600" : "text-red-600"}>
        {count}
      </span>
    </div>
  );
}
