"use client";
import { ArrowUpDown, ChevronDown, Search } from "lucide-react";
import { useState } from "react";

type Filter = {
  search: string;
  paymentStatus: string;
  dateFrom: string;
  dateTo: string;
  minAmount: string;
  maxAmount: string;
  sortPrice: string; // thêm trường này
};

export default function OrderFilterBar({
  onFilterChange,
}: {
  onFilterChange?: (filter: Filter) => void;
}) {
  const [filter, setFilter] = useState<Filter>({
    search: "",
    paymentStatus: "",
    dateFrom: "",
    dateTo: "",
    minAmount: "",
    maxAmount: "",
    sortPrice: "",
  });

  // Gọi callback mỗi khi filter thay đổi
  const handleChange = (key: keyof Filter, value: string) => {
    const newFilter = { ...filter, [key]: value };
    setFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  return (
    <div className="flex flex-wrap gap-3 mb-4 items-center">
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          className="border rounded px-3 py-2 pl-9 w-full border-gray-400"
          placeholder="Tìm kiếm ..."
          value={filter.search}
          onChange={(e) => handleChange("search", e.target.value)}
        />
      </div>
      <div className="relative inline-block">
        <select
          className="border rounded px-3 py-2 pr-10 appearance-none border-gray-400 "
          value={filter.paymentStatus}
          onChange={(e) => handleChange("paymentStatus", e.target.value)}
        >
          <option value="">Thanh toán</option>
          <option value="paid">Đã thanh toán</option>
          <option value="pending">Chờ thanh toán</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>

      <input
        type="date"
        className="border rounded px-3 py-2 border-gray-400"
        value={filter.dateFrom}
        onChange={(e) => handleChange("dateFrom", e.target.value)}
        placeholder="Từ ngày"
      />
      <input
        type="date"
        className="border rounded px-3 py-2 border-gray-400"
        value={filter.dateTo}
        onChange={(e) => handleChange("dateTo", e.target.value)}
        placeholder="Đến ngày"
      />
      <div className="relative inline-block w-fit">
        <select
          className="border rounded px-3 py-2 pr-10 border-gray-400 appearance-none"
          value={filter.sortPrice}
          onChange={(e) => handleChange("sortPrice", e.target.value)}
        >
          <option value="">Sắp xếp giá</option>
          <option value="asc">Giá tăng dần</option>
          <option value="desc">Giá giảm dần</option>
        </select>
        <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
}
