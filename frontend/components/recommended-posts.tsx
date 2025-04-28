import React from "react";
import BlogCard from "./blog-card";
import Link from "next/link";
import { Post } from "@/lib/api-services";

const RecommendedPosts = ({ posts }: { posts: Post[] }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Recommended Posts</h2>
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-600">
            No recommended posts found.
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="text-slate-900 font-medium hover:underline"
          >
            Explore more posts &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecommendedPosts;