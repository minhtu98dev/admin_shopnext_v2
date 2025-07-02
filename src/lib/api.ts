// src/lib/api.ts

import { Order, Product, User } from "@/types";

// ======================
// === CONFIG BACKEND ===
// ======================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE_URL) {
  throw new Error(
    "⚠️ Vui lòng định nghĩa biến môi trường NEXT_PUBLIC_API_URL trong file .env.local"
  );
}

// =========================
// === PRODUCT FUNCTIONS ===
// =========================

/**
 * Lấy danh sách sản phẩm từ backend, hỗ trợ phân trang.
 * @param page Số trang (bắt đầu từ 1)
 * @param limit Số sản phẩm mỗi trang
 * @returns Object gồm { products, total }
 */
export const getProducts_Server = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<{ products: Product[]; total: number }> => {
  const response = await fetch(
    `${API_BASE_URL}/products?pageNumber=${page}&limit=${limit}`,
    { cache: 'no-store' }
  );

  if (!response.ok) {
    throw new Error('Không thể lấy dữ liệu sản phẩm');
  }

  const data = await response.json();

  return {
    products: data.products,
    total: data.total,
  };
};

// Hàm A — Cho Dashboard (LẤY TẤT CẢ)
export const getAllProducts_Server = async (): Promise<Product[]> => {
  const res = await fetch(`${API_BASE_URL}/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Không thể lấy dữ liệu sản phẩm");
  }

  const data = await res.json();
  return data.products || [];
};
/**
 * Lấy chi tiết 1 sản phẩm theo ID.
 */
export const getProductById_Server = async (
  id: string
): Promise<Product> => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("❌ Không tìm thấy sản phẩm.");
    }
    throw new Error("❌ Không thể lấy dữ liệu sản phẩm");
  }

  return res.json();
};

// =======================
// === ORDER FUNCTIONS ===
// =======================

/**
 * Lấy danh sách tất cả đơn hàng.
 * Yêu cầu token Admin.
 */
export const getOrders_Server = async (token: string): Promise<Order[]> => {
  if (!token) {
    throw new Error("Token không tồn tại — Vui lòng đăng nhập lại.");
  }

  const response = await fetch(`${API_BASE_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Không thể lấy dữ liệu đơn hàng");
  }

  return response.json();
};
/**
 * Lấy chi tiết 1 đơn hàng.
 * Yêu cầu token.
 */
export const getOrderById_Server = async (
  id: string,
  token: string
): Promise<Order> => {
  console.log(`🔍 Đang lấy Order ID: ${id}`);
  console.log(
    `🔑 Token: ${token ? `Bearer ${token.slice(0, 10)}...` : "❌ Không có"}`
  );

  const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  console.log(`✅ Status Code: ${res.status}`);

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("❌ 401 Unauthorized - Token không hợp lệ");
    }
    if (res.status === 404) {
      throw new Error("❌ Không tìm thấy đơn hàng");
    }
    throw new Error("❌ Không thể lấy chi tiết đơn hàng");
  }

  return res.json();
};

/**
 * Lấy tất cả đơn hàng của 1 user.
 * Yêu cầu token Admin.
 */
export const getOrdersByUserId_Server = async (
  userId: string,
  token: string
): Promise<Order[]> => {
  const res = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("❌ Không thể lấy danh sách đơn hàng của người dùng");
  }

  const data = await res.json();
  return data.orders || [];
};

// ======================
// === USER FUNCTIONS ===
// ======================

/**
 * Lấy danh sách tất cả user.
 * Yêu cầu token Admin.
 */
export const getUsers_Server = async (token: string): Promise<User[]> => {
  const res = await fetch(`${API_BASE_URL}/auth`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("❌ Không thể lấy danh sách người dùng");
  }

  return res.json();
};

/**
 * Lấy chi tiết user theo ID.
 * Yêu cầu token Admin.
 */
export const getUserById_Server = async (
  userId: string,
  token: string
): Promise<User> => {
  const res = await fetch(`${API_BASE_URL}/auth/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("❌ Không thể lấy thông tin người dùng");
  }

  return res.json();
};
