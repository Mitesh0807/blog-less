import axiosClient from './axiosClient';

export interface Profile {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  bio?: string;
  location?: string;
  website?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    github?: string;
    linkedin?: string;
  };
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileUpdateData {
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface ProfileSearchParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}

export interface ProfilesResponse {
  profiles: Profile[];
  totalCount: number;
  page: number;
  totalPages: number;
}

export const profileApi = {
  getProfiles: async (params: ProfileSearchParams = {}): Promise<ProfilesResponse> => {
    const response = await axiosClient.get('/profiles', { params });
    return response.data.data;
  },

  getProfileById: async (id: string): Promise<Profile> => {
    const response = await axiosClient.get(`/profiles/${id}`);
    return response.data.data;
  },

  getProfileByUsername: async (username: string): Promise<Profile> => {
    const response = await axiosClient.get(`/profiles/username/${username}`);
    return response.data.data;
  },

  getMyProfile: async (): Promise<Profile> => {
    const response = await axiosClient.get('/profiles/me');
    return response.data.data;
  },

  updateProfile: async (profileData: ProfileUpdateData): Promise<Profile> => {
    const response = await axiosClient.put('/profiles', profileData);
    return response.data.data;
  },

  deleteProfile: async (): Promise<{ message: string }> => {
    const response = await axiosClient.delete('/profiles');
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await axiosClient.post('/profiles/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  },

  uploadCoverImage: async (file: File): Promise<{ coverImageUrl: string }> => {
    const formData = new FormData();
    formData.append('coverImage', file);

    const response = await axiosClient.post('/profiles/cover-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  },

  followUser: async (userId: string): Promise<{ isFollowing: boolean }> => {
    const response = await axiosClient.post(`/profiles/${userId}/follow`);
    return response.data.data;
  },

  getFollowers: async (
    userId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<ProfilesResponse> => {
    const response = await axiosClient.get(`/profiles/${userId}/followers`, { params });
    return response.data.data;
  },

  getFollowing: async (
    userId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<ProfilesResponse> => {
    const response = await axiosClient.get(`/profiles/${userId}/following`, { params });
    return response.data.data;
  }
};

export default profileApi;