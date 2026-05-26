import { apiClient } from './client';
import {
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  FOOD_ENDPOINTS,
  CART_ENDPOINTS,
  ORDER_ENDPOINTS,
  WISHLIST_ENDPOINTS,
  STORE_ENDPOINTS,
  RATING_ENDPOINTS,
  STAMP_ENDPOINTS,
  NOTIFICATION_ENDPOINTS,
  REWARD_ENDPOINTS,
  CATEGORY_ENDPOINTS,
} from './endpoints';
import type {
  ApiResponse,
  AuthResponse,
  LoginPayload,
  SignupPayload,
  User,
  FoodItem,
  FoodListResponse,
  Cart,
  Order,
  WishlistItem,
  FoodCategory,
  Store,
  Rating,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  OrderConfirmation,
  InitiateOrderPayload,
} from '@/types';

// ============================================================
// AUTH SERVICES
// ============================================================
export const authService = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, payload),

  signup: (payload: SignupPayload) =>
    apiClient.post<AuthResponse>(AUTH_ENDPOINTS.SIGNUP, payload),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    apiClient.post<ApiResponse<null>>(AUTH_ENDPOINTS.FORGOT_PASSWORD, payload),

  resetPassword: (payload: ResetPasswordPayload) =>
    apiClient.post<ApiResponse<null>>(AUTH_ENDPOINTS.RESET_PASSWORD, payload),


  
  logout: () =>
    apiClient.post<ApiResponse<null>>(AUTH_ENDPOINTS.LOGOUT),

  googleAuth: (token: string) =>
    apiClient.post<ApiResponse<AuthResponse>>(AUTH_ENDPOINTS.GOOGLE, { token }),

  facebookAuth: (token: string) =>
    apiClient.post<ApiResponse<AuthResponse>>(AUTH_ENDPOINTS.FACEBOOK, { token }),

};

