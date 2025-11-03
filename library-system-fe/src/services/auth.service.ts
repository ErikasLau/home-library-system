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
  register: async (data: RegistrationRequest): Promise<User> => {
    const response = await apiClient.post<Response<User>>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResult> => {
    const response = await apiClient.post<Response<LoginResponse>>('/auth/login', data);
    const { token, user } = response.data;
    
    tokenManager.set(token);
    
    return {
      token,
      user,
    };
  },

  logout: (): void => {
    tokenManager.remove();
  },

  isAuthenticated: (): boolean => {
    return tokenManager.isAuthenticated();
  },

  getToken: (): string | null => {
    return tokenManager.get();
  },

  verifySession: async (): Promise<User> => {
    const response = await apiClient.get<Response<User>>('/auth/me');
    return response.data;
  },
};
