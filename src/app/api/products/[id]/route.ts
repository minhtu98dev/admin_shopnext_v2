// src/app/api/products/[id]/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

// Hàm xử lý yêu cầu SỬA một sản phẩm
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('authToken')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Chưa xác thực' }, { status: 401 });
    }

    const productData = await request.json();

    const apiRes = await fetch(`${BACKEND_API_URL}/products/${params.id}`, {
      method: 'PUT',
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}


// Hàm xử lý yêu cầu XÓA một sản phẩm
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('authToken')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Chưa xác thực' }, { status: 401 });
    }

    const apiRes = await fetch(`${BACKEND_API_URL}/products/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!apiRes.ok) {
      const errorData = await apiRes.json();
      return NextResponse.json({ message: errorData.message || 'Lỗi từ server backend' }, { status: apiRes.status });
    }

    return NextResponse.json({ message: 'Sản phẩm đã được xóa' });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}