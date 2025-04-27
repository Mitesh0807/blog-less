"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/app/api";
import { Button } from "@/components/ui/button";
import { DashboardPostSummary } from "@/lib/types/dashboard";

export default function DashboardPage() {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["user-posts-stats"],
    queryFn: async () => {
      try {
        const response = await axiosClient.get("/posts/me/stats");
        return response.data.data;
      } catch (error) {
        console.error("Error fetching post stats:", error);
        return {
          total: 0,
          published: 0,
          draft: 0,
          views: 0,
        };
      }
    },
  });
  //TODO:move to comman place
  const { data: recentPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["user-recent-posts"],
    queryFn: async () => {
      try {
        const response = await axiosClient.get("/posts/me", {
          params: { limit: 5, sort: "-createdAt" },
        });
        return response.data.data;
      } catch (error) {
        console.error("Error fetching recent posts:", error);
        return [];
      }
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/dashboard/posts/new">
          <Button>Create New Post</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Posts"
          value={isLoadingStats ? "..." : stats?.total || 0}
          icon={
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
        />
        <StatsCard
          title="Published"
          value={isLoadingStats ? "..." : stats?.published || 0}
          icon={
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          }
        />
        <StatsCard
          title="Drafts"
          value={isLoadingStats ? "..." : stats?.draft || 0}
          icon={
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          }
        />
        <StatsCard
          title="Total Views"
          value={isLoadingStats ? "..." : stats?.views || 0}
          icon={
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          }
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Posts</h2>
          <Link
            href="/dashboard/posts"
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </Link>
        </div>

        {isLoadingPosts ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse h-14 bg-slate-100 rounded"
              ></div>
            ))}
          </div>
        ) : recentPosts && recentPosts.length > 0 ? (
          <div className="space-y-2">
            {recentPosts.map((post: DashboardPostSummary) => (
              <div
                key={post._id}
                className="flex items-center justify-between border-b pb-2 last:border-0"
              >
                <div className="flex-1">
                  <Link
                    href={`/dashboard/posts/${post._id}`}
                    className="font-medium hover:text-blue-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
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
                <div className="flex items-center space-x-2">
                  <Link href={`/dashboard/posts/${post._id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-4">
              You haven&apos;t created any posts yet
            </p>
            <Link href="/dashboard/posts/new">
              <Button>Create Your First Post</Button>
            </Link>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/posts/new"
            className="group p-4 border rounded-lg hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center">
              <div className="mr-4 p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <svg
                  className="w-6 h-6 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Create New Post</h3>
                <p className="text-sm text-gray-500">
                  Start writing a new blog post
                </p>
              </div>
            </div>
          </Link>
          <Link
            href="/dashboard/posts"
            className="group p-4 border rounded-lg hover:border-purple-500 transition-colors"
          >
            <div className="flex items-center">
              <div className="mr-4 p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                <svg
                  className="w-6 h-6 text-purple-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Manage Posts</h3>
                <p className="text-sm text-gray-500">
                  View and edit all your posts
                </p>
              </div>
            </div>
          </Link>
          <Link
            href="/dashboard/profile"
            className="group p-4 border rounded-lg hover:border-green-500 transition-colors"
          >
            <div className="flex items-center">
              <div className="mr-4 p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                <svg
                  className="w-6 h-6 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Edit Profile</h3>
                <p className="text-sm text-gray-500">
                  Update your profile information
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 flex items-center">
      <div className="mr-4 p-2 bg-blue-50 rounded-lg">
        <div className="text-blue-600">{icon}</div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
