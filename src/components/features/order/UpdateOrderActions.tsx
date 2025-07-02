// src/components/features/order/UpdateOrderActions.tsx
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { markOrderAsPaid, markOrderAsDelivered } from "@/lib/api-client";
import { Order } from "@/types";
import { CheckCircle2, Truck } from "lucide-react";
import { ReactNode } from "react";

// --- Helper Component cho Button ---
const ActionButton = ({
  onClick,
  children,
  variant = "primary",
}: {
  onClick: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) => {
  const baseClasses =
    "w-full flex items-center justify-center gap-2 font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"; // <--- Đã thêm cursor-pointer

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 focus:ring-slate-400",
  };

  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </button>
  );
};

// --- Helper Component cho trạng thái đã hoàn thành ---
const CompletedAction = ({ icon, text }: { icon: ReactNode; text: string }) => (
  <div className="w-full flex items-center justify-center gap-2 font-semibold py-2.5 px-4 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed">
    {icon}
    <span>{text}</span>
  </div>
);

// --- Component chính ---
export default function UpdateOrderActions({ order }: { order: Order }) {
  const router = useRouter();

  const handleMarkAsPaid = () => {
    toast.promise(markOrderAsPaid(order._id), {
      loading: "Đang cập nhật trạng thái thanh toán...",
      success: () => {
        router.refresh();
        return "Cập nhật thanh toán thành công!";
      },
      error: (err) => err.message,
    });
  };

  const handleMarkAsDelivered = () => {
    toast.promise(markOrderAsDelivered(order._id), {
      loading: "Đang cập nhật trạng thái giao hàng...",
      success: () => {
        router.refresh();
        return "Cập nhật giao hàng thành công!";
      },
      error: (err) => err.message,
    });
  };

  return (
    <div className="space-y-3">
      {/* Hành động Thanh toán */}
      {order.paymentStatus !== "paid" ? (
        <ActionButton onClick={handleMarkAsPaid} variant="secondary">
          <CheckCircle2 size={18} />
          Đánh dấu Đã thanh toán
        </ActionButton>
      ) : (
        <CompletedAction
          icon={<CheckCircle2 size={18} />}
          text="Đã thanh toán"
        />
      )}

      {/* Hành động Giao hàng */}
      {!order.isDelivered ? (
        <ActionButton onClick={handleMarkAsDelivered} variant="primary">
          <Truck size={18} />
          Đánh dấu Đã giao hàng
        </ActionButton>
      ) : (
        <CompletedAction icon={<Truck size={18} />} text="Đã giao hàng" />
      )}
    </div>
  );
}
