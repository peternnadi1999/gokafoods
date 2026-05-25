// ============================================================
// AUTH TYPES
// ============================================================
export interface User {
	[x: string]: any;
	id: string;
	userName: string;
	userEmail: string;
	userPhone: string;
	userPhoto?: string;
	userBalance: number;
	createdAt: string;
	updatedAt: string;
	userStamp: number;
}

export interface AuthResponse {
	token: string;
	user: User;
}

export interface LoginPayload {
	userEmail: string;
	userPassword: string;
}

export interface SignupPayload {
	userName: string;
	userEmail: string;
	userPhone: string;
	userPassword: string;
	promoCode?: string;
}
export interface ResetPasswordPayload {
	email: string;
	otp: string;
	userPassword: string;
	confirmNewPassword: string;
}
export interface ForgotPasswordPayload {
	userEmail: string;
	platform: string;
}

// ============================================================
// FOOD / PRODUCT TYPES
// ============================================================
export type FoodCategory =
	| "all"
	| "fries"
	| "swallows"
	| "rice"
	| "drinks"
	| "soup";

export interface Restaurant {
	id: string;
	name: string;
	logo?: string;
	distanceKm: number;
	estimatedMins: number;
}

export interface FoodItem {
	_id: string;
	productName: string;
	productDesc: string;
	productPrice: number;
	productImage: string;
	productCategory: FoodCategory;
	rating: number | null;
	partnerId: { id: string; brandName: string };
	productIngredients: string[];
	coordinates: { lat: number; lng: number };
	brandName: string;
	price: number;
	productId: string;
	ratingData: {
		eachStorage: { rating: number; comment: string };
	};

	reviewCount: number;
	restaurant: Restaurant;
	pairingSuggestions?: FoodItem[];
	isFeatured?: boolean;
	isAvailable: boolean;
}

export interface FoodListResponse {
	items: FoodItem[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}

// ============================================================
// RATING TYPES
// ============================================================
export interface Rating {
	ratingsWithUserPhoto: {
		rating: number;
		comment: string;
		userName: string;
		userPhoto?: string;
	}[];
}

// ============================================================
// CART TYPES
// ============================================================
export interface CartItem {
	id: string;
	foodItem: FoodItem;
	quantity: number;
	restaurantId: string;
	restaurantName: string;
}

export interface Cart {
	items: CartItem[];
	totalAmount: number;
	itemCount: number;
}

// ============================================================
// ORDER TYPES
// ============================================================
export type OrderStatus =
	| "pending"
	| "confirmed"
	| "preparing"
	| "on_the_way"
	| "delivered"
	| "cancelled";

export interface Order {
	groupId: string;
	orderGroupId: string;
	status: string;
	groupType: string;
	shippingFee: number;
	createdAt: string;
	isLocked: boolean;
	orders: Order[];
}

export interface CartItemresponse {
	_id: string;
	quantity: number;
	partnerLocationTitle?: {};
	partnerCoordinates?: {};
	addressDetails?: {};
}

export interface OrderConfirmation {
	cartItems: CartItemresponse[];
	uniqueKey: string;
	lat: number;
	lng: number;
}

export interface InitiateOrderPayload {
	cartItems: CartItemresponse[];
	uniqueKey: string | null;
	amount: number;
	paidWith: "card" | "balance";
	reference?: string;
	useBalance: boolean;
	promoKey?: string;
	location: {
		address: string;
		lat: number;
		lng: number;
	};
}

// ============================================================
// API RESPONSE WRAPPER
// ============================================================
export interface ApiResponse<T> {
	data: T;
	message: string;
	success: boolean;
}

export interface ApiError {
	message: string;
	statusCode: number;
	errors?: Record<string, string[]>;
}

// ============================================================
// WISHLIST
// ============================================================
export interface WishlistItem {
	id: string;
	foodItem: FoodItem;
	addedAt: string;
}

// ============================================================
// WISHLIST
// ============================================================
export interface Store {
	_id: string;
	brandName: string;
	location: string;
	verification: {
		isVerified: boolean;
		verifiedAt: string;
	};
	logo?: string;
	coordinates: { lat: number; lng: number };
}

// ============================================================
// REVIEW
// ============================================================
export interface Review {
	id: string;
	userId: string;
	userName: string;
	rating: number;
	comment: string;
	createdAt: string;
}
