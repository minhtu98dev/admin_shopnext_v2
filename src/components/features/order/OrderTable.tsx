"use client";

import { useState, useEffect } from "react";
import StatusSwitch from "./StatusSwitch";
import OrderActions from "./OrderActions";
import { Order } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function OrderTable({
  orders: initialOrders,
}: {
  orders: Order[];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  // BƯỚC 2: Tạo hàm callback để xử lý việc xóa
  // Hàm này sẽ được truyền xuống component con (OrderActions)
  const handleOrderDeleted = (deletedOrderId: string) => {
    // Lọc bỏ đơn hàng đã xóa khỏi state và cập nhật lại
    setOrders((currentOrders) =>
      currentOrders.filter((order) => order._id !== deletedOrderId)
    );
  };

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Sử dụng state 'orders' thay vì prop
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow p-5">
      <div className="mb-3">
        <h1 className="text-xl font-semibold text-gray-800">
          Danh sách đơn hàng
        </h1>
        <span className="font-light text-[13px] text-gray-600">
          {/* Luôn hiển thị số lượng đơn hàng hiện tại */}
          Hiển thị {orders.length} đơn hàng
        </span>
      </div>

      <table className="min-w-full">
        <thead className="bg-gray-50 border-b border-gray-300">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">
              Mã đơn hàng
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">
              Khách hàng
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">
              Ngày đặt
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">
              Tổng tiền
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 tracking-wider">
              Thanh toán
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <tr key={order._id}>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700"
                  title={order._id}
                >
                  ...{order._id.slice(-8)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {order.user?.name || order.shippingAddress.fullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                  {order.totalAmount.toLocaleString("vi-VN")}{" "}
                  <span className="text-xs font-medium text-gray-600">₫</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <StatusSwitch order={order} type="payment" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <StatusSwitch order={order} type="delivery" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                  <OrderActions
                    order={order}
                    onOrderDeleted={handleOrderDeleted}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-10 text-gray-500">
                Không có đơn hàng nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft className="text-gray-500" />
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 border border-gray-300 rounded ${
                currentPage === i + 1 ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight className="text-gray-500" />
          </button>
        </div>
      )}
    </div>
  );
}
