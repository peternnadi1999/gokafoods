export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-100 px-5 pt-20">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-5">
        <div className="space-y-2">
          <div className="h-3 w-16 skeleton rounded" />
          <div className="h-6 w-24 skeleton rounded" />
        </div>
        <div className="flex gap-2">
          <div className="w-10 h-10 rounded-full skeleton" />
          <div className="w-10 h-10 rounded-full skeleton" />
        </div>
      </div>

      {/* Search skeleton */}
      <div className="h-12 skeleton rounded-2xl mb-3" />

      {/* Banner skeleton */}
      <div className="h-10 skeleton rounded-2xl mb-4" />

      {/* Category chips skeleton */}
      <div className="flex gap-2 mb-5">
        {[80, 60, 90, 55, 70].map((w, i) => (
          <div key={i} className={`h-9 w-${w === 80 ? '20' : w === 60 ? '16' : w === 90 ? '24' : w === 55 ? '14' : '18'} skeleton rounded-full flex-shrink-0`} />
        ))}
      </div>

      {/* Featured carousel skeleton */}
      <div className="flex gap-4 mb-6 overflow-hidden">
        <div className="w-[280px] h-[200px] skeleton rounded-3xl flex-shrink-0" />
        <div className="w-[280px] h-[200px] skeleton rounded-3xl flex-shrink-0" />
      </div>

      {/* Food list skeleton */}
      <div className="flex items-center justify-between mb-3">
        <div className="h-5 w-32 skeleton rounded" />
        <div className="h-4 w-8 skeleton rounded" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-3 flex items-center gap-3">
            <div className="w-[90px] h-[80px] rounded-xl skeleton flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 skeleton rounded" />
              <div className="h-3 w-1/2 skeleton rounded" />
              <div className="h-4 w-1/3 skeleton rounded" />
              <div className="h-3 w-2/3 skeleton rounded" />
            </div>
            <div className="w-9 h-9 rounded-full skeleton flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
