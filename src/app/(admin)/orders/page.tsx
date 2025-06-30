import { cookies } from "next/headers";
import { getOrders_Server } from "@/lib/api";
import { Order } from "@/types";

import OrdersPageClient from "./OrdersPageClient";

export default async function OrdersPage() {
  let orders: Order[] = [];
  let error: string | null = null;

  try {
    const cookieStore = cookies();
    const token = cookieStore.get("authToken")?.value;
    if (!token) throw new Error("Yêu cầu xác thực. Vui lòng đăng nhập lại.");
    orders = await getOrders_Server(token);
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "Lỗi không xác định khi tải đơn hàng.";
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <h1 className="text-2xl font-bold mb-4">Đã xảy ra lỗi</h1>
        <p>{error}</p>
      </div>
    );
  }

  // Truyền orders sang client component để filter
  return <OrdersPageClient orders={orders} />;
}
