// src/lib/api-client.ts

import { ProductFormData } from "@/types";

// ==================
// ORDER FUNCTIONS
// ==================

// Hàm xóa đơn hàng
export const deleteOrder = async (orderId: string) => {
  const response = await fetch(`/api/orders/${orderId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Không thể xóa đơn hàng.');
  }
  return response.json();
};

// Hàm đánh dấu đơn hàng đã thanh toán
export const markOrderAsPaid = async (orderId: string) => {
  const response = await fetch(`/api/orders/${orderId}/pay`, {
    method: 'PUT',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Cập nhật thanh toán thất bại.');
  }
  return response.json();
};

// Hàm đánh dấu đơn hàng đã giao
export const markOrderAsDelivered = async (orderId: string) => {
  const response = await fetch(`/api/orders/${orderId}/deliver`, {
    method: 'PUT',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Cập nhật giao hàng thất bại.');
  }
  return response.json();
};


// ====================
// PRODUCT FUNCTIONS
// ====================

// Hàm xóa sản phẩm
export const deleteProduct = async (productId: string) => {
  const response = await fetch(`/api/products/${productId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Không thể xóa sản phẩm.');
  }
  return response.json();
};

// Hàm upload ảnh, nhận vào FormData
export const uploadImage = async (formData: FormData) => {
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Upload ảnh thất bại.');
  }
  return response.json();
};

// Hàm tạo sản phẩm mới
export const createProduct = async (productData: ProductFormData & { image: string; images: string[] }) => {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Tạo sản phẩm thất bại.');
  }
  return response.json();
};

// Hàm cập nhật sản phẩm
export const updateProduct = async (productId: string, productData: ProductFormData & { image: string; images: string[] }) => {
  const response = await fetch(`/api/products/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Cập nhật sản phẩm thất bại.');
  }
  return response.json();
};


