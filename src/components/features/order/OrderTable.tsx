import StatusSwitch from "./StatusSwitch";
import OrderActions from "./OrderActions";
import { Order } from "@/types";

export default function OrderTable({ orders }: { orders: Order[] }) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID Đơn hàng
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Người đặt
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày đặt
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tổng tiền
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thanh toán
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Giao hàng
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700"
                  title={order._id}
                >
                  ...{order._id.slice(-6)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {order.user?.name || order.shippingAddress.fullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                  {order.totalAmount.toLocaleString("vi-VN")} ₫
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <StatusSwitch order={order} type="payment" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <StatusSwitch order={order} type="delivery" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                  <OrderActions order={order} />
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
    </div>
  );
}
