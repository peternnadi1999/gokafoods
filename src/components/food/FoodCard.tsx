'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Plus } from 'lucide-react';
import WishlistButton from './WishlistButton';
import { formatNaira } from '@/lib/utils';
import { getDistanceAndTime } from '@/lib/utils/location';
import type { FoodItem } from '@/types';
import { useState, useEffect } from 'react';
import { useAddToCart } from '@/lib/hooks/use-api';
interface FoodCardProps {
  food: FoodItem;
}

export default function FoodCard({ food }: FoodCardProps) {

  const [distance, setDistance] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);
 const { mutateAsync: serverAdd } = useAddToCart();

  useEffect(() => {
    async function fetchDistanceAndTime() {
      try {
        const result = await getDistanceAndTime({ lat: food.coordinates.lat, lon: food.coordinates.lng });
        setDistance(result.distance);
        setTime(result.time);
      } catch (error) {
        console.error('Error fetching distance and time:', error);
      }
    }

    fetchDistanceAndTime();
  }, [food.coordinates.lat, food.coordinates.lng]);

  const handleAdd = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    await serverAdd({ productId: food._id, quantity: 1 });

  };

  return (
    <Link href={`/product/${food._id}`} className="block group">
      <div className="food-card flex items-center gap-3 p-3 hover:shadow-card-hover transition-shadow duration-200">

        {/* Image */}
        <div className="relative w-[88px] h-[89px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
          <Image
            src={food.productImage}
            alt={food.productName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="88px"
          />
        </div>

        {/* Info — flex-1 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm truncate">{food.productName}</h3>

          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-400 font-roboto capitalize">{food.productCategory}</span>
            <span className="text-gray-200">|</span>
            <span className="text-primary-500 text-xs font-semibold truncate">
              {food.partnerId.brandName}
            </span>
          </div>

          <p className="text-primary-500 font-bold text-base mt-1">
            {formatNaira(food.productPrice)}
          </p>

          <div className="flex items-center gap-3 mt-0.5">
            <div className="flex items-center gap-1">
              <Star
                size={11}
                className={food.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}
              />
              <span className="text-[10px] text-gray-500 font-roboto">
                {food.rating ? food.rating.toFixed(1) : 'Not Rated'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              {distance !== null && time !== null && (
                <span className="text-[10px] font-roboto">
                  {distance.toFixed(2)} km · {Math.round(time)} mins
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right-side action buttons: heart + add-to-cart */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          {/* ❤️ Wishlist — prominent, always visible */}
          <WishlistButton
            food={food}
            size={17}
            variant="card"
          />
          {/* ➕ Add to cart */}
          <button
            onClick={handleAdd}
            className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center shadow-btn active:scale-90 transition-transform hover:bg-primary-600"
            aria-label={`Add ${food.productName} to cart`}
          >
            <Plus size={17} className="text-white" strokeWidth={3} />
          </button>
        </div>

      </div>
    </Link>
  );
}
