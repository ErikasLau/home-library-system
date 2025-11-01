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
    const response = await apiClient.publicPost<Response<User>>('/auth/register', data);
    return response.data;
  },

  /**
   * Login user and store JWT token
   * POST /auth/login
   * Returns token and user info (if available from token or subsequent call)
   */
  login: async (data: LoginRequest): Promise<LoginResult> => {
    const response = await apiClient.publicPost<Response<LoginResponse>>('/auth/login', data);
    const token = response.data.token;
    
    // Store token in localStorage
    tokenManager.set(token);
    
    // TODO: You may want to add a /auth/me endpoint to fetch user details after login
    // For now, we'll decode the JWT or make another call if needed
    // Returning a partial user object that should be updated with actual data
    return {
      token,
      user: {} as User, // This should be populated from backend
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
