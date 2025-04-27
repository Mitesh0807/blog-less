import { Suspense } from "react";
import { getAllPosts } from "@/lib/blog-service";
import BlogCard from "@/components/blog-card";
import { Skeleton } from "@/components/ui/skeleton";
import { PostParams } from "@/app/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { parseAsString } from "nuqs/server";
import SortForm from "@/components/sort-form";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Blog | Blog-Less",
  description: "Read our latest articles and updates on Blog-Less platform.",
};

function generateFilterUrl(
  currentParams: Record<string, string | undefined>,
  updates: Record<string, string | number | null>,
): string {
  const params = { ...currentParams };

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null) {
      delete params[key];
    } else {
      params[key] = String(value);
    }
  });

  const queryString = Object.entries(params)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, v]) => v !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join("&");

  return `/blog${queryString ? `?${queryString}` : ""}`;
}

async function searchPosts(formData: FormData) {
  "use server";

  const searchQuery = formData.get("search")?.toString() || "";
  const tag = formData.get("tag")?.toString();
  const author = formData.get("author")?.toString();
  const sort = formData.get("sort")?.toString() || "-createdAt";

  const searchParams = new URLSearchParams();

  if (searchQuery) searchParams.set("search", searchQuery);
  if (tag) searchParams.set("tag", tag);
  if (author) searchParams.set("author", author);
  if (sort !== "-createdAt") searchParams.set("sort", sort);

  const queryString = searchParams.toString();
  redirect(`/blog${queryString ? `?${queryString}` : ""}`);
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    tag?: string;
    author?: string;
    sort?: string;
    search?: string;
  }>;
}) {
  const resolvedParams = await searchParams;

  const page = (await resolvedParams.page)
    ? parseInt((await resolvedParams.page) ?? "1")
    : 1;
  const tag = parseAsString.parseServerSide(resolvedParams.tag) || undefined;
  const author =
    parseAsString.parseServerSide(resolvedParams.author) || undefined;
  const sort =
    parseAsString.parseServerSide(resolvedParams.sort) || "-createdAt";
  const search =
    parseAsString.parseServerSide(resolvedParams.search) || undefined;

  const params: PostParams = {
    page,
    limit: 9,
    tag,
    author,
    sort,
    search,
    status: "published",
  };

  const posts = await getAllPosts(params);
  const hasActiveFilters = tag || author || search;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-lg text-slate-600">
          Explore our collection of articles, guides, and stories
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-12">
        <form action={searchPosts} className="flex gap-2">
          {tag && <input type="hidden" name="tag" value={tag} />}
          {author && <input type="hidden" name="author" value={author} />}
          {sort !== "-createdAt" && (
            <input type="hidden" name="sort" value={sort} />
          )}

          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search articles..."
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
          <Button type="submit">Search</Button>
        </form>
      </div>

      {hasActiveFilters && (
        <div className="bg-slate-50 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-slate-600">Filtered by:</span>

            {tag && (
              <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm border">
                <span>Tag: {tag}</span>
                <Link href={generateFilterUrl(resolvedParams, { tag: null })}>
                  <span className="text-slate-400 hover:text-slate-800 ml-1">
                    ×
                  </span>
                </Link>
              </div>
            )}

            {author && (
              <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm border">
                <span>Author: {author}</span>
                <Link
                  href={generateFilterUrl(resolvedParams, { author: null })}
                >
                  <span className="text-slate-400 hover:text-slate-800 ml-1">
                    ×
                  </span>
                </Link>
              </div>
            )}

            {search && (
              <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm border">
                <span>Search: {search}</span>
                <Link
                  href={generateFilterUrl(resolvedParams, { search: null })}
                >
                  <span className="text-slate-400 hover:text-slate-800 ml-1">
                    ×
                  </span>
                </Link>
              </div>
            )}

            <Link href="/blog">
              <Button variant="outline" size="sm">
                Clear all
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="flex justify-end items-center mb-6">
        <div className="hidden sm:flex mr-4 text-sm text-slate-600">
          <span className="mr-2">Sort by:</span>
          <div className="flex gap-2">
            <Link
              href={generateFilterUrl(resolvedParams, { sort: "-createdAt" })}
              className={`px-2 py-1 rounded ${sort === "-createdAt" ? "bg-slate-100 font-medium" : "hover:bg-slate-50"}`}
            >
              Newest
            </Link>
            <Link
              href={generateFilterUrl(resolvedParams, { sort: "createdAt" })}
              className={`px-2 py-1 rounded ${sort === "createdAt" ? "bg-slate-100 font-medium" : "hover:bg-slate-50"}`}
            >
              Oldest
            </Link>
            <Link
              href={generateFilterUrl(resolvedParams, { sort: "-views" })}
              className={`px-2 py-1 rounded ${sort === "-views" ? "bg-slate-100 font-medium" : "hover:bg-slate-50"}`}
            >
              Popular
            </Link>
            <Link
              href={generateFilterUrl(resolvedParams, { sort: "title" })}
              className={`px-2 py-1 rounded ${sort === "title" ? "bg-slate-100 font-medium" : "hover:bg-slate-50"}`}
            >
              A-Z
            </Link>
          </div>
        </div>

        <div className="sm:hidden">
          <SortForm
            action="/blog"
            currentSort={sort}
            pageParam={page}
            tagParam={tag}
            authorParam={author}
            searchParam={search}
          />
        </div>
      </div>

      <Suspense fallback={<BlogPostsSkeleton />}>
        <div className="space-y-10">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-slate-800">
                No posts found
              </h2>
              <p className="text-slate-600 mt-2">
                {search
                  ? "Try different search terms or"
                  : "Check back later for new content, or"}
                <Link
                  href="/blog"
                  className="text-blue-600 hover:underline ml-1"
                >
                  view all posts
                </Link>
                .
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <BlogCard key={post._id} post={post} />
                ))}
              </div>

              <div className="flex justify-center mt-10 space-x-2">
                {page > 1 && (
                  <Link
                    href={generateFilterUrl(resolvedParams, { page: page - 1 })}
                  >
                    <Button variant="outline" size="sm">
                      Previous
                    </Button>
                  </Link>
                )}

                <span className="flex items-center px-3 py-1 text-sm bg-slate-100 rounded-md">
                  Page {page}
                </span>

                {posts.length === 9 && (
                  <Link
                    href={generateFilterUrl(resolvedParams, { page: page + 1 })}
                  >
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </Suspense>
    </div>
  );
}

function BlogPostsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg overflow-hidden shadow-sm border"
        >
          <Skeleton className="w-full h-52" />
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-4/5 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
