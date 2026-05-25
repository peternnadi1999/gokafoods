// ============================================================
// BASE URL
// ============================================================
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ============================================================
// AUTH ENDPOINTS
// ============================================================
export const AUTH_ENDPOINTS = {
	LOGIN: "/user/loginuser",
	SIGNUP: "/user/createuser",
	RESEND_VERIFY: "/user/resend-verification",
	CHECK_VERIFIED: "/user/check-verification",
	FORGOT_PASSWORD: "/user/recover-password",
	RESET_PASSWORD: "/user/verify-email-password",

	LOGOUT: "/auth/logout",
	GOOGLE: "/auth/google",

	FACEBOOK: "/auth/facebook",
	VERIFY_EMAIL: "/auth/verify-email",

} as const;

// ============================================================
// USER ENDPOINTS
// ============================================================
export const USER_ENDPOINTS = {
	PROFILE: "/user/user-profile",
	FUND_WALLET: "/profile/fundaccount",
	UPLOAD_AVATAR: "/profile/uploaduserphoto",
	UPDATE_PROFILE: "/profile/updateuserprofile",

	WALLET_BALANCE: "/users/me/wallet",
	STAMP_CARD: "/users/me/stamps",
	DELETE_ACCOUNT: "/users/me",
} as const;

// ============================================================
// FOOD ENDPOINTS
// ============================================================
export const FOOD_ENDPOINTS = {
	LIST: "/product/getallproducts",
	DETAIL: (Id: string) => `/product/getproductById/${Id}`,

	FEATURED: "/foods/featured",
	BY_CATEGORY: (category: string) => `/foods?category=${category}`,
	SEARCH: "/foods/search",
	PAIRING_SUGGESTIONS: (id: string) => `/foods/${id}/pairings`,
} as const;

// ============================================================
// RESTAURANT ENDPOINTS
// ============================================================
export const RESTAURANT_ENDPOINTS = {
	LIST: "/restaurants",
	DETAIL: (id: string) => `/restaurants/${id}`,
	MENU: (id: string) => `/restaurants/${id}/menu`,
} as const;

// ============================================================
// RATING ENDPOINTS
// ============================================================
export const RATING_ENDPOINTS = {
	GET_RATINGS: (productId: string) => `/rating/getallratings/${productId}`,
	RATE_PRODUCT: (productId: string) => `/rating/rateproduct/${productId}`,
} as const;


// ============================================================
// CART ENDPOINTS
// ============================================================
export const CART_ENDPOINTS = {
	GET: "/cart/getsecondcartitem",
	ADD_ITEM: (productId: string) => `/cart/addtocart/${productId}`,
	REMOVE_ITEM: (productId: string) => `/cart/removeeachcartproduct/${productId}`,
	CLEAR: "/cart/removeallcartproduct",
} as const;

// ============================================================
// ORDER ENDPOINTS
// ============================================================
export const ORDER_ENDPOINTS = {
	LIST: "/order/getallorders",
	COST_CONFIRMATION: "/order/confirmcost",
	INTIATE_ORDER: "/order/initiateorder",
} as const;

// ============================================================
// WISHLIST ENDPOINTS
// ============================================================
export const WISHLIST_ENDPOINTS = {
	LIST: "/wishlist/getallwishlist",
	ADD: (productId: string) => `/wishlist/addtowishlist/${productId}`,
	REMOVE: (productId: string) => `/wishlist/removefromwishlist/${productId}`,
} as const;

// ============================================================
// STORE ENDPOINTS
// ============================================================
export const STORE_ENDPOINTS = {
	LIST: "/api/stores/verified",
	GET_STORE_BY_ID: (storeId: string) => `/api/stores/store/${storeId}`,
} as const;

// ============================================================
// REVIEW ENDPOINTS
// ============================================================
export const REVIEW_ENDPOINTS = {
	LIST: (foodId: string) => `/foods/${foodId}/reviews`,
	CREATE: (foodId: string) => `/foods/${foodId}/reviews`,
} as const;

// ============================================================
// STAMP ENDPOINTS	
// ============================================================

export const STAMP_ENDPOINTS = {
	GET: "/stamp/getuserstampcount",
} as const;


// ============================================================
// REWARD ENDPOINTS
// ============================================================

export const REWARD_ENDPOINTS = {
	GET_REWARD: "/reward/getallreward",
	CLAIM_REWARD: (rewardId: string) => `/reward/redeemreward/${rewardId}`,
};

// ============================================================
// NOTIFICATION ENDPOINTS
// ============================================================
export const NOTIFICATION_ENDPOINTS = {
	GET: "/broadcast/getbroadcast",
	GET_UNREAD_COUNT: "/broadcast/getunreadbroadcast",
	MARK_AS_READ: (broadcastId: string) => `/broadcast/readbroadcast/${broadcastId}`,
} as const;

// ============================================================
// QUERY KEYS (for React Query cache management)
// ============================================================
export const QUERY_KEYS = {
	USER: ["user"] as const,
	USER_VERIFIED: ["user", "verified"] as const,
	RATINGS: (productId: string) => ["ratings", productId] as const,
	FOODS: ["foods"] as const,
	FOOD: (id: string) => ["foods", id] as const,
	FEATURED_FOODS: ["foods", "featured"] as const,
	STORES: ["stores"] as const,
	NOTIFICATIONS: ["notifications"] as const,
	UNREAD_NOTIFICATION_COUNT: ["notifications", "unread"] as const,
	STORE: (id: string) => ["stores", id] as const,
	FOODS_BY_CATEGORY: (cat: string) => ["foods", "category", cat] as const,
	FOOD_SEARCH: (q: string) => ["foods", "search", q] as const,
	CART: ["cart"] as const,
	ORDERS: ["orders"] as const,
	ORDER: (id: string) => ["orders", id] as const,
	WISHLIST: ["wishlist"] as const,
	STAMP_COUNT: ["stamps"] as const,
	REWARDS: ["rewards"] as const,
} as const;
