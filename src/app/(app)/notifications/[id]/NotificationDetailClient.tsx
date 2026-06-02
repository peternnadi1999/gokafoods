"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotifications, useMarkNotificationAsRead } from '@/lib/hooks/use-api';
import { formatNotificationTimestamp, getNotificationIcon } from '../ClientPage';
import { ArrowLeftIcon } from 'lucide-react';

export default function NotificationDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();

  const notification = Array.isArray(notifications)
    ? notifications.find((n: any) => String(n._id) === String(id))
    : null;

  useEffect(() => {
    if (!notification) return;
    if (!notification.read) {
      markAsRead.mutate(notification._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-5 lg:px-8 py-10 max-w-screen-xl mx-auto">
        <p className="text-gray-500">Loading notification…</p>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="min-h-screen bg-gray-50 px-5 lg:px-8 py-10 max-w-screen-xl mx-auto">
        <p className="text-gray-500">Notification not found.</p>
        <button onClick={() => router.back()} className="mt-4 text-sm text-primary-600">Go back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-5 lg:px-8 py-10 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <button onClick={() => router.back()} className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"> <ArrowLeftIcon size={14} className='mr-1' /> Back</button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-card border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          {getNotificationIcon(notification) ? (
            <span className="inline-block mr-2">{getNotificationIcon(notification)}</span>
          ) : null}
          {notification.title}
        </h2>

        {notification.createdAt && (
          <p className="text-xs text-gray-400 mt-2">{formatNotificationTimestamp(notification.createdAt)}</p>
        )}

        <div className="mt-4 text-sm text-gray-700 leading-relaxed">
          {notification.description || 'No content available.'}
        </div>
      </div>
    </div>
  );
}
