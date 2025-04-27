"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Post, PaginatedResponse } from "@/lib/types";

export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (slug: string) => [...postKeys.details(), slug] as const,
  featured: () => [...postKeys.all, "featured"] as const,
  recommended: () => [...postKeys.all, "recommended"] as const,
};

export function usePosts(
  params: {
    page?: number;
    limit?: number;
    sort?: string;
    author?: string;
    tag?: string;
    featured?: boolean;
    search?: string;
  } = {},
) {
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Post>>("/posts", {
        params,
      });
      return response.data;
    },
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

export function useFeaturedPosts() {
  return useQuery({
    queryKey: postKeys.featured(),
    queryFn: async () => {
      const response = await api.get<{
        success: boolean;
        count: number;
        data: Post[];
      }>("/posts/featured");
      return response.data;
    },
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
    onSuccess: (_, postId) => {
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
    onSuccess: (data) => {
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
