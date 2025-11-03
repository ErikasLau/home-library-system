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

  useEffect(() => {
    const verifySession = async () => {
      if (tokenManager.isAuthenticated()) {
        try {
          const userData = await authService.verifySession();
          setUser(userData);
        } catch {
          clearUser();
        }
      } else {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          setUserState(null);
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }
      setIsLoading(false);
    };

    verifySession();
  }, []);

  const isAuthenticated = !!user && tokenManager.isAuthenticated();

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, isAuthenticated, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext };
