"use client";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/app/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardPostSummary } from "@/lib/types/dashboard";

export default function PostsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounceValue(searchQuery, 500);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["user-posts", currentPage, status, debouncedSearchQuery],
    queryFn: async () => {
      try {
        const params: Record<string, string | number | undefined> = {
          page: currentPage,
          limit: 10,
          sort: "-createdAt",
        };

        if (status) params.status = status;
        if (debouncedSearchQuery) params.search = debouncedSearchQuery;

        const response = await axiosClient.get("/posts/me", { params });
        return response.data;
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }
    },
  });

  const posts = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const handleStatusChange = (value: string) => {
    setStatus(value === "all" ? undefined : value);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await axiosClient.delete(`/posts/${postId}`);
      refetch();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">My Posts</h1>
        <Link href="/dashboard/posts/new">
          <Button>Create New Post</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <form onSubmit={handleSearch} className="flex space-x-2">
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit">Search</Button>
            </form>
          </div>
          <div className="w-full md:w-1/4">
            <Select value={status || "all"} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse h-20 bg-slate-100 rounded"
              ></div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-6 text-center text-red-500">
            <p>Failed to load posts. Please try again.</p>
            <Button onClick={() => refetch()} className="mt-2">
              Retry
            </Button>
          </div>
        ) : posts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.map((post: DashboardPostSummary) => (
                  <tr key={post._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        <Link
                          href={`/dashboard/posts/${post._id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {post.title}
                        </Link>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {post.tags.map((tag, index) => (
                            <span key={tag} className="mr-1">
                              #{tag}
                              {index < post.tags!.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {post.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {post.views || 0}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/dashboard/posts/${post._id}/edit`}>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={() => handleDeletePost(post._id)}
                        >
                          Delete
                        </Button>
                        {post.status === "published" && (
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-10">
            <h3 className="text-lg font-medium mb-2">No posts found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || status
                ? "Try changing your filters or search query"
                : "You haven't created any posts yet"}
            </p>
            {!searchQuery && !status && (
              <Link href="/dashboard/posts/new">
                <Button>Create Your First Post</Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {posts.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((curr) => Math.max(curr - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index + 1 ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(index + 1)}
                  className="min-w-[2.5rem]"
                >
                  {index + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((curr) => Math.min(curr + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
}
