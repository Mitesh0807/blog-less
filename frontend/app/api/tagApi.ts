import axiosClient from './axiosClient';

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TagCreateData {
  name: string;
  description?: string;
}

export interface TagUpdateData {
  name?: string;
  description?: string;
}

export const tagApi = {
  getTags: async (): Promise<Tag[]> => {
    const response = await axiosClient.get('/tags');
    return response.data.data;
  },

  getTagBySlug: async (slug: string): Promise<Tag> => {
    const response = await axiosClient.get(`/tags/${slug}`);
    return response.data.data;
  },

  getPopularTags: async (limit: number = 10): Promise<Tag[]> => {
    const response = await axiosClient.get(`/tags/popular?limit=${limit}`);
    return response.data.data;
  },

  createTag: async (tagData: TagCreateData): Promise<Tag> => {
    const response = await axiosClient.post('/tags', tagData);
    return response.data.data;
  },

  updateTag: async (id: string, tagData: TagUpdateData): Promise<Tag> => {
    const response = await axiosClient.put(`/tags/${id}`, tagData);
    return response.data.data;
  },

  deleteTag: async (id: string): Promise<void> => {
    await axiosClient.delete(`/tags/${id}`);
  }
};

export default tagApi;