// ============================================================
// USER SERVICES
// ============================================================
export const userService = {
  getProfile: () =>
    apiClient.get<User>(USER_ENDPOINTS.PROFILE),

  updateProfile: (data: Partial<User>) =>
    apiClient.post<ApiResponse<User>>(USER_ENDPOINTS.UPDATE_PROFILE, data),

  uploadAvatar: (userPhoto: File) => {
    const formData = new FormData();
    formData.append('userPhoto', userPhoto);
    return apiClient.post<ApiResponse<{ url: string }>>(USER_ENDPOINTS.UPLOAD_AVATAR, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  fundWallet: (amount: number, reference: string) =>
    apiClient.post<ApiResponse<{ balance: number }>>(USER_ENDPOINTS.FUND_WALLET, {
      amount,
      reference
    }),

  deleteAccount: () =>
    apiClient.delete<ApiResponse<null>>(USER_ENDPOINTS.DELETE_ACCOUNT),
};

// ============================================================
// RATING SERVICES
// ============================================================

export const ratingService = {
  getRatings: (productId: string) =>
    apiClient.get<Rating[]>(RATING_ENDPOINTS.GET_RATINGS(productId)),

  rateProduct: (productId: string, rating: number, comment?: string) =>
    apiClient.post<ApiResponse<any>>(RATING_ENDPOINTS.RATE_PRODUCT(productId), {
      rating,
      comment,
    }),
};

// ============================================================
// FOOD SERVICES
// ============================================================
export const foodService = {
  getAll: (params?: { page?: number; pageSize?: number; category?: FoodCategory }) =>
    apiClient.get<FoodListResponse[]>(FOOD_ENDPOINTS.LIST, { params }),

  getById: (id: string) =>
    apiClient.get<FoodItem>(FOOD_ENDPOINTS.DETAIL(id)),

  // getFeatured: () =>
  //   apiClient.get<ApiResponse<FoodItem[]>>(FOOD_ENDPOINTS.FEATURED),

  search: (query: string, category?: FoodCategory) =>
    apiClient.get<ApiResponse<FoodListResponse>>(FOOD_ENDPOINTS.SEARCH, {
      params: { q: query, category },
    }),

  getPairingSuggestions: (id: string) =>
    apiClient.get<ApiResponse<FoodItem[]>>(FOOD_ENDPOINTS.PAIRING_SUGGESTIONS(id)),
};

// ============================================================
// CART SERVICES
// ============================================================
export const cartService = {
  getCart: (lat?: number, lng?: number) =>
    apiClient.get<ApiResponse<Cart>>(CART_ENDPOINTS.GET, {
      params: { lat, lng },
    }),

  addItem: (productId: string, quantity: number) =>
    apiClient.post<ApiResponse<Cart>>(CART_ENDPOINTS.ADD_ITEM(productId), { quantity }),

  removeItem: (productId: string) =>
    apiClient.delete<ApiResponse<Cart>>(CART_ENDPOINTS.REMOVE_ITEM(productId)),

  clearCart: () =>
    apiClient.delete<ApiResponse<Cart>>(CART_ENDPOINTS.CLEAR),
};

// ============================================================
// ORDER SERVICES
// ============================================================
export const orderService = {
  getOrders: () =>
    apiClient.get<ApiResponse<Order[]>>(ORDER_ENDPOINTS.LIST),

  confirmCost: (payload: OrderConfirmation) =>
    apiClient.post<OrderConfirmation>(ORDER_ENDPOINTS.COST_CONFIRMATION, payload),

  initiateOrder: (payload: InitiateOrderPayload) =>
    apiClient.post<ApiResponse<InitiateOrderPayload>>(ORDER_ENDPOINTS.INTIATE_ORDER, payload),
};

// ============================================================
// WISHLIST SERVICES
// ============================================================
export const wishlistService = {
  getWishlist: () =>
    apiClient.get<ApiResponse<WishlistItem[]>>(WISHLIST_ENDPOINTS.LIST),

  addToWishlist: (productId: string) =>
    apiClient.post<WishlistItem>(WISHLIST_ENDPOINTS.ADD(productId), { productId }),

  removeFromWishlist: (productId: string) =>
    apiClient.delete<any>(WISHLIST_ENDPOINTS.REMOVE(productId)),
};


// ============================================================
// STORE SERVICES
// ============================================================
export const storeService = {
  getStores: () =>
    apiClient.get<Store[]>(STORE_ENDPOINTS.LIST),

  getStoreById: (storeId: string) =>
    apiClient.get<ApiResponse<FoodItem[]>>(STORE_ENDPOINTS.GET_STORE_BY_ID(storeId)),
};

// ============================================================
// STAMP SERVICES
// ============================================================
export const stampService = {
  getStampCount: () =>
    apiClient.get<ApiResponse<User>>(STAMP_ENDPOINTS.GET),
}

// ============================================================
// REWARD SERVICES
// ============================================================
export const rewardService = {
  getRewards: () =>
    apiClient.get<ApiResponse<any>>(REWARD_ENDPOINTS.GET_REWARD),
};

export const rewardRedemptionService = {
  redeemReward: (rewardId: string) =>
    apiClient.post<ApiResponse<any>>(REWARD_ENDPOINTS.CLAIM_REWARD(rewardId)),
};
// ============================================================
// NOTIFICATION SERVICES
// ============================================================
export const notificationService = {
  getNotifications: () =>
    apiClient.get<ApiResponse<any>>(NOTIFICATION_ENDPOINTS.GET),

  getUnreadCount: () =>
    apiClient.get<number>(NOTIFICATION_ENDPOINTS.GET_UNREAD_COUNT),

  markAsRead: (broadcastId: string) =>
    apiClient.put<ApiResponse<null>>(NOTIFICATION_ENDPOINTS.MARK_AS_READ(broadcastId)),
};

// ============================================================
// CATEGORY SERVICES
// ============================================================

export const category = {
  getCategory: () => apiClient.get<ApiResponse<any>>(CATEGORY_ENDPOINTS.GET_CATEGORY),
  getProductCategory: (category: string)=> apiClient.get<FoodItem[]>(CATEGORY_ENDPOINTS.GET_PRODUCT_CATEGORY(category))
}


// ============================================================
// EMAIL VERIFICATION SERVICES
// ============================================================
export const verifyEmailService = {

  /** Poll or one-shot check — is this user's email verified yet? */
  checkVerified: (email: string) =>
    apiClient.get<ApiResponse<{ isVerified: boolean }>>(
      `${AUTH_ENDPOINTS.CHECK_VERIFIED}?email=${encodeURIComponent(email)}`
    ),

  /** Resend the verification email */
  resend: (userEmail: string, platform: string) =>
    apiClient.post<ApiResponse<null>>(AUTH_ENDPOINTS.RESEND_VERIFY, { userEmail, platform }),
};