'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  username: string;
  email: string;
  balance: number;
  isAdmin: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CREDENTIALS = [
  { username: 'user', password: '123', email: 'abdalrahman1232023@gmail.com', isAdmin: false },
  { username: 'admin', password: '123', email: 'admin@xenofield.com', isAdmin: true },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('xenofield_auth') : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setIsAuthenticated(true);
        setUser(parsed);
      } catch {
        // fall through
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated && pathname !== '/login') {
      router.replace('/login');
    }
    if (isAuthenticated && pathname === '/login') {
      router.replace('/image');
    }
  }, [isAuthenticated, pathname, router, isLoading]);

  const login = useCallback((username: string, password: string) => {
    const cred = CREDENTIALS.find(
      (c) => c.username === username && c.password === password
    );
    if (cred) {
      const userData: User = {
        username: cred.username,
        email: cred.email,
        balance: 0.00,
        isAdmin: cred.isAdmin,
      };
      setIsAuthenticated(true);
      setUser(userData);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('xenofield_auth', JSON.stringify(userData));
      }
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password' };
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('xenofield_auth');
    }
    router.replace('/login');
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
