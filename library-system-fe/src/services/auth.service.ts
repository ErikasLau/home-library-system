import { apiClient, tokenManager } from './api-client';
import type {
  Response,
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
} from '../types/api';

interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const authService = {
  register: async (data: RegistrationRequest): Promise<User> => {
    const response = await apiClient.post<Response<User>>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResult> => {
    const response = await apiClient.post<Response<LoginResponse>>('/auth/login', data);
    const { accessToken, refreshToken, user } = response.data;
    
    tokenManager.setTokens(accessToken, refreshToken);
    
    return {
      accessToken,
      refreshToken,
      user,
    };
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<Response<RefreshTokenResponse>>(
      '/auth/refresh',
      { refreshToken } as RefreshTokenRequest
    );
    const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data;
    
    tokenManager.setTokens(accessToken, newRefreshToken);
    
    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn,
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

  getRefreshToken: (): string | null => {
    return tokenManager.getRefreshToken();
  },

  verifySession: async (): Promise<User> => {
    const response = await apiClient.get<Response<User>>('/auth/me');
    return response.data;
  },
};
