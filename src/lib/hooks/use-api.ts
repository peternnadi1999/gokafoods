import {
	useQuery,
	useMutation,
	useQueryClient,
	type UseQueryOptions,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/api/endpoints";
import {
	authService,
	userService,
	foodService,
	cartService,
	orderService,
	wishlistService,
	storeService,
	ratingService,
	stampService,
	notificationService,
	rewardRedemptionService,
	rewardService,
	category,
} from "@/lib/api/services";
import { setTokens, clearTokens } from "@/lib/api/client";
import type {
	LoginPayload,
	SignupPayload,
	FoodCategory,
	User,
	ForgotPasswordPayload,
	ResetPasswordPayload,
	OrderConfirmation,
	InitiateOrderPayload,
} from "@/types";
import { toast } from "sonner";

// ──────────────────────────────────────────────
// AUTH
// ──────────────────────────────────────────────
export function useLogin() {
	return useMutation({
		mutationFn: (payload: LoginPayload) =>
			authService.login(payload).then((res) => res.data),
		onSuccess: (data) => {
			setTokens(data?.token);
		},
	});
}

export function useSignup() {
	return useMutation({
		mutationFn: (payload: SignupPayload) =>
			authService.signup(payload).then((res) => res.data),
		onSuccess: (data) => {
			setTokens(data?.token);
		},
	});
}

export function useForgotPassword() {
	return useMutation({
		mutationFn: (payload: ForgotPasswordPayload) =>
			authService.forgotPassword(payload).then((res) => res.data),
	});
}

export function useResetPassword() {
	return useMutation({
		mutationFn: (payload: ResetPasswordPayload) =>
			authService.resetPassword(payload).then((res) => res.data),
	});
}

export function useLogout() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => authService.logout(),
		onSettled: () => {
			clearTokens();
			queryClient.clear();
		},
	});
}

// ──────────────────────────────────────────────
// USER
// ──────────────────────────────────────────────
export function useProfile(options?: UseQueryOptions<User>) {
	return useQuery({
		queryKey: QUERY_KEYS.USER,
		queryFn: async () => {
			return userService.getProfile().then((r) => r.data);
		},
		...options,
	});
}

export function useUpdateProfile() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: Partial<User>) => {
			return userService.updateProfile(data).then((r) => r.data.data);
		},
		onSuccess: (updated) => queryClient.setQueryData(QUERY_KEYS.USER, updated),
	});
}

export function useUploadAvatar() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (userPhoto: File) =>
			userService.uploadAvatar(userPhoto).then((r) => r.data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER }),
	});
}

export function useFundWallet() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			amount,
			reference,
		}: {
			amount: number;
			reference: string;
		}) => userService.fundWallet(amount, reference).then((r) => r.data.data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER }),
	});
}

// ──────────────────────────────────────────────
// STORES
// ──────────────────────────────────────────────
export function useStores() {
	return useQuery({
		queryKey: QUERY_KEYS.STORES,
		queryFn: async () => {
			return storeService.getStores().then((r) => r.data);
		},
	});
}

export function useStoreById(storeId: string) {
	return useQuery({
		queryKey: QUERY_KEYS.STORE(storeId),
		queryFn: async () => {
			const response = await storeService.getStoreById(storeId);
			return {
				data: response.data.data,
				store: (response.data as any)?.store,
			};
		},
		enabled: !!storeId,
	});
}

// ──────────────────────────────────────────────
// RATING
// ──────────────────────────────────────────────
export function useRatings(productId: string) {
	return useQuery({
		queryKey: QUERY_KEYS.RATINGS(productId),
		queryFn: async () => {
			return ratingService.getRatings(productId).then((r) => r.data);
		},
		enabled: !!productId,
	});
}

export function useRateProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			productId,
			rating,
			comment,
		}: {
			productId: string;
			rating: number;
			comment?: string;
		}) =>
			ratingService.rateProduct(productId, rating, comment).then((r) => r.data),
		onSuccess: async (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.RATINGS(variables.productId),
			});
			await queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.FOOD(variables.productId),
			});
		},
	});
}

// ──────────────────────────────────────────────
// FOODS
// ──────────────────────────────────────────────
export function useFoods(category?: FoodCategory) {
	return useQuery({
		queryKey: category
			? QUERY_KEYS.FOODS_BY_CATEGORY(category)
			: QUERY_KEYS.FOODS,
		queryFn: async () => {
			return foodService.getAll({ category }).then((r) => r.data);
		},
	});
}

// export function useFeaturedFoods() {
//   return useQuery({
//     queryKey: QUERY_KEYS.FEATURED_FOODS,
//     queryFn: async () => {
//       return foodService.getFeatured().then((r) => r.data.data);
//     },
//   });
// }

export function useFoodDetail(id: string) {
	return useQuery({
		queryKey: QUERY_KEYS.FOOD(id),
		queryFn: async () => {
			return foodService.getById(id).then((r) => r.data);
		},
		enabled: !!id,
	});
}

export function useFoodSearch(query: string, category?: FoodCategory) {
	return useQuery({
		queryKey: QUERY_KEYS.FOOD_SEARCH(query),
		queryFn: async () => {
			return foodService.search(query, category).then((r) => r.data.data);
		},
		enabled: query.length > 1,
	});
}

// ──────────────────────────────────────────────
// CART
// ──────────────────────────────────────────────
export function useCart(lat?: number, lng?: number) {
	return useQuery({
		queryKey: [...QUERY_KEYS.CART, lat, lng],

		queryFn: async () => {
			const response = await cartService.getCart(lat!, lng!);
			return response.data;
		},

		enabled: typeof lat === "number" && typeof lng === "number",
	});
}

