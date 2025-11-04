import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '../types/api';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

class TokenStorage {
  private inMemoryAccessToken: string | null = null;
  private inMemoryRefreshToken: string | null = null;
  private hasLocalStorage: boolean;

  constructor() {
    this.hasLocalStorage = this.checkLocalStorage();
  }

  private checkLocalStorage(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  get(): string | null {
    if (this.hasLocalStorage) {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return this.inMemoryAccessToken;
  }

  set(token: string): void {
    if (this.hasLocalStorage) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
    this.inMemoryAccessToken = token;
  }

  getRefreshToken(): string | null {
    if (this.hasLocalStorage) {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return this.inMemoryRefreshToken;
  }

  setRefreshToken(token: string): void {
    if (this.hasLocalStorage) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
    this.inMemoryRefreshToken = token;
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.set(accessToken);
    this.setRefreshToken(refreshToken);
  }

  remove(): void {
    if (this.hasLocalStorage) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
    this.inMemoryAccessToken = null;
    this.inMemoryRefreshToken = null;
  }

  isAuthenticated(): boolean {
    return !!this.get();
  }
}

export const tokenManager = new TokenStorage();

interface ErrorResponse {
  status?: string;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  data?: {
    title?: string;
    details?: string;
    errors?: Array<{ field: string; message: string }>;
  };
  errors?: Array<{ field: string; message: string }>;
  details?: string;
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  withCredentials: true, // Enable if backend uses cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh'];

const isPublicEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.get();
    
    if (token && !isPublicEndpoint(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: ApiError | null = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const apiError: ApiError = {
      message: 'An error occurred',
      status: error.response?.status || 500,
    };

    if (error.response?.status === 401) {
      const isAuthEndpoint = isPublicEndpoint(originalRequest?.url);
      const isRefreshEndpoint = originalRequest?.url?.includes('/auth/refresh');
      
      if (!isAuthEndpoint && !originalRequest._retry) {
        if (isRefreshEndpoint) {
          isRefreshing = false;
          processQueue(apiError);
          tokenManager.remove();
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          apiError.message = 'Session expired. Please login again.';
          return Promise.reject(apiError);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${tokenManager.get()}`;
              }
              return axiosInstance(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = tokenManager.getRefreshToken();
        if (!refreshToken) {
          isRefreshing = false;
          tokenManager.remove();
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          apiError.message = 'Session expired. Please login again.';
          return Promise.reject(apiError);
        }

        try {
          const response = await axiosInstance.post<{
            success: boolean;
            data: {
              accessToken: string;
              refreshToken: string;
              expiresIn: string;
            };
          }>('/auth/refresh', { refreshToken });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          tokenManager.setTokens(accessToken, newRefreshToken);
          
          isRefreshing = false;
          processQueue(null);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return axiosInstance(originalRequest);
        } catch {
          isRefreshing = false;
          processQueue(apiError);
          tokenManager.remove();
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          apiError.message = 'Session expired. Please login again.';
          return Promise.reject(apiError);
        }
      }
    }

    if (error.response?.data) {
      const errorData = error.response.data;
      
      if (errorData.data) {
        if (errorData.data.title) {
          apiError.title = errorData.data.title;
          apiError.message = errorData.data.title;
        }
        if (errorData.data.details) {
          apiError.details = errorData.data.details;
          if (!apiError.title) {
            apiError.message = errorData.data.details;
          }
        }
        if (errorData.data.errors) {
          apiError.errors = errorData.data.errors;
        }
      }
      
      if (errorData.error) {
        apiError.error = errorData.error;
        if (!apiError.message || apiError.message === 'An error occurred') {
          apiError.message = errorData.error.message;
        }
      }
      
      if (errorData.message && (!apiError.message || apiError.message === 'An error occurred')) {
        apiError.message = errorData.message;
      }
      
      if (errorData.errors && !apiError.errors) {
        apiError.errors = errorData.errors;
      }
      
      if (errorData.details && !apiError.details) {
        apiError.details = errorData.details;
      }
    } else if (error.message) {
      if (error.message === 'Network Error') {
        apiError.message = 'Unable to connect to server. Please check your internet connection.';
      } else if (error.code === 'ECONNABORTED') {
        apiError.message = 'Request timeout. Please try again.';
      } else {
        apiError.message = error.message;
      }
    }

    return Promise.reject(apiError);
  }
);

export const apiClient = {
  get: async <T>(
    endpoint: string, 
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> => {
    const response = await axiosInstance.get<T>(endpoint, { params });
    return response.data;
  },

  post: async <T>(
    endpoint: string, 
    data?: unknown, 
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> => {
    const response = await axiosInstance.post<T>(endpoint, data, { params });
    return response.data;
  },

  put: async <T>(
    endpoint: string, 
    data?: unknown, 
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> => {
    const response = await axiosInstance.put<T>(endpoint, data, { params });
    return response.data;
  },

  patch: async <T>(
    endpoint: string, 
    data?: unknown, 
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> => {
    const response = await axiosInstance.patch<T>(endpoint, data, { params });
    return response.data;
  },

  delete: async <T>(
    endpoint: string, 
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> => {
    const response = await axiosInstance.delete<T>(endpoint, { params });
    return response.data;
  },
};

export { axiosInstance };