import axiosClient from './axiosClient';

export interface PostCreateData {
  title: string;
  content: string;
}

export interface PostUpdateData {
  title?: string;
  content?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export const postApi = {
  getAllPosts: async (): Promise<Post[]> => {
    const response = await axiosClient.get('/api/posts');
    return response.data;
  },

  getPostById: async (id: string): Promise<Post> => {
    const response = await axiosClient.get(`/api/posts/${id}`);
    return response.data;
  },

  getPostsByUser: async (userId: string): Promise<Post[]> => {
    const response = await axiosClient.get(`/api/posts/user/${userId}`);
    return response.data;
  },

  createPost: async (postData: PostCreateData): Promise<Post> => {
    const response = await axiosClient.post('/api/posts', postData);
    return response.data;
  },

  updatePost: async (id: string, postData: PostUpdateData): Promise<Post> => {
    const response = await axiosClient.put(`/api/posts/${id}`, postData);
    return response.data;
  },

  deletePost: async (id: string): Promise<void> => {
    await axiosClient.delete(`/api/posts/${id}`);
  }
};