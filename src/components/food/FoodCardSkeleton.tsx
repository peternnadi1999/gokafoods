export default function FoodCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-3 flex items-center gap-3">
      <div className="w-[90px] h-[80px] rounded-xl skeleton flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="h-3 w-1/2 skeleton rounded" />
        <div className="h-4 w-1/3 skeleton rounded" />
        <div className="h-3 w-2/3 skeleton rounded" />
      </div>
      <div className="w-9 h-9 rounded-full skeleton flex-shrink-0" />
    </div>
  );
}
