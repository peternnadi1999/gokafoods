"use client";

import { useNotifications, useMarkNotificationAsRead } from '@/lib/hooks/use-api';
import { useMemo } from 'react';

const ICON_MAP: Record<string, string> = {
	HOT: '🔥',
	CHECK: '✅',
	UPDATE: '📲',
	INFO: 'ℹ️',
	ALERT: '🚨',
};

function getNotificationIcon(notification: any) {
	const iconKey =
		notification.icon ||
		notification.type ||
		notification.tag ||
		notification.category ||
		notification.title?.split(' ')[0];

	if (!iconKey) return '';

	const normalized = String(iconKey).trim().toUpperCase();
	return ICON_MAP[normalized] || String(iconKey);
}

function formatNotificationTimestamp(value: string | number | Date) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '';

	const diffSeconds = Math.round((Date.now() - date.getTime()) / 1000);
	if (diffSeconds < 5) return 'just now';
	if (diffSeconds < 60) return `${diffSeconds} sec${diffSeconds === 1 ? '' : 's'} ago`;

	const diffMinutes = Math.round(diffSeconds / 60);
	if (diffMinutes < 60) return `about ${diffMinutes} min${diffMinutes === 1 ? '' : 's'} ago`;

	const diffHours = Math.round(diffMinutes / 60);
	if (diffHours < 24) return `about ${diffHours} hr${diffHours === 1 ? '' : 's'} ago`;

	const diffDays = Math.round(diffHours / 24);
	if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;

	const diffWeeks = Math.round(diffDays / 7);
	if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`;

	const options: Intl.DateTimeFormatOptions = {
		month: 'short',
		day: 'numeric',
	};
	if (date.getFullYear() !== new Date().getFullYear()) {
		options.year = 'numeric';
	}

	return `on ${new Intl.DateTimeFormat('en-US', options).format(date)}`;
}


export default function NotificationsPage() {
	const { data: notifications, isLoading } = useNotifications();
	const markAsReadMutation = useMarkNotificationAsRead();

	console.log('Notifications data:', notifications);

	const unreadCount = useMemo(
		() =>
			Array.isArray(notifications)
				? notifications.filter((item: any) => !item.read).length
				: 0,
		[notifications]
	);

	const handleMarkAsRead = async (broadcastId: string) => {
	try {
			await markAsReadMutation.mutateAsync(broadcastId);
		} catch (error) {
			console.error('Failed to mark notification as read:', error);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 px-5 lg:px-8 py-10 max-w-screen-xl mx-auto">
				<p className="text-gray-500">Loading notifications...</p>
			</div>
		);
	}


	return (
		<div className="min-h-screen bg-gray-50 px-5 lg:px-8 py-10 max-w-screen-xl mx-auto">
			<div className="mb-8 border-b border-gray-200 pb-5">
				<h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
				<p className="text-sm text-gray-500 mt-2">
					{unreadCount > 0
						? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
						: 'All caught up.'}
				</p>
			</div>

			{!Array.isArray(notifications) || notifications.length === 0 ? (
				<div className="p-8 text-center">
					<p className="text-gray-500">No notifications yet.</p>
				</div>
			) : (
				<div className="space-y-4">
					{notifications.map((notification: any) => (
						<div
							key={notification._id}
							className={`rounded-3xl p-5 shadow-card border ${notification.read ? 'border-gray-200 bg-white' : 'border-primary-200 bg-primary-50/50'}`}
						>
							<div className="flex items-start justify-between gap-4">
								<div className="min-w-0">
										<p className="text-sm font-semibold text-gray-900 truncate">
											{getNotificationIcon(notification) ? (
												<span className="mr-2 inline-block">{getNotificationIcon(notification)}</span>
											) : null}
											{notification.title || 'Notification'}
										</p>
									<p className="mt-2 text-sm text-gray-600 leading-relaxed">{notification.description || 'No message content available.'}</p>
								</div>
								<button
									type="button"
									onClick={() => handleMarkAsRead(notification._id)}
									className="text-xs font-semibold text-primary-600 hover:text-primary-700"
									disabled={notification.read}
								>
									{notification.read ? 'Read' : 'Mark as read'}
								</button>
							</div>
								{notification.createdAt && (
									<p className="mt-3 text-xs text-gray-400">{formatNotificationTimestamp(notification.createdAt)}</p>
								)}
							</div>
						))}
					</div>
			)}
		</div>
	);
}
