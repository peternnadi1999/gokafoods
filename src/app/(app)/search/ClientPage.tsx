"use client";
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useFoodSearch } from '@/lib/hooks/use-api';
import { useDebounce } from '@/lib/hooks/use-debounce';
import FoodCard from '@/components/food/FoodCard';
import FoodCardSkeleton from '@/components/food/FoodCardSkeleton';

// SEO Metadata

const RECENT_KEY = 'gkf_recent_searches';
function getRecent(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}
function saveRecent(q: string) {
  const updated = [q, ...getRecent().filter((s) => s !== q)].slice(0, 6);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [recents, setRecents] = useState<string[]>(getRecent);
  const debouncedQuery = useDebounce(query, 400);

  const { data: results, isLoading } = useFoodSearch(debouncedQuery);

  const handleSearch = (q: string) => {
    if (q.trim()) saveRecent(q.trim());
    setQuery(q);
  };

  const clearRecent = (item: string) => {
    const updated = recents.filter((r) => r !== item);
    setRecents(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-gray-50 backdrop-blur-sm border-b border-gray-200/60 z-10 px-5 lg:px-8 pt-12 lg:pt-8 pb-4">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Search</h1>
          <div className="relative max-w-xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search food, restaurants…"
              className="input-field pl-11 pr-10 bg-white"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                <X size={16} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 lg:px-8 py-6 max-w-screen-xl mx-auto">
        {/* Recent searches */}
        {!query && recents.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Recent Searches</p>
            <div className="flex flex-wrap gap-2">
              {recents.map((r) => (
                <div key={r} className="flex items-center gap-1.5 bg-white rounded-full px-4 py-2 shadow-card">
                  <button onClick={() => setQuery(r)} className="text-sm text-gray-700 font-medium">{r}</button>
                  <button onClick={() => clearRecent(r)} className="text-gray-300 hover:text-gray-500 transition-colors">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!query && recents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500 font-roboto">Search for your favourite food or restaurant</p>
          </div>
        )}

        {/* Results */}
        {debouncedQuery && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              {isLoading ? 'Searching…' : `${results?.total ?? 0} result${results?.total !== 1 ? 's' : ''} for "${debouncedQuery}"`}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <FoodCardSkeleton key={i} />)
                : results?.items.map((food) => <FoodCard key={food._id} food={food} />)}
            </div>
            {!isLoading && results?.items.length === 0 && (
              <div className="text-center py-16">
                <p className="text-5xl mb-3">😕</p>
                <p className="text-gray-500 font-roboto">No results for &quot;{debouncedQuery}&quot;</p>
                <p className="text-gray-400 text-sm mt-1 font-roboto">Try a different keyword</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
