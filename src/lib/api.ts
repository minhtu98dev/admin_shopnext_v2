// src/lib/api.ts

import { Order, Product, User } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE_URL) {
  throw new Error("Vui lòng định nghĩa NEXT_PUBLIC_API_URL trong file .env.local");
}

// =======================
// === PRODUCT FUNCTIONS ===
// =======================

/**
 * Lấy danh sách tất cả sản phẩm từ backend.
 * Không yêu cầu xác thực.
 */
export const getProducts_Server = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    cache: 'no-store', // Luôn lấy dữ liệu mới nhất
  });

  if (!response.ok) {
    throw new Error('Không thể lấy dữ liệu sản phẩm');
  }

  const data = await response.json();
  // Backend có thể trả về { products: [...] } hoặc chỉ [...]
  return data.products || data;
};

/**
 * Lấy chi tiết một sản phẩm bằng ID từ backend.
 * Không yêu cầu xác thực.
 */
export const getProductById_Server = async (id: string): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Không tìm thấy sản phẩm.");
    }
    throw new Error('Không thể lấy dữ liệu sản phẩm');
  }

  return response.json();
};


// =====================
// === ORDER FUNCTIONS ===
// =====================

/**
 * Lấy danh sách tất cả đơn hàng từ backend.
 * Yêu cầu token xác thực của Admin.
 */
export const getOrders_Server = async (token: string): Promise<Order[]> => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Không thể lấy dữ liệu đơn hàng');
  }

  const data = await response.json();
  return data.orders || data;
};

/**
 * Lấy chi tiết một đơn hàng bằng ID từ backend.
 * Yêu cầu token xác thực.
 */
export const getOrderById_Server = async (id: string, token: string): Promise<Order> => {
  // --- BẮT ĐẦU PHẦN DEBUG ---
  console.log('--- [DEBUG] Đang thực thi getOrderById_Server ---');
  console.log(`- Yêu cầu lấy đơn hàng với ID: ${id}`);
  // In ra một phần token để kiểm tra nó có tồn tại hay không, nhưng không lộ toàn bộ
  console.log(`- Token được sử dụng: ${token ? `Bearer ${token.slice(0, 15)}...` : '!!! KHÔNG CÓ TOKEN !!!'}`);
  // --- KẾT THÚC PHẦN DEBUG ---

  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    headers: { 
      'Authorization': `Bearer ${token}` 
    },
    cache: 'no-store',
  });

  // In ra status code trả về từ backend
  console.log(`- Backend đã trả về Status Code: ${response.status}`);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Lỗi HTTP 401: Unauthorized - Backend từ chối token.');
    }
    if (response.status === 404) {
      throw new Error("Không tìm thấy đơn hàng trên backend.");
    }
    throw new Error('Không thể lấy dữ liệu chi tiết đơn hàng');
  }

  return response.json();
};

/**
 * Lấy tất cả đơn hàng của một người dùng cụ thể từ backend.
 * Yêu cầu token xác thực của Admin.
 */
export const getOrdersByUserId_Server = async (userId: string, token: string): Promise<Order[]> => {
  const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Không thể lấy danh sách đơn hàng của người dùng');
  }

  const data = await response.json();
  return data.orders || data;
};


// ====================
// === USER FUNCTIONS ===
// ====================

/**
 * Lấy danh sách tất cả người dùng từ backend.
 * Yêu cầu token xác thực của Admin.
 */
export const getUsers_Server = async (token: string): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/auth`, {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Không thể lấy dữ liệu người dùng');
  }

  return response.json();
};

/**
 * Lấy chi tiết một người dùng bằng ID từ backend.
 * Yêu cầu token xác thực của Admin.
 */
export const getUserById_Server = async (userId: string, token: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Không thể lấy dữ liệu người dùng');
  }

  return response.json();
};