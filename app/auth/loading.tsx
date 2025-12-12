export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white border rounded-lg p-6 shadow-sm w-full max-w-sm">
        <div className="skeleton h-8 w-40 mb-4"></div>
        <div className="skeleton h-10 w-full mb-3"></div>
        <div className="skeleton h-10 w-full mb-3"></div>
        <div className="skeleton h-10 w-full"></div>
      </div>
    </div>
  );
}
