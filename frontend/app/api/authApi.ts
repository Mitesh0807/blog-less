import axiosClient from "./axiosClient";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PasswordResetRequestData {
  email: string;
}

export interface PasswordResetData {
  token: string;
  password: string;
}

export const authApi = {
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await axiosClient.post("/auth/register", userData);
    return response.data.data;
  },

  login: async (credentials: LoginData): Promise<AuthResponse> => {
    const response = await axiosClient.post("/auth/login", credentials);
    return response.data.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await axiosClient.post("/auth/logout");
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await axiosClient.get("/auth/me");
      return {
        id: response.data._id,
        name: response.data.name || "",
        username: response.data.username || "",
        email: response.data.email,
        role: response.data.role || "user",
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt,
      };
    } catch (error: unknown) {
      console.error("Error fetching current user:", error);
      throw new Error("Failed to fetch user");
    }
  },

  requestPasswordReset: async (
    data: PasswordResetRequestData,
  ): Promise<{ message: string }> => {
    const response = await axiosClient.post("/auth/forgot-password", data);
    return response.data;
  },

  resetPassword: async (
    data: PasswordResetData,
  ): Promise<{ message: string }> => {
    const response = await axiosClient.post("/auth/reset-password", data);
    return response.data;
  },

  changePassword: async (
    oldPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> => {
    const response = await axiosClient.post("/auth/change-password", {
      oldPassword,
      newPassword,
    });
    return response.data;
  },
};

export default authApi;
