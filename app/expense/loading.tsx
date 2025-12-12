export default function Loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-5 bg-white border rounded-lg shadow-sm">
        <div className="skeleton h-8 w-40 mb-4"></div>
        <div className="skeleton h-10 w-full mb-2"></div>
        <div className="skeleton h-10 w-full mb-2"></div>
        <div className="skeleton h-10 w-full mb-2"></div>
        <div className="skeleton h-10 w-full"></div>
      </div>

      <div className="md:col-span-2 p-4 bg-white border rounded-lg shadow-sm">
        <div className="skeleton h-8 w-40 mb-4"></div>
        <div className="skeleton h-96 w-full"></div>
      </div>
    </div>
  );
}
