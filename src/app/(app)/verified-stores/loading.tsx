export default function VerifiedStoresSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="sticky top-0 z-30 bg-gray-50 border-b border-gray-200/60 px-5 pt-12 pb-3 lg:pt-8 lg:px-8">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="h-5 w-20 skeleton rounded" />
          <div className="h-6 w-40 skeleton rounded" />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 lg:px-8 max-w-screen-xl mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4"
            >
              {/* Logo */}
              <div className="w-16 h-16 rounded-full skeleton flex-shrink-0" />

              {/* Text */}
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 skeleton rounded" />
                <div className="h-3 w-1/2 skeleton rounded" />

                <div className="flex gap-2 mt-2">
                  <div className="h-3 w-12 skeleton rounded" />
                  <div className="h-3 w-2 skeleton rounded" />
                  <div className="h-3 w-12 skeleton rounded" />
                </div>
              </div>

              {/* Verified badge */}
              <div className="h-4 w-16 skeleton rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}