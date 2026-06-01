"use client";
import CategoryChips from '@/components/food/CategoryChips';
import FoodCard from '@/components/food/FoodCard'
import FoodCardSkeleton from '@/components/food/FoodCardSkeleton'
import { useFoods } from '@/lib/hooks/use-api';
import { FoodCategory } from '@/types';
import { ArrowRight, Search, Store } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { debounce } from '@/lib/utils';

// SEO Metadata

const Foods = () => {
    const [activeCategory, setActiveCategory] = useState<FoodCategory>('all');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const { data: foodsData, isLoading: foodsLoading } = useFoods(
        activeCategory !== 'all' ? activeCategory : undefined
    );

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

            <div className="sticky top-0 bg-gray-100/95 backdrop-blur-sm border-b border-gray-200/60 z-10 px-5 lg:px-8 pt-12 lg:pt-8 pb-4">
                <div className="max-w-screen-xl mx-auto flex items-center justify-between">

                    <button
                        onClick={() => router.back()}
                        className="md:text-2xl text-lg font-bold text-gray-900 flex items-center gap-2"
                    >
                        <ArrowRight size={16} className="rotate-180" />
                        Menu
                    </button>
                    <Link href="/verified-stores" className="cursor-pointer">
                        <button className="flex items-center justify-center">
                            <Store size={25} fill='black' className="text-gray-100" />
                        </button>
                    </Link>

                </div>
            </div>

            <div className='px-5 mt-5 lg:px-8 max-w-screen-xl mx-auto'>

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
                <h2 className="text-lg font-bold text-gray-900">
                    {debouncedQuery && `Results for "${debouncedQuery}"`}
                </h2>

                {/* Category chips */}
                <div className="my-6">
                    <CategoryChips
                        active={activeCategory}
                        onChange={(cat) => {
                            setActiveCategory(cat);
                            setSearchQuery('');
                            setDebouncedQuery('');
                        }}
                    />
                </div>
                <section>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-3">
                        {foodsLoading
                            ? Array.from({ length: 8 }).map((_, i) => <FoodCardSkeleton key={i} />)
                            : displayFoods.map((food: any) => <FoodCard key={food._id} food={food} />)}
                    </div>
                    {!foodsLoading && displayFoods.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-5xl mb-3">🍽️</p>
                            <p className="text-gray-500 font-roboto">No food found</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

export default Foods
