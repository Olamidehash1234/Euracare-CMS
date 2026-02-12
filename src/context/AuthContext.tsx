import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService, getErrorMessage } from '../../src/services';
import { authEventEmitter } from '../utils/authEventEmitter';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('currentUser');
        
        if (token && storedUser) {
          // Restore user from localStorage
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (err) {
        // Token or user data is invalid, clear it
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Step 1: Call login endpoint to get tokens
      const response = await authService.login({ email, password });
      
      // Backend returns: { access_token, refresh_token } - NOT { token, user }
      const { access_token, refresh_token } = response.data.data;

      if (!access_token) {
        throw new Error('No access token in login response');
      }

      // Store tokens
      localStorage.setItem('authToken', access_token);
      localStorage.setItem('refreshToken', refresh_token || '');

      // Set a basic user object from login form data
      // In a real app, you'd fetch the full user profile from an endpoint
      const basicUser: User = {
        id: '',
        email,
        name: email.split('@')[0], // Use email username as display name
        role: 'user',
      };
      
      localStorage.setItem('currentUser', JSON.stringify(basicUser));
      setUser(basicUser);
      
      // Reset session timeout flags on successful login
      authEventEmitter.reset();
    } catch (err) {
      // Clear user on login failure so isAuthenticated becomes false
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
