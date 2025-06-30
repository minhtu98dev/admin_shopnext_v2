// src/components/features/product/EditProductForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { updateProduct, uploadImage } from "@/lib/api-client";
import { Product, ProductFormData } from "@/types";
import Image from "next/image";
import { UploadCloud, XCircle } from "lucide-react";

// Schema validation, đảm bảo tất cả các trường đều có quy tắc
const productSchema = z.object({
  name: z.string().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
  price: z.coerce.number().min(0, "Giá phải là một số dương"),
  brand: z.string().min(2, "Thương hiệu không được để trống"),
  category: z.string().min(2, "Danh mục không được để trống"),
  countInStock: z.coerce.number().min(0, "Số lượng kho phải là số không âm"),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
});

export default function EditProductForm({ product }: { product: Product }) {
  const router = useRouter();
  const [imageUrls, setImageUrls] = useState<string[]>(
    product.images && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : []
  );
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product,
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
        return `Tải lên thành công!`;
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
      toast.error("Sản phẩm phải có ít nhất một hình ảnh.");
      return;
    }
    const updatedData = { ...data, image: imageUrls[0], images: imageUrls };
    toast.promise(updateProduct(product._id, updatedData), {
      loading: "Đang cập nhật sản phẩm...",
      success: () => {
        router.push("/products");
        router.refresh(); // Làm mới trang product list để thấy thay đổi
        return "Cập nhật sản phẩm thành công!";
      },
      error: (err) => err.message,
    });
  };

  return (
    // Bọc toàn bộ form trong một card trắng có đổ bóng
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 sm:p-8 rounded-lg shadow-md space-y-6"
    >
      {/* Grid layout cho các trường chính, 2 cột trên màn hình vừa và lớn */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tên sản phẩm
          </label>
          <input
            id="name"
            {...register("name")}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Giá (VNĐ)
          </label>
          <input
            id="price"
            type="number"
            {...register("price")}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="brand"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Thương hiệu
          </label>
          <input
            id="brand"
            {...register("brand")}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.brand && (
            <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Danh mục
          </label>
          <input
            id="category"
            {...register("category")}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      {/* Trường số lượng chiếm toàn bộ chiều rộng */}
      <div>
        <label
          htmlFor="countInStock"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Số lượng trong kho
        </label>
        <input
          id="countInStock"
          type="number"
          {...register("countInStock")}
          className="block w-full md:w-1/2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.countInStock && (
          <p className="text-red-500 text-xs mt-1">
            {errors.countInStock.message}
          </p>
        )}
      </div>

      {/* Trường mô tả */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Mô tả
        </label>
        <textarea
          id="description"
          {...register("description")}
          rows={6}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Phần upload và hiển thị ảnh */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Hình ảnh sản phẩm
        </label>
        <div className="flex items-center gap-4">
          <label
            htmlFor="image-upload"
            className="relative cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <UploadCloud size={18} />
            <span>{isUploading ? "Đang tải..." : "Tải ảnh mới"}</span>
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
          <div className="p-4 border border-dashed rounded-lg grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {imageUrls.map((url, index) => (
              <div key={url} className="relative group aspect-square">
                <Image
                  src={url}
                  alt={`Xem trước ${index + 1}`}
                  fill
                  sizes="150px"
                  className="object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 m-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                  title="Xóa ảnh"
                >
                  <XCircle size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nút submit */}
      <div className="flex justify-end pt-4 border-t">
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
}
