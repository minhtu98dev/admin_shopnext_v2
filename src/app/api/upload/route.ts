// src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Cấu hình Cloudinary với các biến môi trường
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: "Không có file nào được tải lên." }, { status: 400 });
  }

  // Chuyển file thành buffer
  const fileBuffer = await file.arrayBuffer();
  const mimeType = file.type;
  const encoding = 'base64';
  const base64Data = Buffer.from(fileBuffer).toString('base64');
  const fileUri = 'data:' + mimeType + ';' + encoding + ',' + base64Data;

  try {
    // Upload ảnh lên Cloudinary
    const uploadResult = await cloudinary.uploader.upload(fileUri, {
      invalidate: true,
      folder: 'shopnext' // Tùy chọn: lưu ảnh vào một thư mục cụ thể trên Cloudinary
    });
    
    // Trả về URL an toàn của ảnh đã upload
    return NextResponse.json({ url: uploadResult.secure_url });

  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    return NextResponse.json({ error: "Upload ảnh thất bại." }, { status: 500 });
  }
}