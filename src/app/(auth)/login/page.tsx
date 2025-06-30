// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, LayoutDashboard } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    toast.promise(
      fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }).then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message || "Đăng nhập thất bại.");
          });
        }
        return res.json();
      }),
      {
        loading: "Đang đăng nhập...",
        success: () => {
          router.push("/dashboard");
          return "Đăng nhập thành công! Chào mừng trở lại.";
        },
        error: (err) => err.message,
        finally: () => setIsLoading(false),
      }
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-12">
      {/* Phần Branding Logo và Tiêu đề */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg ">
          <LayoutDashboard className="h-8 w-8 text-black" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Admin Panel
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Đăng nhập vào tài khoản quản trị của bạn
        </p>
      </div>

      {/* Card Form chính */}
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-md">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900">Đăng nhập</h2>
          <p className="mt-1 text-sm text-gray-500">
            Nhập thông tin đăng nhập để truy cập dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="relative mt-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-md py-2 border-gray-300 pl-10 shadow-sm  sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </label>
            <div className="relative mt-1">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-md py-2 border-gray-300 pl-10 pr-10 shadow-sm  sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Ghi nhớ đăng nhập
              </label>
            </div>
            <div className="text-sm">
              <Link
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md border border-transparent bg-gray-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </div>
        </form>

        {/* Phần thông tin demo */}
        <div className="mt-6 rounded-lg bg-gray-100 p-4 text-sm">
          <p className="text-gray-600">
            <span className="font-semibold">Thông tin demo:</span>
            <br />
            <span className="font-medium">Email:</span> admin@example.com <br />
            <span className="font-medium">Mật khẩu:</span> yourpassword123
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-gray-500">
        © 2024 Admin Panel. Tất cả quyền được bảo lưu.
      </p>
    </div>
  );
}
