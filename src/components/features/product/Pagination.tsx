"use client";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <Link
        href={`?page=${Math.max(page - 1, 1)}`}
        className={`px-3 py-1 border border-gray-300 rounded ${
          page === 1 ? "opacity-50 pointer-events-none" : "hover:bg-gray-100"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
      </Link>

      {Array.from({ length: totalPages }).map((_, i) => (
        <Link
          key={i + 1}
          href={`?page=${i + 1}`}
          className={`px-3 py-1 border border-gray-300 rounded ${
            page === i + 1 ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
        >
          {i + 1}
        </Link>
      ))}

      <Link
        href={`?page=${Math.min(page + 1, totalPages)}`}
        className={`px-3 py-1 border border-gray-300 rounded ${
          page === totalPages
            ? "opacity-50 pointer-events-none"
            : "hover:bg-gray-100"
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
