"use client";

import { useRouter } from 'next/navigation';
import { useStoreById } from '@/lib/hooks/use-api';
import { ArrowRight } from 'lucide-react';
import FoodStoreCard from '@/components/food/FoodStoreCard';
import VerifiedStoresSkeleton from '../../verified-stores/loading';
import Image from 'next/image';

export default function StorePage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const { data: storesproduct, isLoading } = useStoreById(params.id)


  if (isLoading) {
    return <VerifiedStoresSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-30 bg-gray-50 my-auto backdrop-blur-sm border-b border-gray-200/60 px-5 py-10 pb-3 lg:py-8 lg:px-8">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-gray-600 font-bold cursor-pointer flex items-center gap-2"
          >
            <ArrowRight size={16} className="rotate-180" />
            Back
          </button>
        </div>
      </div>

      {storesproduct?.store && (
        <div className="bg-white shadow-sm border border-gray-100 p-5 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-5">

            {/* Logo */}
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                src={storesproduct.store.logo}
                alt={storesproduct.store.brandName}
                fill
                className="w-full h-full object-cover"
              />
            </div>

            {/* Store Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {storesproduct.store.brandName}
                </h2>

                {storesproduct.store.verificationStatus && (
                  <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    VERIFIED
                  </span>
                )}
              </div>

              <p className="text-gray-500 md:text-base text-sm leading-relaxed max-w-2xl">
                {storesproduct.store.statement}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-400">
                <span>
                  <span className='text-black font-bold mr-2'>Joined: </span> {new Date(
                    storesproduct.store.joinedAt
                  ).toLocaleDateString()}
                </span>

                <span>•</span> 

                <span>
                  {storesproduct.data.length || 0} Product
                  {(storesproduct.data.length || 0) !== 1 ? 's' : ''}
                </span>

                <span><span className='text-black font-bold mr-2'>Address: </span>{storesproduct.store.address}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-5 lg:px-8 max-w-screen-xl mx-auto py-6">
        {storesproduct?.data.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storesproduct.data.map((food) => (
              <FoodStoreCard key={food._id} food={food} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center text-center py-16">
            <div>
              <p className="text-5xl mb-3">🍽️</p>
              <p className="text-gray-500 font-roboto">No food found</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}