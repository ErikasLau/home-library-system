import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '../types/api';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const TOKEN_KEY = 'auth_token';

class TokenStorage {
  private inMemoryToken: string | null = null;
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
      return localStorage.getItem(TOKEN_KEY);
    }
    return this.inMemoryToken;
  }

  set(token: string): void {
    if (this.hasLocalStorage) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    this.inMemoryToken = token;
  }

  remove(): void {
    if (this.hasLocalStorage) {
      localStorage.removeItem(TOKEN_KEY);
    }
    this.inMemoryToken = null;
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

const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/register'];

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

let isVerifyingSession = false;

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    const apiError: ApiError = {
      message: 'An error occurred',
      status: error.response?.status || 500,
    };

    if (error.response?.status === 401) {
      const isAuthEndpoint = isPublicEndpoint(error.config?.url);
      const isAuthMeEndpoint = error.config?.url?.includes('/auth/me');
      
      if (!isAuthEndpoint) {
        if (isAuthMeEndpoint) {
          tokenManager.remove();
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          apiError.message = 'Session expired. Please login again.';
          return Promise.reject(apiError);
        }
        
        if (!isVerifyingSession) {
          try {
            isVerifyingSession = true;
            await axiosInstance.get('/auth/me');
            isVerifyingSession = false;
            
            if (error.config) {
              return axiosInstance.request(error.config);
            }
          } catch {
            isVerifyingSession = false;
            tokenManager.remove();
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
            apiError.message = 'Session expired. Please login again.';
            return Promise.reject(apiError);
          }
        } else {
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