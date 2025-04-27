import { getAllPosts } from "@/lib/blog-service";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BlogCard from "@/components/blog-card";
import { parseAsString } from "nuqs/server";
import SortForm from "@/components/sort-form";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { tag: string };
}): Promise<Metadata> {
  const tagParam = params.tag;
  const tag = decodeURIComponent(tagParam);

  return {
    title: `${tag.charAt(0).toUpperCase() + tag.slice(1)} Posts | Blog-Less`,
    description: `Browse all blog posts about ${tag} on Blog-Less`,
  };
}

interface TagPageProps {
  params: { tag: string };
  searchParams: { page?: string; sort?: string };
}

function generateFilterUrl(
  tag: string,
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
    .filter(([_, v]) => v !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join("&");

  return `/blog/tag/${encodeURIComponent(tag)}${queryString ? `?${queryString}` : ""}`;
}

async function sortPosts(formData: FormData) {
  "use server";

  const tag = formData.get("tag")?.toString() || "";
  const sort = formData.get("sort")?.toString() || "-createdAt";
  const page = formData.get("page")?.toString();

  const searchParams = new URLSearchParams();

  if (sort !== "-createdAt") searchParams.set("sort", sort);
  if (page && page !== "1") searchParams.set("page", page);

  const queryString = searchParams.toString();
  redirect(
    `/blog/tag/${encodeURIComponent(tag)}${queryString ? `?${queryString}` : ""}`,
  );
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const tagParam = params.tag;
  const tag = decodeURIComponent(tagParam);

  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const sort = parseAsString.parseServerSide(searchParams.sort) || "-createdAt";

  const posts = await getAllPosts({
    tag,
    page,
    limit: 9,
    sort,
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/blog">
                <Button variant="ghost" size="sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Back to all posts
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-slate-100 px-2 py-1 rounded">#{tag}</span>{" "}
              Posts
            </h1>
            <p className="text-slate-600">
              Browse all blog posts tagged with {tag}
            </p>
          </div>

          <form action={sortPosts} id="serverSortForm" className="hidden">
            <input type="hidden" name="tag" value={tag} />
            <input
              type="hidden"
              name="sort"
              id="serverSortValue"
              value={sort}
            />
            {page !== 1 && <input type="hidden" name="page" value={page} />}
          </form>

          <div className="hidden sm:flex flex-col items-end">
            <div className="text-sm text-slate-600 mb-1">Sort by:</div>
            <div className="flex gap-2">
              <Link
                href={generateFilterUrl(tag, searchParams, {
                  sort: "-createdAt",
                })}
                className={`px-2 py-1 rounded text-sm ${sort === "-createdAt" ? "bg-slate-100 font-medium" : "hover:bg-slate-50"}`}
              >
                Newest
              </Link>
              <Link
                href={generateFilterUrl(tag, searchParams, {
                  sort: "createdAt",
                })}
                className={`px-2 py-1 rounded text-sm ${sort === "createdAt" ? "bg-slate-100 font-medium" : "hover:bg-slate-50"}`}
              >
                Oldest
              </Link>
              <Link
                href={generateFilterUrl(tag, searchParams, { sort: "-views" })}
                className={`px-2 py-1 rounded text-sm ${sort === "-views" ? "bg-slate-100 font-medium" : "hover:bg-slate-50"}`}
              >
                Popular
              </Link>
              <Link
                href={generateFilterUrl(tag, searchParams, { sort: "title" })}
                className={`px-2 py-1 rounded text-sm ${sort === "title" ? "bg-slate-100 font-medium" : "hover:bg-slate-50"}`}
              >
                A-Z
              </Link>
            </div>
          </div>

          <div className="sm:hidden">
            <SortForm
              action={`/blog/tag/${encodeURIComponent(tag)}`}
              currentSort={sort}
              pageParam={page}
            />
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-slate-800">No posts found</h2>
          <p className="text-slate-600 mt-2">
            No posts with the tag "{tag}" were found.
            <Link href="/blog" className="text-blue-600 hover:underline ml-1">
              View all posts
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          <div className="flex justify-center mt-10 space-x-2">
            {page > 1 && (
              <Link
                href={generateFilterUrl(tag, searchParams, { page: page - 1 })}
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
                href={generateFilterUrl(tag, searchParams, { page: page + 1 })}
              >
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
