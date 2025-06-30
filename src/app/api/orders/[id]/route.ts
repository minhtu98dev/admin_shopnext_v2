// src/app/api/orders/[id]/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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

    const successData = await apiRes.json();
    return NextResponse.json({ message: successData.message || 'Xóa đơn hàng thành công' });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// Bạn có thể giữ hàm GET ở đây để dùng sau này cho trang chi tiết
// export async function GET(request: Request, { params }: { params: { id: string } }) {
//   // Logic lấy chi tiết một đơn hàng
// }

