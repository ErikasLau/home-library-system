import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '../types/api';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const TOKEN_KEY = 'auth_token';

// In-memory fallback for environments without localStorage
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

// Define error response interface for better type safety
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

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  withCredentials: true, // Enable if backend uses cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// List of endpoints that don't require authentication
const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/register'];

// Helper to check if endpoint is public
const isPublicEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
};

// Request interceptor to add token to all requests
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.get();
    
    // Add token to request if it exists and endpoint is not public
    if (token && !isPublicEndpoint(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ErrorResponse>) => {
    const apiError: ApiError = {
      message: 'An error occurred',
      status: error.response?.status || 500,
    };

    // Handle 401 Unauthorized - clear token and redirect
    if (error.response?.status === 401) {
      tokenManager.remove();
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      apiError.message = 'Session expired. Please login again.';
      return Promise.reject(apiError);
    }

    // Parse error response
    if (error.response?.data) {
      const errorData = error.response.data;
      
      // Priority 1: Check nested data field
      if (errorData.data) {
        if (errorData.data.title) {
          apiError.message = errorData.data.title;
        }
        if (errorData.data.details) {
          apiError.details = errorData.data.details;
        }
        if (errorData.data.errors) {
          apiError.errors = errorData.data.errors;
        }
      }
      
      // Priority 2: Check error field
      if (errorData.error) {
        apiError.error = errorData.error;
        if (!apiError.message || apiError.message === 'An error occurred') {
          apiError.message = errorData.error.message;
        }
      }
      
      // Priority 3: Check direct message
      if (errorData.message && (!apiError.message || apiError.message === 'An error occurred')) {
        apiError.message = errorData.message;
      }
      
      // Priority 4: Check direct errors array
      if (errorData.errors && !apiError.errors) {
        apiError.errors = errorData.errors;
      }
      
      // Priority 5: Check direct details
      if (errorData.details && !apiError.details) {
        apiError.details = errorData.details;
      }
    } else if (error.message) {
      // Network error or other non-response error
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

// Convenience methods using axios
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

// Export axios instance for advanced use cases
export { axiosInstance };