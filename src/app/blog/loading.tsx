export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-800 dark:to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-12 w-64 bg-white/20 rounded-lg animate-pulse mx-auto" />
          <div className="h-4 w-96 bg-white/10 rounded mt-4 animate-pulse mx-auto" />
        </div>
      </div>
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 justify-center mb-10">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
