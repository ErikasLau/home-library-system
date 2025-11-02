// User Context Store for managing authenticated user state

import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/api';
import { tokenManager } from '../services/api-client';
import { authService } from '../services/auth.service';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'auth_user';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sync user with localStorage
  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  const clearUser = () => {
    setUserState(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    tokenManager.remove();
  };

  // Verify session on mount
  useEffect(() => {
    const verifySession = async () => {
      // If there's a token, verify it with /auth/me
      if (tokenManager.isAuthenticated()) {
        try {
          const userData = await authService.verifySession();
          setUser(userData);
        } catch {
          // Token is invalid or expired, clear everything
          clearUser();
        }
      } else {
        // No token, clear user if exists
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          setUserState(null);
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }
      setIsLoading(false);
    };

    verifySession();
  }, []);  // Only run on mount

  const isAuthenticated = !!user && tokenManager.isAuthenticated();

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, isAuthenticated, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

// Export context for use in hook
export { UserContext };
