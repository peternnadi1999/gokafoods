'use client';

import { useCategory } from '@/lib/hooks/use-api';
import { cn } from '@/lib/utils';
import type { FoodCategory } from '@/types';
import { useMemo } from 'react';

interface CategoryChipsProps {
  active: FoodCategory;
  onChange: (cat: FoodCategory) => void;
}

export default function CategoryChips({ active, onChange }: CategoryChipsProps) {

  const {data: CATEGORIES}= useCategory();

   const categories = useMemo(
    () => [
      {
        id: 'all',
        name: 'All',
      },
      ...(CATEGORIES?.data || []),
    ],
    [CATEGORIES]
  );
  
  return (
    <div className="flex gap-2.5 overflow-x-auto scrollbar-hide -mx-5 px-5 py-2">
      {categories?.map((category:any) => (
        <button
          key={category.id}
          onClick={() => onChange(category.id)}
          className={cn('category-chip bg-gray-400 flex-shrink-0', category.id === active && 'active')}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
