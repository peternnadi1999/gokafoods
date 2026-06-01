
import { useNotifications, useMarkNotificationAsRead } from '@/lib/hooks/use-api';
import { useMemo } from 'react';

// SEO Metadata

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
							key={notification._id || notification.id || notification.broadcastId}
							className={`rounded-3xl p-5 shadow-card border ${notification.read ? 'border-gray-200 bg-white' : 'border-primary-200 bg-primary-50/50'}`}
						>
							<div className="flex items-start justify-between gap-4">
								<div className="min-w-0">
									<p className="text-sm font-semibold text-gray-900 truncate">{notification.title || 'Notification'}</p>
									<p className="mt-2 text-sm text-gray-600 leading-relaxed">{notification.message || notification.body || 'No message content available.'}</p>
								</div>
								<button
									type="button"
									onClick={() => handleMarkAsRead(notification._id || notification.id || notification.broadcastId)}
									className="text-xs font-semibold text-primary-600 hover:text-primary-700"
									// disabled={notification.read || markAsReadMutation.isLoading}
								>
									{notification.read ? 'Read' : 'Mark as read'}
								</button>
							</div>
							{notification.createdAt && (
								<p className="mt-3 text-xs text-gray-400">{new Date(notification.createdAt).toLocaleString()}</p>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
