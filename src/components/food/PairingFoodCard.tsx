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

export default function PairingFoodCard({ food }: FoodCardProps) {

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
            <div className="overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">

                {/* Image */}
                <div className="relative w-full h-32 bg-gray-100">
                    <Image
                        src={food.productImage}
                        alt={food.productName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Floating actions */}
                    <div className="absolute top-2 right-2 flex gap-2">
                        <div className="bg-white rounded-full shadow-sm">
                            <WishlistButton
                                food={food}
                                size={14}
                                variant="card"
                            />
                        </div>

                        <button
                            onClick={handleAdd}
                            className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center shadow-sm"
                        >
                            <Plus
                                size={14}
                                className="text-white"
                                strokeWidth={3}
                            />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
                        {food.productName}
                    </h3>

                    <div className="flex items-center gap-1 mt-1 text-xs">
                        <span className="text-gray-400 capitalize">
                            {food.productCategory}
                        </span>

                        <span className="text-gray-300">•</span>

                        <span className="text-primary-500 truncate">
                            {food.partnerId.brandName}
                        </span>
                    </div>

                    <p className="text-primary-500 font-bold mt-2">
                        {formatNaira(food.productPrice)}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                            <Star
                                size={12}
                                className={
                                    food.rating
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300 fill-gray-300'
                                }
                            />
                            <span className="text-xs text-gray-500">
                                {food.rating
                                    ? food.rating.toFixed(1)
                                    : '0.0'}
                            </span>
                        </div>

                        {distance !== null && time !== null && (
                            <span className="text-[11px] text-gray-500">
                                {distance.toFixed(1)}km · {Math.round(time)}m
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );

}
