"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { User } from "@/lib/types";
import { useRouter } from "next/navigation";

export const authKeys = {
  user: ["currentUser"] as const,
};

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: async () => {
      try {
        const response = await api.get<{ success: boolean; data: User }>(
          "/auth/me",
        );
        return response.data.data;
      } catch (_) {
        return null;
      }
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (userData: {
      name: string;
      username: string;
      email: string;
      password: string;
    }) => {
      const response = await api.post("/auth/register", userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user });
      router.push("/login");
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user });
      router.push("/");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const response = await api.get("/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user });
      router.push("/");
    },
  });
}
