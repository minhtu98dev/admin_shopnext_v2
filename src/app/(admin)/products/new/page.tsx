"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { createProduct, uploadImage } from "@/lib/api-client";
import Image from "next/image";
import { UploadCloud, XCircle, ArrowLeftCircle } from "lucide-react";
import { ProductFormData } from "@/types";

// Định nghĩa schema validation bằng Zod
const productSchema = z.object({
  name: z.string().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
  price: z.coerce.number().min(0, "Giá phải là một số dương"),
  brand: z.string().min(2, "Thương hiệu không được để trống"),
  category: z.string().min(2, "Danh mục không được để trống"),
  countInStock: z.coerce.number().min(0, "Số lượng kho phải là số không âm"),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
});

export default function NewProductPage() {
  const router = useRouter();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const handleImageUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadPromises = Array.from(files).map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      return uploadImage(formData);
    });

    toast.promise(Promise.all(uploadPromises), {
      loading: `Đang tải lên ${files.length} ảnh...`,
      success: (results) => {
        const newUrls = results.map((result) => result.url);
        setImageUrls((prevUrls) => [...prevUrls, ...newUrls]);
        setIsUploading(false);
        return `Tải lên thành công ${results.length} ảnh!`;
      },
      error: (err) => {
        setIsUploading(false);
        return err.message;
      },
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImageUrls((prevUrls) =>
      prevUrls.filter((_, index) => index !== indexToRemove)
    );
  };

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    if (imageUrls.length === 0) {
      toast.error("Vui lòng tải lên ít nhất một hình ảnh cho sản phẩm.");
      return;
    }

    const productData = {
      ...data,
      image: imageUrls[0], // Lấy ảnh đầu tiên làm ảnh đại diện
      images: imageUrls,
    };

    toast.promise(createProduct(productData), {
      loading: "Đang tạo sản phẩm...",
      success: () => {
        router.push("/products");
        return "Tạo sản phẩm thành công!";
      },
      error: (err) => err.message,
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-blue-600 hover:underline"
      >
        <ArrowLeftCircle size={20} />
        Quay lại danh sách sản phẩm
      </Link>
      <h1 className="text-2xl font-bold">Thêm sản phẩm mới</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Tên sản phẩm
            </label>
            <input
              id="name"
              {...register("name")}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Giá (VNĐ)
            </label>
            <input
              id="price"
              type="number"
              {...register("price")}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">
                {errors.price.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="brand"
              className="block text-sm font-medium text-gray-700"
            >
              Thương hiệu
            </label>
            <input
              id="brand"
              {...register("brand")}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.brand && (
              <p className="text-red-500 text-xs mt-1">
                {errors.brand.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Danh mục
            </label>
            <input
              id="category"
              {...register("category")}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">
                {errors.category.message}
              </p>
            )}
          </div>
        </div>
        <div>
          <label
            htmlFor="countInStock"
            className="block text-sm font-medium text-gray-700"
          >
            Số lượng trong kho
          </label>
          <input
            id="countInStock"
            type="number"
            {...register("countInStock")}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.countInStock && (
            <p className="text-red-500 text-xs mt-1">
              {errors.countInStock.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Mô tả
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={5}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Hình ảnh sản phẩm
          </label>
          <div className="mt-2">
            <label
              htmlFor="image-upload"
              className="relative cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <UploadCloud size={16} />
              <span>
                {isUploading ? "Đang tải lên..." : "Chọn một hoặc nhiều ảnh"}
              </span>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageUpload}
              disabled={isUploading}
              multiple
            />
          </div>
          {imageUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={url}
                    alt={`Xem trước ${index + 1}`}
                    width={128}
                    height={128}
                    className="w-full h-auto object-cover rounded-lg aspect-square"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Xóa ảnh"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? "Đang lưu..." : "Tạo sản phẩm"}
          </button>
        </div>
      </form>
    </div>
  );
}
