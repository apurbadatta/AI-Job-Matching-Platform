export default function Loading() {
  return (
    <div className="min-h-[60vh] bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full" />
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
