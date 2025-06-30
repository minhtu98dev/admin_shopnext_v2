// src/app/api/auth/login/route.ts

import { NextResponse } from 'next/server';

// Base URL của backend thật sự
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

// Phải có dòng export này và tên function là POST
export async function POST(request: Request) {
  try {
    // Lấy email và password từ request của form login
    const { email, password } = await request.json();

    // Gọi đến API backend thật để xác thực
    const apiRes = await fetch(`${BACKEND_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      // Nếu backend trả về lỗi, trả về lỗi cho client
      return NextResponse.json({ message: data.message || 'Đăng nhập thất bại' }, { status: apiRes.status });
    }

    const token = data.token;
    if (!token) {
      return NextResponse.json({ message: 'Không nhận được token từ server' }, { status: 500 });
    }

    const response = NextResponse.json({ message: 'Đăng nhập thành công' });

    // Set cookie chứa token
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 ngày
    });

    return response;

  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    return NextResponse.json({ message: 'Lỗi hệ thống' }, { status: 500 });
  }
}