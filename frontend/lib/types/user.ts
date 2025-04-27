export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  bio?: string;
  avatar?: string;
  role: string;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ProfileUpdateData {
  name?: string;
  username?: string;
  bio?: string;
  avatar?: string;
}
