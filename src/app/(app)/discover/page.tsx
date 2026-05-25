'use client';

import { useState, useCallback } from 'react';
import { Bell, Store, Search } from 'lucide-react';
import {
  useFoods,
  useProfile,
  useUnreadNotificationCount,
  // useFeaturedFoods, 
} from '@/lib/hooks/use-api';
import FeaturedCarousel from '@/components/food/FeaturedCarousel';
import FoodCard from '@/components/food/FoodCard';
import CategoryChips from '@/components/food/CategoryChips';
import FoodCardSkeleton from '@/components/food/FoodCardSkeleton';
import SplashScreen from '@/components/ui/SplashScreen';
import { debounce } from '@/lib/utils';
import type { FoodCategory } from '@/types';
import Link from 'next/link';

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState<FoodCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { data: profile } = useProfile();
  const {data: unreadCount}= useUnreadNotificationCount();
  const user = profile?.user;

  // const { data: featuredFoods, isLoading: featuredLoading } = useFeaturedFoods();
  const { data: foodsData, isLoading: foodsLoading } = useFoods(
    activeCategory !== 'all' ? activeCategory : undefined
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((q: any) => setDebouncedQuery(q), 400),
    []
  );

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    debouncedSearch(q);
  };

  const displayFoods = foodsData?.filter((food: any) => {
    // category filter
    const matchesCategory =
      activeCategory === 'all' ||
      food.productCategory?.toLowerCase() === activeCategory.toLowerCase();

    // search filter
    const matchesSearch =
      !debouncedQuery ||
      food.productName
        ?.toLowerCase()
        .includes(debouncedQuery.toLowerCase()) ||
      food.partnerId?.brandName
        ?.toLowerCase()
        .includes(debouncedQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-gray-50 backdrop-blur-sm border-b border-gray-200/60 px-5 pt-12 pb-3 lg:pt-8 lg:px-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-500 text-sm font-roboto">Welcome</p>
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.userName || 'Guest'}
              </h1>
            </div>
            <div className="flex gap-2">
              {/* Updated button to navigate to Verified Stores page */}
              <Link href="/verified-stores">
                <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-card">
                  <Store size={20} className="text-gray-700" />
                </button>
              </Link>
              <Link href="/notifications" className="w-8 h-8 bg-white relative rounded-full flex items-center justify-center shadow-card">
                <Bell size={20} className="text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )} 
              </Link>
            </div>
          </div>

          {/* Search + support row */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="relative lg:max-w-md w-full">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search food, restaurants…"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="input-field bg-white"
              />
            </div>
            <div className="bg-primary-50 border border-primary-100 rounded-2xl px-4 py-2.5 flex items-center gap-2 flex-shrink-0">
              <span className="text-primary-500">📞</span>
              <span className="text-xs text-gray-600 font-roboto whitespace-nowrap">
                <span className="text-primary-500 font-semibold">Support: </span>
                +234 906 166 0247
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Page body */}
      <div className="px-5 lg:px-8 max-w-screen-xl mx-auto">

        {/* Category chips */}
        <div className="mt-4">
          <CategoryChips
            active={activeCategory}
            onChange={(cat) => {
              setActiveCategory(cat);
              setSearchQuery('');
              setDebouncedQuery('');
            }}
          />
        </div>

        {/* Featured */}
        {!debouncedQuery && (
          <section className="mt-5 mb-7">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">Featured</h2>
              <button className="text-primary-500 text-sm font-medium">See all</button>
            </div>
            <FeaturedCarousel foods={displayFoods.slice(0, 3)} loading={foodsLoading} />
          </section>
        )}

        {/* Food list/grid */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {debouncedQuery ? `Results for "${debouncedQuery}"` : 'Food Finds You'}
            </h2>
            {!debouncedQuery && (
              <button className="text-primary-500 text-sm font-medium">See all</button>
            )}
          </div>

          {/* Mobile: stacked. Tablet/Desktop: grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
            {foodsLoading
              ? Array.from({ length: 8 }).map((_, i) => <FoodCardSkeleton key={i} />)
              : displayFoods.map((food:any) => <FoodCard key={food._id} food={food} />)}
          </div>

          {!foodsLoading && displayFoods.length === 0 && (
            <div className="text-center py-16">
              <p className="text-5xl mb-3">🍽️</p>
              <p className="text-gray-500 font-roboto">No food found</p>
            </div>
          )}
        </section>
      </div>

      <SplashScreen />
    </div>
  );
}
