"use client";
import { Package, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOrders } from '@/lib/hooks/use-api';
import { formatNaira } from '@/lib/utils';

// SEO Metadata


export default function OrdersPage() {
  const router = useRouter();
  const { data: orders, isLoading } = useOrders();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-gray-50 backdrop-blur-sm border-b border-gray-200/60 z-10 px-5 lg:px-8 pt-12 lg:pt-8 pb-4">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          {orders && orders.length > 0 && (
            <p className="text-sm text-gray-500 font-roboto mt-0.5">{orders.length} total orders</p>
          )}
        </div>
      </div>

      <div className="px-5 lg:px-8 py-6 max-w-screen-xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 h-52 skeleton" />
            ))}
          </div>
        ) : !orders?.length ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-5">
              <Package size={40} className="text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 text-sm font-roboto mb-8">
              Your order history will appear here once you place your first order.
            </p>
            <Link href="/discover" className="btn-primary max-w-[220px]">
              Order Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">

            {orders.map((order) => {
              const firstItem =
                (order.orders[0] as any)?.product?.productName;

              const totalItems =
                order.orders.reduce(
                  (acc, item) =>
                    acc + (item as any).quantity,
                  0
                );

              return (
                <div
                  key={order.groupId}
                  onClick={() => {
                    sessionStorage.setItem(
                      'selected_batch',
                      JSON.stringify(order)
                    );

                    router.push(`/orders/${order.groupId}`);
                  }}
                  className="bg-gray-100/50 rounded-3xl cursor-pointer hover:bg-gray-100 border border-gray-100 p-5"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm text-gray-500">
                        ID:
                        #{order.groupId
                          .slice(0, 6)
                          .toUpperCase()}...
                      </p>

                      <p className="text-gray-400 text-sm">
                        {new Date(
                          order.createdAt
                        ).toDateString()}
                      </p>
                    </div>

                    <span className="px-4 py-1 text-sm rounded-full bg-yellow-50 text-yellow-600 font-semibold">
                      {order.status}
                    </span>
                  </div>

                  <div className="border-t border-b py-4 my-4 flex items-center justify-between">
                    <div className="flex gap-3">
                      <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center">
                        <Package />
                      </div>

                      <div>
                        <h3 className="font-bold">
                          {firstItem}
                          {order.orders.length > 1 &&
                            ` +${order.orders.length - 1
                            } more`}
                        </h3>

                        <p className="text-gray-500 text-sm">
                          {totalItems} items total
                        </p>
                      </div>
                    </div>

                    <ChevronRight />
                  </div>

                  <div className="flex justify-between text-sm">
                    <p
                      className={
                        order.isLocked
                          ? 'text-green-600'
                          : 'text-orange-500'
                      }
                    >
                      {order.isLocked
                        ? 'Batch Finalized'
                        : 'Batch Open'}
                    </p>

                    <p className="font-bold">
                      Fee:
                      <span className='ml-2'>{formatNaira(
                        order.shippingFee
                      )}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div >
  );
}
