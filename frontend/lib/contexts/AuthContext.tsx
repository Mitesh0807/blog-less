'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useCurrentUser, useLogin, useLogout, useRegister } from '../hooks/useAuth';
import { User, LoginCredentials, RegisterData } from '../types/user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => void;
  logout: () => void;
  register: (data: RegisterData) => void;
  loginIsLoading: boolean;
  registerIsLoading: boolean;
  logoutIsLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, isLoading, isError, error } = useCurrentUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const registerMutation = useRegister();

  // Only consider authenticated if we have a valid user object
  const isAuthenticated = !!user &&
    typeof user === 'object' &&
    'id' in user &&
    'email' in user;

  // Log any auth errors to make debugging easier
  if (isError && error) {
    console.error('Auth context error:', error);
  }

  const value = {
    user: user || null,
    isLoading,
    isError,
    isAuthenticated,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    register: registerMutation.mutate,
    loginIsLoading: loginMutation.isPending,
    registerIsLoading: registerMutation.isPending,
    logoutIsLoading: logoutMutation.isPending,
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