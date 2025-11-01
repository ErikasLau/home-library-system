// User Context Store for managing authenticated user state

import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/api';
import { tokenManager } from '../services/api-client';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'auth_user';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => {
    // Initialize from localStorage on mount
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

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

  // Check if token exists on mount and clear user if not
  useEffect(() => {
    if (user && !tokenManager.isAuthenticated()) {
      setUserState(null);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const isAuthenticated = !!user && tokenManager.isAuthenticated();

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
}

// Export context for use in hook
export { UserContext };
