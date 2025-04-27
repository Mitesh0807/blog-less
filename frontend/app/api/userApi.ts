import axiosClient from './axiosClient';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    github?: string;
  };
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface ProfileUpdateData {
  name?: string;
  username?: string;
  bio?: string;
  avatar?: string;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const userApi = {
  getCurrentProfile: async (): Promise<User> => {
    const response = await axiosClient.get('/profile');
    return response.data.data;
  },

  getProfileByUsername: async (username: string): Promise<User> => {
    const response = await axiosClient.get(`/profile/username/${username}`);
    return response.data.data;
  },

  getProfileById: async (id: string): Promise<User> => {
    const response = await axiosClient.get(`/profile/${id}`);
    return response.data.data;
  },

  updateProfile: async (profileData: ProfileUpdateData): Promise<User> => {
    const response = await axiosClient.put('/profile', profileData);
    return response.data.data;
  },

  updatePassword: async (passwordData: PasswordUpdateData): Promise<{ message: string }> => {
    const response = await axiosClient.put('/profile/password', passwordData);
    return response.data;
  },

  deleteAccount: async (): Promise<void> => {
    await axiosClient.delete('/profile');
  }
};

export default userApi;