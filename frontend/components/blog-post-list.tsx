import { Post } from "@/app/api";
import BlogCard from "./blog-card";
import { Button } from "./ui/button";
import Link from "next/link";

interface BlogPostListProps {
  posts: Post[];
  currentPage: number;
  hasMore: boolean;
  baseUrl: string;
  searchParams: Record<string, string | undefined>;
}

export default function BlogPostList({
  posts,
  currentPage,
  hasMore,
  baseUrl,
  searchParams,
}: BlogPostListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-800">No posts found</h2>
        <p className="text-slate-600 mt-2">
          Check back later for new content or
          <Link href="/blog" className="text-black underline ml-1">
            view all posts
          </Link>
          .
        </p>
      </div>
    );
  }

  function generatePageUrl(page: number): string {
    const urlParams = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "page" && value) {
        urlParams.set(key, value);
      }
    });

    if (page > 1) {
      urlParams.set("page", page.toString());
    }

    const queryString = urlParams.toString();
    return `${baseUrl}${queryString ? `?${queryString}` : ""}`;
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogCard key={post._id} post={post} />
        ))}
      </div>

      <div className="flex justify-center mt-10 space-x-2">
        {currentPage > 1 && (
          <Link href={generatePageUrl(currentPage - 1)}>
            <Button variant="outline" size="sm">
              Previous
            </Button>
          </Link>
        )}

        <span className="flex items-center px-3 py-1 text-sm bg-slate-100 rounded-md">
          Page {currentPage}
        </span>

        {hasMore && (
          <Link href={generatePageUrl(currentPage + 1)}>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
