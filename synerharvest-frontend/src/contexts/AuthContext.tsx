// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService, { AuthResponse } from '../services/authService';

interface AuthContextType {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Check if token is expired
          const decodedToken: any = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp && decodedToken.exp < currentTime) {
            // Token is expired
            localStorage.removeItem('token');
            setUser(null);
          } else {
            // Token is valid, get current user info
            const userData = await authService.getCurrentUser();
            setUser({
              token,
              ...userData
            });
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login({ username, password });
      localStorage.setItem('token', response.token);
      setUser(response);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      await authService.register(userData);
      // Automatically login after registration
      await login(userData.username, userData.password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};