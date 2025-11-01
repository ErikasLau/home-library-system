// Custom hook for authentication with user store integration

import { useState, useCallback } from 'react';
import { authService } from '../services';
import { useUser } from '../store';
import type { LoginRequest, RegistrationRequest, ApiError } from '../types/api';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser, clearUser, isAuthenticated } = useUser();

  const login = useCallback(async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.login(data);
      // Store user in context
      // Note: If your backend returns user info with login, update this
      // For now, you might need to make a separate API call to get user details
      setUser(result.user);
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const register = useCallback(async (data: RegistrationRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Register returns the user
      const newUser = await authService.register(data);
      
      // After registration, automatically log in
      await authService.login({
        email: data.email,
        password: data.password,
      });
      
      // Store the registered user
      setUser(newUser);
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const logout = useCallback(() => {
    authService.logout();
    clearUser();
  }, [clearUser]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  };
}
