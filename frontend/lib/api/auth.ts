"use client";

import { AxiosError } from "axios";
import api from "../api";
import { User, LoginCredentials, ProfileUpdateData } from "../types/user";

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  username: string;
  bio?: string;
}

export interface ResetPasswordCredentials {
  password: string;
  token: string;
}

export interface ForgotPasswordCredentials {
  email: string;
}

export const authApi = {
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get("/auth/me");
    return response.data.data;
  },

  login: async (
    credentials: LoginCredentials,
  ): Promise<{ user: User; token: string }> => {
    try {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || "Login failed";
        throw new Error(message);
      }
      throw new Error("Login failed");
    }
  },

  register: async (
    credentials: RegisterCredentials,
  ): Promise<{ user: User; token: string }> => {
    try {
      const response = await api.post("/auth/register", credentials);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || "Registration failed";
        throw new Error(message);
      }
      throw new Error("Registration failed");
    }
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  forgotPassword: async (
    credentials: ForgotPasswordCredentials,
  ): Promise<void> => {
    await api.post("/auth/forgot-password", credentials);
  },

  resetPassword: async (
    credentials: ResetPasswordCredentials,
  ): Promise<void> => {
    await api.post(`/auth/reset-password`, credentials);
  },

  updateProfile: async (data: ProfileUpdateData): Promise<User> => {
    const response = await api.put("/auth/profile", data);
    return response.data.user;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await api.put("/auth/change-password", data);
  },

  verifyEmail: async (token: string): Promise<void> => {
    await api.get(`/auth/verify-email/${token}`);
  },
};
