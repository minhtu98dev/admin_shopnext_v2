// src/app/api/orders/[id]/deliver/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies(); // Gọi đồng bộ
  const token = cookieStore.get('authToken')?.value;
  if (!token) return NextResponse.json({ message: 'Chưa xác thực' }, { status: 401 });

  const apiRes = await fetch(`${BACKEND_API_URL}/orders/${params.id}/deliver`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  const data = await apiRes.json();
  if (!apiRes.ok) {
    return NextResponse.json({ message: data.message }, { status: apiRes.status });
  }
  return NextResponse.json(data);
}