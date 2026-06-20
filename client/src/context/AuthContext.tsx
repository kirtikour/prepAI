'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  clearError: () => void;
  checkUserStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { API_BASE_URL } from '@/config';

export const API_URL = `${API_BASE_URL}/api/auth`;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Check if user is logged in (me endpoint)
  const checkUserStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // IMPORTANT: include cookies
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Failed checking auth state', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        setLoading(false);
        return true;
      } else {
        setError(data.message || 'Invalid credentials');
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection to server failed. Please check backend server.');
      setLoading(false);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        setLoading(false);
        return true;
      } else {
        setError(data.message || 'Failed to sign up');
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Connection to server failed. Please check backend server.');
      setLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
    if (typeof window !== 'undefined' && !window.confirm('Are you sure you want to log out?')) {
      return false;
    }
    setLoading(true);
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      return true;
    } catch (err) {
      console.error('Logout error:', err);
      return true;
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        logout,
        clearError,
        checkUserStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
