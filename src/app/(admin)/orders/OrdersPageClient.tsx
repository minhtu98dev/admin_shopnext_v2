"use client";
import { useState } from "react";
import OrderTable from "@/components/features/order/OrderTable";
import OrderFilterBar from "@/components/features/order/OrderFilterBar";
import { Order } from "@/types";

type Filter = {
  search: string;

  paymentStatus: string;
  dateFrom: string;
  dateTo: string;
  minAmount: string;
  maxAmount: string;
  sortPrice: string;
};

export default function OrdersPageClient({ orders }: { orders: Order[] }) {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);

  const handleFilterChange = (filter: Filter) => {
    let result = [...orders];
    // Lọc theo search (id hoặc tên)
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      result = result.filter(
        (o) =>
          o._id.toLowerCase().includes(searchLower) ||
          o.user?.name?.toLowerCase().includes(searchLower) ||
          o.shippingAddress?.fullName?.toLowerCase().includes(searchLower)
      );
    }
    // Lọc theo trạng thái

    if (filter.paymentStatus) {
      result = result.filter((o) => o.paymentStatus === filter.paymentStatus);
    }
    // Lọc theo ngày
    if (filter.dateFrom) {
      result = result.filter(
        (o) => new Date(o.createdAt) >= new Date(filter.dateFrom)
      );
    }
    if (filter.dateTo) {
      result = result.filter(
        (o) => new Date(o.createdAt) <= new Date(filter.dateTo)
      );
    }
    // Lọc theo giá trị
    if (filter.minAmount) {
      result = result.filter((o) => o.totalAmount >= Number(filter.minAmount));
    }
    if (filter.maxAmount) {
      result = result.filter((o) => o.totalAmount <= Number(filter.maxAmount));
    }
    // Sắp xếp giá
    if (filter.sortPrice === "asc") {
      result = [...result].sort((a, b) => a.totalAmount - b.totalAmount);
    }
    if (filter.sortPrice === "desc") {
      result = [...result].sort((a, b) => b.totalAmount - a.totalAmount);
    }
    setFilteredOrders(result);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý Đơn hàng</h1>
        <span className="font-medium text-gray-600">
          Tổng số: {filteredOrders.length} đơn
        </span>
      </div>
      <OrderFilterBar onFilterChange={handleFilterChange} />
      <OrderTable orders={filteredOrders} />
    </div>
  );
}
