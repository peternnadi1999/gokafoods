'use client';

import { cn } from '@/lib/utils';
import type { FoodCategory } from '@/types';

const CATEGORIES: { id: FoodCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'fries', label: 'Fries' },
  { id: 'swallows', label: 'Swallows' },
  { id: 'rice', label: 'Rice' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'soup', label: 'Soup' },
];

interface CategoryChipsProps {
  active: FoodCategory;
  onChange: (cat: FoodCategory) => void;
}

export default function CategoryChips({ active, onChange }: CategoryChipsProps) {
  return (
    <div className="flex gap-2.5 overflow-x-auto scrollbar-hide -mx-5 px-5 py-2">
      {CATEGORIES.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={cn('category-chip flex-shrink-0', id === active && 'active')}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
