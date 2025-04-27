import axiosClient from "./axiosClient";

export interface PostResponse {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  slug: string;
  status: "draft" | "published";
  author: {
    _id: string;
    name: string;
    username: string;
  };
  tags: string[];
  views: number;
  likes: string[];
  readingTime?: number;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface PostCreateData {
  title: string;
  content: string;
  excerpt?: string;
  status?: "draft" | "published";
  tags?: string[];
}

export interface PostUpdateData {
  title?: string;
  content?: string;
  excerpt?: string;
  status?: "draft" | "published";
  tags?: string[];
}

export interface PostSearchParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  tag?: string;
  author?: string;
  status?: "draft" | "published";
  featured?: boolean;
}

export interface PostsResponse {
  success: boolean;
  count: number;
  total: number;
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  data: PostResponse[];
}

export interface GetPostResponse {
  success: boolean;
  data: PostResponse;
}

export const postApi = {
  getPosts: async (params: PostSearchParams = {}): Promise<PostsResponse> => {
    const response = await axiosClient.get("/posts", { params });
    return response.data;
  },

  getPost: async (slug: string): Promise<GetPostResponse> => {
    const response = await axiosClient.get(`/posts/${slug}`);
    return response.data;
  },

  getFeaturedPosts: async (): Promise<PostsResponse> => {
    const response = await axiosClient.get("/posts/featured");
    return response.data;
  },

  getUserPosts: async (
    userId: string,
    params: PostSearchParams = {},
  ): Promise<PostsResponse> => {
    const response = await axiosClient.get(`/posts/user/${userId}`, { params });
    return response.data;
  },

  getMyPosts: async (params: PostSearchParams = {}): Promise<PostsResponse> => {
    const response = await axiosClient.get("/posts/me", { params });
    return response.data;
  },

  createPost: async (postData: PostCreateData): Promise<GetPostResponse> => {
    const response = await axiosClient.post("/posts", postData);
    return response.data;
  },

  updatePost: async (
    id: string,
    postData: PostUpdateData,
  ): Promise<GetPostResponse> => {
    const response = await axiosClient.put(`/posts/${id}`, postData);
    return response.data;
  },

  deletePost: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await axiosClient.delete(`/posts/${id}`);
    return response.data;
  },

  likePost: async (
    id: string,
  ): Promise<{ success: boolean; liked: boolean; likesCount: number }> => {
    const response = await axiosClient.put(`/posts/${id}/like`);
    return response.data;
  },

  getTags: async (): Promise<{ success: boolean; data: string[] }> => {
    const response = await axiosClient.get("/tags");
    return response.data;
  },
};

export default postApi;
