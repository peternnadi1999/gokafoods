'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus, MapPin } from 'lucide-react';
import WishlistButton from './WishlistButton';
import { formatNaira } from '@/lib/utils';
import type { FoodItem } from '@/types';
import { useAddToCart } from '@/lib/hooks/use-api';

interface FeaturedCarouselProps {
  foods: any[];
  loading?: boolean;
}

export default function FeaturedCarousel({ foods, loading }: FeaturedCarouselProps) {
  const { mutateAsync: serverAdd } = useAddToCart();

   const handleAdd = async (e: React.MouseEvent<HTMLButtonElement>, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    await serverAdd({ productId, quantity: 1 });
  };

  if (loading) {
    return (
      <>
        <div className="flex md:hidden gap-4 overflow-x-auto scrollbar-hide -mx-5 px-5">
          {[1, 2].map((i) => (
            <div key={i} className="flex-shrink-0 w-[280px] h-[210px] rounded-3xl skeleton" />
          ))}
        </div>
        <div className="hidden md:grid grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[210px] rounded-3xl skeleton" />
          ))}
        </div>
      </>
    );
  }

  if (!foods.length) return null;

  const Card = ({ food }: { food: FoodItem }) => (
    <Link
      href={`/product/${food._id}`}
      className="relative rounded-3xl overflow-hidden bg-white shadow-card hover:shadow-card-hover transition-shadow duration-200 block group"
    >
      {/* Restaurant tag — top-left */}
      <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm rounded-xl px-2.5 py-1 flex items-center gap-1.5 shadow-sm">
        <span className="text-primary-500 text-xs">🍽</span>
        {/* <span className="text-primary-500 text-[11px] font-bold uppercase">
          {food.restaurant.name}
        </span> */}
      </div>

      {/* ❤️ Wishlist — top-right, clearly visible */}
      <div className="absolute top-3 right-3 z-10">
        <WishlistButton food={food} size={18} variant="overlay" />
      </div>

      {/* Image */}
      <div className="relative h-[150px] w-full bg-gray-100">
        <Image
          src={food.productImage}
          alt={food.productName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 280px, (max-width: 1280px) 50vw, 33vw"
        />
      </div>

      {/* Card info */}
      <div className="p-3 relative">
        <h3 className="font-bold text-gray-900 text-base leading-tight pr-10">{food.productName}</h3>
        <p className="text-gray-400 text-xs font-roboto line-clamp-2 mt-0.5">
          {food.productDesc}
        </p>

        <div className="flex items-center justify-between mt-2">
          <span className="text-primary-500 font-bold text-base">
            {formatNaira(food.productPrice || 0)}
          </span>
          <div className="flex items-center gap-1 text-gray-400 text-xs font-roboto">
            <MapPin size={11} />
            {/* {food.restaurant.distanceKm.toFixed(2)}km · {food.restaurant.estimatedMins} mins */}
          </div>
        </div>

        {/* ➕ Add to cart — bottom-right of card body */}
        <button
          onClick={(e) => handleAdd(e, food._id)}
          className="absolute bottom-3 right-3 w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center shadow-btn active:scale-90 transition-transform hover:bg-primary-600"
          aria-label={`Add ${food.productName} to cart`}
        >
          <Plus size={17} className="text-white" strokeWidth={3} />
        </button>
      </div>
    </Link>
  );

  return (
    <>
      {/* Mobile: horizontal scroll */}
      <div className="flex md:hidden gap-4 overflow-x-auto scrollbar-hide -mx-5 px-5">
        {foods.map((food) => (
          <div key={food._id} className="flex-shrink-0 w-[280px]">
            <Card food={food} />
          </div>
        ))}
      </div>

      {/* Tablet/Desktop: grid */}
      <div className="hidden md:grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {foods.map((food) => (
          <Card key={food._id} food={food} />
        ))}
      </div>
    </>
  );
}
