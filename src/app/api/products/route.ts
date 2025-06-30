// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;
  if (!token) return NextResponse.json({ message: 'Chưa xác thực' }, { status: 401 });

  const productData = await request.json();

  // Gọi đến backend thật sự để tạo sản phẩm
  const apiRes = await fetch(`${BACKEND_API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  const data = await apiRes.json();
  if (!apiRes.ok) {
    return NextResponse.json({ message: data.message || "Lỗi từ server backend" }, { status: apiRes.status });
  }
  return NextResponse.json(data);
}