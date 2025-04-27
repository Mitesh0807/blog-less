"use client";

import { useFeaturedPosts, usePosts } from "@/lib/hooks/usePosts";
import BlogCard from "@/components/blog-card";
import Link from "next/link";

export default function Home() {
  const { data: featuredPostsData, isLoading: isFeaturedLoading } =
    useFeaturedPosts();
  const { data: recentPostsData, isLoading: isRecentLoading } = usePosts({
    page: 1,
    limit: 6,
    sort: "-publishedAt",
  });

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-slate-900 text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Welcome to Blog-Less
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
              A modern, minimalist blogging platform where ideas flourish and
              stories come to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="bg-white text-slate-900 px-6 py-3 rounded-md font-medium hover:bg-slate-100 transition-colors"
              >
                Explore Posts
              </Link>
              <Link
                href="/register"
                className="bg-transparent text-white border border-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors"
              >
                Start Writing
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Featured Posts
            </h2>

            {isFeaturedLoading && (
              <div className="text-center py-8">Loading featured posts...</div>
            )}

            {featuredPostsData && featuredPostsData.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPostsData.data.map((post) => (
                  <BlogCard key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-600">
                No featured posts found.
              </div>
            )}

            <div className="text-center mt-10">
              <Link
                href="/blog"
                className="text-slate-900 font-medium hover:underline"
              >
                View all posts &rarr;
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Recent Posts
            </h2>

            {isRecentLoading && (
              <div className="text-center py-8">Loading recent posts...</div>
            )}

            {recentPostsData && recentPostsData.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentPostsData.data.map((post) => (
                  <BlogCard key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-600">
                No recent posts found.
              </div>
            )}

            <div className="text-center mt-10">
              <Link
                href="/blog"
                className="text-slate-900 font-medium hover:underline"
              >
                View all posts &rarr;
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Start Your Blogging Journey Today
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              Join our community of writers and share your stories with the
              world.
            </p>
            <Link
              href="/register"
              className="bg-slate-900 text-white px-6 py-3 rounded-md font-medium hover:bg-slate-800 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
