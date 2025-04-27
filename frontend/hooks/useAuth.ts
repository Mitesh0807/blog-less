import { useState, useEffect } from "react";
import { authApi } from "../app/api";

interface User {
  id: string;
  username: string;
  email: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Auth check failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.login(credentials);
      setUser(response.user);
      return response.user;
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.register(userData);
      setUser(response.user);
      return response.user;
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await authApi.logout();
      setUser(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Logout failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};

export default useAuth;
