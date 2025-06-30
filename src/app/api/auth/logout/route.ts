// src/app/api/auth/logout/route.ts

import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Tạo một response để trả về cho client
    const response = NextResponse.json({
      message: 'Đăng xuất thành công',
      success: true,
    });

    // Set cookie 'authToken' với giá trị rỗng và maxAge = 0 để xóa nó đi
    response.cookies.set('authToken', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0, // Hết hạn ngay lập tức
    });

    return response;
    
  } catch (error) { // SỬA LỖI Ở ĐÂY
    // Kiểm tra kiểu của error trước khi sử dụng
    const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}