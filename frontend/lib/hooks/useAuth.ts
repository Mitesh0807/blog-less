"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import axiosClient from "@/app/api/axiosClient";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  bio?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

interface ProfileUpdateData {
  name?: string;
  username?: string;
  bio?: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user: User;
}

function handleAxiosError(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError(error) && error.response) {
    toast.error(error.response.data.message || fallbackMessage);
  } else {
    toast.error(fallbackMessage);
  }
}

const authApi = {
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await axiosClient.get("/auth/me");
      if (response.data?.data) {
        return {
          id: response.data.data._id,
          name: response.data.data.name || "",
          username: response.data.data.username || "",
          email: response.data.data.email,
          role: response.data.data.role || "user",
          bio: response.data.data.bio,
          profilePicture: response.data.data.profilePicture,
          createdAt: response.data.data.createdAt,
          updatedAt: response.data.data.updatedAt,
        };
      }
      return null;
    } catch (error: unknown) {
      console.error("Error fetching current user:", error);
      return null;
    }
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosClient.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await axiosClient.post("/auth/register", userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosClient.get("/auth/logout");
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<void> => {
    await axiosClient.post("/auth/forgot-password", data);
  },

  resetPassword: async (data: ResetPasswordData): Promise<void> => {
    await axiosClient.post("/auth/reset-password", data);
  },

  updateProfile: async (data: ProfileUpdateData): Promise<User> => {
    const response = await axiosClient.post("/profile", data);
    return response.data.data;
  },

  verifyEmail: async (token: string): Promise<void> => {
    await axiosClient.post("/auth/verify-email", { token });
  },
};

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.getCurrentUser,
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data: AuthResponse) => {
      queryClient.setQueryData(["currentUser"], data.user);
      router.push("/dashboard");
      toast.success("Logged in successfully");
    },
    onError: (error: unknown) => {
      console.error("Login error:", error);
      handleAxiosError(error, "Login failed");
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data: AuthResponse) => {
      queryClient.setQueryData(["currentUser"], data.user);
      router.push("/dashboard");
      toast.success("Account created successfully");
    },
    onError: (error: unknown) => {
      console.error("Registration error:", error);
      handleAxiosError(error, "Registration failed");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
      router.push("/auth/login");
      toast.success("Logged out successfully");
    },
    onError: (error: unknown) => {
      console.error("Logout error:", error);
      handleAxiosError(error, "Logout failed");
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success("Password reset instructions sent to your email");
    },
    onError: (error: unknown) => {
      handleAxiosError(error, "Failed to request password reset");
    },
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success("Password reset successfully");
      router.push("/auth/login");
    },
    onError: (error: unknown) => {
      handleAxiosError(error, "Failed to reset password");
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(["currentUser"], updatedUser);
      toast.success("Profile updated successfully");
    },
    onError: (error: unknown) => {
      handleAxiosError(error, "Failed to update profile");
    },
  });
}

export function useVerifyEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Email verified successfully");
    },
    onError: (error: unknown) => {
      handleAxiosError(error, "Failed to verify email");
    },
  });
}
