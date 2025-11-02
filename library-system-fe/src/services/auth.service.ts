// Authentication Service

import { apiClient, tokenManager } from './api-client';
import type {
  Response,
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  User,
} from '../types/api';

interface LoginResult {
  token: string;
  user: User;
}

export const authService = {
  /**
   * Register a new user
   * POST /auth/register
   * Returns the created user
   */
  register: async (data: RegistrationRequest): Promise<User> => {
    const response = await apiClient.post<Response<User>>('/auth/register', data);
    return response.data;
  },

  /**
   * Login user and store JWT token
   * POST /auth/login
   * Returns token and user info from the response
   */
  login: async (data: LoginRequest): Promise<LoginResult> => {
    const response = await apiClient.post<Response<LoginResponse>>('/auth/login', data);
    const { token, user } = response.data;
    
    // Store token in localStorage
    tokenManager.set(token);
    
    // Return both token and user info from the login response
    return {
      token,
      user,
    };
  },

  /**
   * Logout user by removing JWT token
   */
  logout: (): void => {
    tokenManager.remove();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return tokenManager.isAuthenticated();
  },

  /**
   * Get current token
   */
  getToken: (): string | null => {
    return tokenManager.get();
  },
};
