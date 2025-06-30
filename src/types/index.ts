// src/types/index.ts

// Dành cho Model Người dùng (User)
export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt?: string; // Thêm ? nếu không phải lúc nào cũng có
  updatedAt?: string;
}
  
  // Dành cho Model Đơn hàng (Order)
  export interface OrderItem {
    name: string;
    quantity: number;
    image: string;
    price: number;
    product: string; // ID của sản phẩm gốc
  }
  
  export interface ShippingAddress {
    fullName: string;
    address: string;
    city: string;
    phoneNumber: string;
  }
  
  export interface Order {
    _id: string;
    user?: User; 
    // SỬA LỖI 1: Bổ sung các trường còn thiếu
    guestDetails?: {
      email: string;
      fullName: string;
    };
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalAmount: number;

    paymentStatus: 'pending' | 'paid' | 'failed';
    isDelivered: boolean;
    deliveredAt?: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface Review {
    _id: string;
    name: string;
    rating: number;
    comment: string;
    user: string;
    createdAt: string;
  }
  
  export interface Product {
    _id: string;
    user: string;
    name: string;
    image: string;
    images?: string[];
    brand: string;
    category: string;
    description: string;
    price: number;
    countInStock: number;
    rating: number;
    numReviews: number;
    reviews?: Review[];
    createdAt: string;
    updatedAt: string;
  }
  // Bổ sung kiểu dữ liệu cho form sản phẩm
export type ProductFormData = {
  name: string;
  price: number;
  brand: string;
  category: string;
  countInStock: number;
  description: string;
};
