import axiosClient from "./axiosClient";

export interface User {
  id: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  displayName: string;
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

    if (response.data.data.token) {
      localStorage.setItem("auth_token", response.data.data.token);
    }

    return response.data.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await axiosClient.post("/auth/logout");

    localStorage.removeItem("auth_token");

    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosClient.get("/auth/me");
    return response.data.data;
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
