export default function JobsLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-800 dark:to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-48 bg-white/20 rounded-lg animate-pulse" />
          <div className="h-4 w-80 bg-white/10 rounded mt-3 animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
