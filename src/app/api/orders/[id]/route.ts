// src/app/api/orders/[id]/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidateTag  } from 'next/cache'; // <-- BƯỚC 1: IMPORT

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

// Hàm này sẽ xử lý yêu cầu DELETE /api/orders/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const cookieStore = cookies();
    const token = cookieStore.get('authToken')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Chưa xác thực' }, { status: 401 });
    }

    // Gọi đến backend thật để xóa
    const apiRes = await fetch(`${BACKEND_API_URL}/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!apiRes.ok) {
      const errorData = await apiRes.json();
      throw new Error(errorData.message || 'Xóa đơn hàng từ backend thất bại');
    }

    // =======================================================
    // BƯỚC 2: RA LỆNH XÓA CACHE SAU KHI THÀNH CÔNG
    // Đây là dòng quan trọng nhất để router.refresh() hoạt động
    revalidateTag('orders'); 
    // =======================================================

    const successData = await apiRes.json();
    return NextResponse.json({ message: successData.message || 'Xóa đơn hàng thành công' });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}