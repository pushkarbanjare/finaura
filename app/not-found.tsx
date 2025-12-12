export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
      <p className="text-lg text-gray-700 mb-6">
        The page you are looking for doesn't exist.
      </p>

      <a
        href="/dashboard"
        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
      >
        Go to Dashboard
      </a>
    </div>
  );
}
