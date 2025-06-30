// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Hàm middleware sẽ được thực thi cho các route được định nghĩa trong 'matcher'
export function middleware(request: NextRequest) {
  // 1. Lấy token từ cookie của request đến
  const token = request.cookies.get('authToken')?.value;

  // 2. Nếu không có token và người dùng đang cố truy cập trang admin
  if (!token) {
    // Chuyển hướng họ về trang đăng nhập
    // request.url là URL đầy đủ của trang người dùng đang truy cập
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Nếu có token, cho phép request tiếp tục
  return NextResponse.next();
}

// Cấu hình matcher để middleware chỉ chạy trên các trang admin
export const config = {
  // :path* sẽ khớp với tất cả các đường dẫn con, ví dụ /products/new, /products/edit/123
  matcher: [
    '/dashboard/:path*',
    '/products/:path*',
    '/orders/:path*',
    '/users/:path*',
  ],
};