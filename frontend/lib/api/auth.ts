"use client";

import axiosClient from "@/app/api/axiosClient";
import axios from "axios";
import {
  User,
  LoginCredentials,
  AuthResponse,
  ProfileUpdateData,
} from "../types/user";

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface ResetPasswordCredentials {
  password: string;
  token: string;
}

export const authApi = {
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await axiosClient.get("/auth/me");
      if (response.data) {
        return {
          id: response.data._id,
          name: response.data.name || "",
          username: response.data.username || "",
          email: response.data.email,
          role: response.data.role || "user",
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };
      }
      return null;
    } catch (error: unknown) {
      console.error("Error fetching current user:", error);
      return null;
    }
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axiosClient.post("/auth/login", credentials);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Login failed");
      }
      throw error;
    }
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const response = await axiosClient.post("/auth/register", credentials);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Registration failed");
      }
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    await axiosClient.post("/auth/logout");
  },

  forgotPassword: async (email: string): Promise<void> => {
    await axiosClient.post("/auth/forgot-password", { email });
  },

  resetPassword: async (
    credentials: ResetPasswordCredentials,
  ): Promise<void> => {
    await axiosClient.post("/auth/reset-password", credentials);
  },

  updateProfile: async (data: ProfileUpdateData): Promise<User> => {
    const response = await axiosClient.put("/auth/profile", data);
    return response.data.user;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await axiosClient.put("/auth/change-password", data);
  },

  verifyEmail: async (token: string): Promise<void> => {
    await axiosClient.get(`/auth/verify-email/${token}`);
  },
};
