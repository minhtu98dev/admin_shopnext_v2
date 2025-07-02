import { cookies } from "next/headers";
import { getOrders_Server } from "@/lib/api";
import OrdersPageClient from "@/components/features/order/OrdersPageClient";
import { Order } from "@/types";

export default async function OrdersPage() {
  let orders: Order[] = [];
  let error: string | null = null;

  const cookieStore = cookies();
  const token = cookieStore.get("authToken")?.value;

  try {
    orders = await getOrders_Server(token || "");
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

  return <OrdersPageClient orders={orders} />;
}
