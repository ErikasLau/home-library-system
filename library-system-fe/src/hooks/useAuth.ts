import { useState, useCallback } from 'react';
import { authService } from '../services';
import { useUser } from '../store';
import type { LoginRequest, RegistrationRequest, ApiError } from '../types/api';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { user, setUser, clearUser, isAuthenticated } = useUser();

  const login = useCallback(async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.login(data);
      setUser(result.user);
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const register = useCallback(async (data: RegistrationRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.register(data);
      
      const result = await authService.login({
        email: data.email,
        password: data.password,
      });
      
      setUser(result.user);
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError); // Store the full error object
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
