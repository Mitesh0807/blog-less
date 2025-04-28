"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Post, PaginatedResponse } from "@/lib/types";

export type PostFilters = {
  page?: number;
  limit?: number;
  sort?: string;
  author?: string;
  tag?: string;
  featured?: boolean;
  search?: string;
};

export const postKeys = {
  all: ["posts"],
  lists: () => [...postKeys.all, "list"],
  list: (filters: PostFilters) => [...postKeys.lists(), filters],
  details: () => [...postKeys.all, "detail"],
  detail: (slug: string) => [...postKeys.details(), slug],
  featured: () => [...postKeys.all, "featured"],
  recommended: () => [...postKeys.all, "recommended"],
};

export const fetchRecentPosts = async (params: PostFilters = {}) => {
  const response = await api.get<PaginatedResponse<Post>>("/posts", {
    params,
  });
  return response.data;
};

export function usePosts(params: PostFilters = {}) {
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: fetchFeaturedPosts,
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: postKeys.detail(slug),
    queryFn: async () => {
      const response = await api.get<{
        success: boolean;
        data: Post;
        relatedPosts: Post[];
        comments: Comment[];
      }>(`/posts/${slug}`);
      return response.data;
    },
    enabled: Boolean(slug),
  });
}

export interface FetaturedPosts {
  success: boolean;
  count: number;
  data: Post[];
}

export const fetchFeaturedPosts = async () => {
  const response = await api.get<FetaturedPosts>("/posts/featured");
  return response.data;
};

export function useFeaturedPosts() {
  return useQuery({
    queryKey: ["posts", "featured"],
    queryFn: fetchFeaturedPosts,
  });
}

export function useRecommendedPosts() {
  return useQuery({
    queryKey: postKeys.recommended(),
    queryFn: async () => {
      const response = await api.get<{
        success: boolean;
        count: number;
        data: Post[];
      }>("/posts/recommended");
      return response.data;
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await api.put(`/posts/${postId}/like`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: Partial<Post>) => {
      const response = await api.post("/posts", postData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Post> }) => {
      const response = await api.put(`/posts/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await api.delete(`/posts/${postId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}