export function useAddToCart() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			productId,
			quantity,
		}: {
			productId: string;
			quantity: number;
		}) => cartService.addItem(productId, quantity).then((r) => r.data),
		onSuccess: async (updated) => {
			toast.success(updated.message || `Item added to cart 🛒`);

			queryClient.setQueryData(QUERY_KEYS.CART, updated);
			await queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.CART,
			});
		},
		onError: (error: any) => {
			toast.error(error.response?.data.message || "Failed to add item to cart");
		},
	});
}

export function useRemoveCartItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (itemId: string) =>
			cartService.removeItem(itemId).then((r) => r.data.data),

		onSuccess: async (_, itemId) => {
			queryClient.setQueriesData({ queryKey: QUERY_KEYS.CART }, (old: any) => {
				if (!old?.data) return old;

				const filteredItems = old.data.filter(
					(item: any) => item._id !== itemId,
				);

				return {
					...old,
					data: filteredItems,
					count: filteredItems.length,
				};
			});
			toast.success("Item removed from cart");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to remove item from cart");
		},
	});
}

export function useClearCart() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => cartService.clearCart().then((r) => r.data.data),
		onSuccess: async (result: any) => {
			queryClient.setQueriesData(
				{ queryKey: QUERY_KEYS.CART },
				{
					data: [],
					count: 0,
				},
			);

			await queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.CART,
				exact: false,
			});
			toast.success(result?.message || "Your cart has been cleared");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to clear cart");
		},
	});
}

// ──────────────────────────────────────────────
// ORDERS
// ──────────────────────────────────────────────
export function useOrders() {
	return useQuery({
		queryKey: QUERY_KEYS.ORDERS,
		queryFn: async () => {
			return orderService.getOrders().then((r) => r.data.data);
		},
	});
}

export function useConfirmOrderCost() {
	return useMutation({
		mutationFn: (payload: OrderConfirmation) =>
			orderService.confirmCost(payload).then((r) => r.data),
		onSuccess(data: any) {
			toast.success(
				data?.message || "Cost confirmed. You can now place your order.",
			);
			return data;
		},
		onError(error: any) {
			toast.error(
				error.response?.data.message || "Failed to confirm order cost",
			);
		},
	});
}

export function useInitiateOrder() {
	return useMutation({
		mutationFn: (payload: InitiateOrderPayload) =>
			orderService.initiateOrder(payload).then((r) => r.data),
		onSuccess(data: any) {
			toast.success(data?.message || "Order initiated successfully");
			return data;
		},
		onError(error: any) {
			toast.error(error.response?.data.message || "Failed to initiate order");
		},
	});
}

// ──────────────────────────────────────────────
// NOTIFICATION SERVICES
// ──────────────────────────────────────────────
export function useNotifications() {
	return useQuery({
		queryKey: QUERY_KEYS.NOTIFICATIONS,
		queryFn: () =>
			notificationService.getNotifications().then((r: any) => { console.log("Fetched notifications:", r.data); return r.data;}),
	});
}

export function useUnreadNotificationCount() {
	return useQuery({
		queryKey: QUERY_KEYS.UNREAD_NOTIFICATION_COUNT,
		queryFn: async () => {
			return notificationService.getUnreadCount().then((r: any) => r.data);
		},
	});
}

export function useMarkNotificationAsRead() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (broadcastId: string) =>
			notificationService.markAsRead(broadcastId).then((r: any) => r.data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS }),
	});
}

// ──────────────────────────────────────────────
// WISHLIST
// ──────────────────────────────────────────────
export function useWishlist() {
	return useQuery({
		queryKey: QUERY_KEYS.WISHLIST,
		queryFn: async () => {
			return wishlistService.getWishlist().then((r) => r.data.data);
		},
	});
}

export function useToggleWishlist() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			productId,
			isInWishlist,
		}: {
			productId: string;
			isInWishlist: boolean;
		}) =>
			isInWishlist
				? wishlistService.removeFromWishlist(productId)
				: wishlistService.addToWishlist(productId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST }),
	});
}

// ──────────────────────────────────────────────
// STAMP SERVICES
// ──────────────────────────────────────────────
export function useStampCount() {
	return useQuery({
		queryKey: QUERY_KEYS.STAMP_COUNT,
		queryFn: () =>
			stampService.getStampCount().then((r: any) => r.data.userData),
	});
}

// ──────────────────────────────────────────────
// REWARD SERVICES
// ──────────────────────────────────────────────
export function useRewards() {
	return useQuery({
		queryKey: QUERY_KEYS.REWARDS,
		queryFn: async () => {
			return rewardService.getRewards().then((r) => {
				console.log("Rewards data:", r.data);
				return r.data;
			});
		},
	});
}

export function useClaimReward() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (rewardId: string) =>
			rewardRedemptionService.redeemReward(rewardId).then((r: any) => r.data),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REWARDS });
			toast.success(res.message || "Reward redeemed successfully!");
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message ||
					"Failed to redeem reward. Please try again.",
			);
		},
	});
}

// ──────────────────────────────────────────────
// CATEGORY SERVICES
// ──────────────────────────────────────────────

export function useCategory() {
	return useQuery({
		queryKey: QUERY_KEYS.CATEGORY,
		queryFn: async () => {
			return category.getCategory().then((r) => {
				return r.data;
			});
		},
	});
}

export function useProductCategory(categories: string) {
	return useQuery({
		queryKey: QUERY_KEYS.PRODUCT_CATEGORY(categories),
		queryFn: async () => {
			return category.getProductCategory(categories).then((r) => r.data);
		},
	});
}
