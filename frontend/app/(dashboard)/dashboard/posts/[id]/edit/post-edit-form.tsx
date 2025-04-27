"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/app/api";
import { PostForm } from "@/components/post-form";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/types/errors";
import axios, { AxiosError } from "axios";

interface ApiErrorResponse {
  message: string;
  status?: number;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  slug: string;
  status: "published" | "draft";
  tags: string[];
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

export function PostEditForm({ id }: { id: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(`/posts/${id}`);
        return response.data.data as Post;
      } catch (error) {
        console.error("Error fetching post:", error);
        const errorMessage = getErrorMessage(error);

        if (axios.isAxiosError(error)) {
          const apiError = error as AxiosError<ApiErrorResponse>;
          if (apiError.response?.status === 404) {
            setError("Post not found");
          } else if (apiError.response?.status === 403) {
            setError("You do not have permission to edit this post");
          } else {
            setError(
              apiError.response?.data?.message ||
                errorMessage ||
                "Failed to load post",
            );
          }
        } else {
          setError(errorMessage || "Failed to load post");
        }
        return null;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-1/4 bg-slate-200 rounded"></div>
        <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
        <div className="h-[600px] bg-slate-100 rounded mt-6"></div>
      </div>
    );
  }

  if (isError || error) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          {error || "Error"}
        </h1>
        <p className="text-gray-500 mb-6">
          We couldn&apos;t load this post for editing.
        </p>
        <Button onClick={() => router.push("/dashboard/posts")}>
          Back to Posts
        </Button>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <p className="text-gray-500">Make changes to your post</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <PostForm
          initialData={{
            _id: post._id,
            title: post.title,
            content: post.content,
            summary: post.summary || "",
            status: post.status,
            tags: post.tags || [],
          }}
          isEditing
        />
      </div>
    </div>
  );
}
