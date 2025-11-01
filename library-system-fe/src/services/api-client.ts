import type { ApiError } from '../types/api';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const TOKEN_KEY = 'auth_token';

export const tokenManager = {
  get: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  set: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  
  remove: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

function createHeaders(includeAuth: boolean = true): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = tokenManager.get();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

// Build URL with query parameters
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
}

// Handle API response
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = {
      message: 'An error occurred',
      status: response.status,
    };

    try {
      const errorData = await response.json();
      error.success = errorData.success;
      
      // Handle new error format
      if (errorData.error) {
        error.error = errorData.error;
        error.message = errorData.error.message || error.message;
      } else if (errorData.errors) {
        // Handle validation errors array
        error.errors = errorData.errors;
        error.message = errorData.errors.map((e: { field: string; message: string }) => 
          `${e.field}: ${e.message}`
        ).join(', ');
      } else {
        error.message = errorData.message || error.message;
      }
    } catch {
      // If parsing fails, use status text
      error.message = response.statusText || error.message;
    }

    throw error;
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  try {
    return await response.json();
  } catch {
    return {} as T;
  }
}

// Generic API request function
export async function apiRequest<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { params, ...fetchConfig } = config;
  const url = buildUrl(endpoint, params);
  
  // Check if auth should be included - default to true unless headers are explicitly empty
  const includeAuth = !fetchConfig.headers || Object.keys(fetchConfig.headers).length > 0;
  
  const response = await fetch(url, {
    ...fetchConfig,
    headers: includeAuth ? {
      ...createHeaders(true),
      ...fetchConfig.headers,
    } : {
      'Content-Type': 'application/json',
      ...fetchConfig.headers,
    },
  });

  return handleResponse<T>(response);
}

// Convenience methods
export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> => {
    return apiRequest<T>(endpoint, { method: 'GET', params });
  },

  post: <T>(endpoint: string, data?: unknown, params?: Record<string, string | number | boolean | undefined>): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      params,
    });
  },

  put: <T>(endpoint: string, data?: unknown, params?: Record<string, string | number | boolean | undefined>): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      params,
    });
  },

  delete: <T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'DELETE',
      params,
    });
  },

  // For endpoints that don't require authentication
  publicGet: <T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'GET',
      params,
      headers: {} as HeadersInit,
    });
  },

  publicPost: <T>(endpoint: string, data?: unknown): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {} as HeadersInit,
    });
  },
};
