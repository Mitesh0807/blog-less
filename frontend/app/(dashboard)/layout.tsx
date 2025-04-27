"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-64 bg-slate-200 rounded mb-4 mx-auto"></div>
          <div className="h-6 w-40 bg-slate-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-white hidden md:block">
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="mb-6 px-4">
            <h2 className="text-lg font-semibold">Dashboard</h2>
            <p className="text-sm text-gray-500">Welcome, {user.name}</p>
          </div>
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
                <span className="ml-3">Overview</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/posts"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span className="ml-3">My Posts</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/posts/new"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span className="ml-3">Create Post</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/profile"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="ml-3">Profile</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      <div className="md:hidden w-full bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <div className="flex space-x-2">
            <Link href="/dashboard/posts/new">
              <Button size="sm" variant="outline">
                New Post
              </Button>
            </Link>
          </div>
        </div>
        <div className="px-4 py-2 overflow-x-auto flex space-x-4 border-t">
          <Link
            href="/dashboard"
            className="whitespace-nowrap text-sm py-1 px-3 rounded-full bg-gray-100"
          >
            Overview
          </Link>
          <Link
            href="/dashboard/posts"
            className="whitespace-nowrap text-sm py-1 px-3 rounded-full bg-gray-100"
          >
            My Posts
          </Link>
          <Link
            href="/dashboard/profile"
            className="whitespace-nowrap text-sm py-1 px-3 rounded-full bg-gray-100"
          >
            Profile
          </Link>
        </div>
      </div>

      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
