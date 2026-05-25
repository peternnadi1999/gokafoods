import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from './endpoints';
import type { ApiError } from '@/types';

// ============================================================
// TOKEN STORAGE KEYS
// ============================================================
export const ACCESS_TOKEN_KEY = 'gkf_at';

// ============================================================
// CREATE AXIOS INSTANCE
// ============================================================
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    // 'Cache-Control': 'no-cache',
  },
  withCredentials: false,
});

// ============================================================
// REQUEST INTERCEPTOR — attach access token
// ============================================================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// RESPONSE INTERCEPTOR — handle 401 / token refresh
// ============================================================
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// ============================================================
// TOKEN HELPERS
// ============================================================
export const setTokens = (token: string) => {
  Cookies.set(ACCESS_TOKEN_KEY, token, {
    expires: 1, // 1 day
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

export const clearTokens = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
};

export const getAccessToken = () => Cookies.get(ACCESS_TOKEN_KEY);
export const isAuthenticated = () => !!Cookies.get(ACCESS_TOKEN_KEY);
