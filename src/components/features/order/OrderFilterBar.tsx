"use client";
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
      <input
        className="border rounded px-3 py-2 w-64"
        placeholder="Tìm kiếm theo ID hoặc tên người đặt..."
        value={filter.search}
        onChange={(e) => handleChange("search", e.target.value)}
      />

      <select
        className="border rounded px-3 py-2"
        value={filter.paymentStatus}
        onChange={(e) => handleChange("paymentStatus", e.target.value)}
      >
        <option value="">Thanh toán</option>
        <option value="paid">Đã thanh toán</option>
        <option value="pending">Chờ thanh toán</option>
      </select>
      <input
        type="date"
        className="border rounded px-3 py-2"
        value={filter.dateFrom}
        onChange={(e) => handleChange("dateFrom", e.target.value)}
        placeholder="Từ ngày"
      />
      <input
        type="date"
        className="border rounded px-3 py-2"
        value={filter.dateTo}
        onChange={(e) => handleChange("dateTo", e.target.value)}
        placeholder="Đến ngày"
      />
      <select
        className="border rounded px-3 py-2"
        value={filter.sortPrice}
        onChange={(e) => handleChange("sortPrice", e.target.value)}
      >
        <option value="">Sắp xếp giá</option>
        <option value="asc">Giá tăng dần</option>
        <option value="desc">Giá giảm dần</option>
      </select>
    </div>
  );
}
