export default function DashboardLoading() {
  return (
    <div>
      {/* Skeleton cho tiêu đề h1 */}
      <div className="h-8 w-64 bg-gray-300 rounded animate-pulse mb-6"></div>

      {/* Skeleton cho đoạn mô tả, bây giờ dùng div thay cho p */}
      <div className="h-6 w-96 bg-gray-300 rounded animate-pulse"></div>

      {/* Skeleton cho các card thống kê */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
}
