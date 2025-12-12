export default function Loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 p-4 bg-white border rounded-lg shadow-sm">
        <div className="skeleton h-6 w-40 mb-4"></div>
        <div className="skeleton h-72 w-full"></div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <div className="skeleton h-6 w-32 mb-2"></div>
          <div className="skeleton h-20 w-full"></div>
        </div>

        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <div className="skeleton h-6 w-28 mb-2"></div>
          <div className="skeleton h-20 w-full"></div>
        </div>
      </div>
    </div>
  );
}
