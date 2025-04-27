"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/app/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/types/errors";

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const {
    data: post,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["post-details", id],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(`/posts/${id}`);
        return response.data.data;
      } catch (error) {
        console.error("Error fetching post:", error);
        const errorMessage = getErrorMessage(error);

        // Type checking using status code
        const apiError = error as { response?: { status?: number } };
        if (apiError.response?.status === 404) {
          setError("Post not found");
        } else if (apiError.response?.status === 403) {
          setError("You do not have permission to view this post");
        } else {
          setError(errorMessage || "Failed to load post");
        }
        return null;
      }
    },
  });

  const handlePublishToggle = async () => {
    if (!post) return;

    setIsPublishing(true);

    try {
      const newStatus = post.status === "published" ? "draft" : "published";
      await axiosClient.put(`/posts/${id}`, { status: newStatus });

      toast.success(
        newStatus === "published"
          ? "Post published successfully"
          : "Post unpublished and saved as draft",
      );

      refetch();
    } catch (error) {
      console.error("Error toggling post status:", error);
      toast.error("Failed to update post status");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this post? This action cannot be undone.",
      )
    )
      return;

    setIsDeleting(true);

    try {
      await axiosClient.delete(`/posts/${id}`);
      toast.success("Post deleted successfully");
      router.push("/dashboard/posts");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-1/3 bg-slate-200 rounded"></div>
        <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
        <div className="h-[400px] bg-slate-100 rounded mt-6"></div>
      </div>
    );
  }

  if (isError || error) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          {error || "Error"}
        </h1>
        <p className="text-gray-500 mb-6">We couldn&apos;t load this post.</p>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
            <span>
              Created: {new Date(post.createdAt).toLocaleDateString()}
            </span>
            {post.updatedAt !== post.createdAt && (
              <span>
                Updated: {new Date(post.updatedAt).toLocaleDateString()}
              </span>
            )}
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                post.status === "published"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {post.status === "published" ? "Published" : "Draft"}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/dashboard/posts/${id}/edit`}>
            <Button variant="outline">Edit Post</Button>
          </Link>
          <Button
            variant="outline"
            onClick={handlePublishToggle}
            disabled={isPublishing}
          >
            {isPublishing
              ? "Updating..."
              : post.status === "published"
                ? "Unpublish"
                : "Publish"}
          </Button>
          {post.status === "published" && post.slug && (
            <Link href={`/blog/${post.slug}`} target="_blank">
              <Button>View Live</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6">
          {post.tags && post.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium text-gray-500">Views</div>
              <div className="text-2xl font-bold">{post.views || 0}</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium text-gray-500">Likes</div>
              <div className="text-2xl font-bold">
                {post.likes?.length || 0}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium text-gray-500">Comments</div>
              <div className="text-2xl font-bold">0</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium text-gray-500">
                Reading Time
              </div>
              <div className="text-2xl font-bold">
                {post.readingTime ||
                  Math.ceil(post.content.split(/\s+/).length / 200)}{" "}
                min
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Content Preview</h3>
            <div className="border rounded-lg p-4 max-h-[400px] overflow-y-auto whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          <div className="border-t pt-6 mt-6 flex justify-end">
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-800 hover:bg-red-50"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Post"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
