import { getPostBySlug } from "@/lib/blog-service";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BlogImage } from "@/components/blog-image";
import { formatDate, getReadingTime, formatViewCount } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;

  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | Blog-Less",
      description: "The post you're looking for doesn't exist",
    };
  }

  return {
    title: `${post.title} | Blog-Less`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
      type: "article",
      publishedTime: post.publishedAt || post.createdAt,
      authors: post.author ? [`${post.author.name}`] : undefined,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const readingTime = post.readingTime || getReadingTime(post.content);

  const views =
    typeof post.viewCount === "number"
      ? formatViewCount(post.viewCount)
      : "0 views";

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
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

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center text-sm text-slate-600 mb-4">
          {post.author && (
            <div className="flex items-center mr-4">
              <div className="w-8 h-8 rounded-full bg-slate-200 mr-2 flex items-center justify-center overflow-hidden">
                {post.author.name.charAt(0)}
              </div>
              <span>{post.author.name}</span>
            </div>
          )}

          <span className="mx-2">•</span>

          <time dateTime={post.publishedAt || post.createdAt}>
            {formatDate(post.publishedAt || post.createdAt)}
          </time>

          <span className="mx-2">•</span>

          <span>{readingTime} min read</span>

          <span className="mx-2">•</span>

          <span>{views}</span>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm hover:bg-slate-200 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {post.coverImage && (
        <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
          <BlogImage
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            quality="high"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </div>
      )}

      <div
        className="prose prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-12 pt-8 border-t">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-slate-500">Posted by</h3>
            <div className="flex items-center mt-2">
              <div className="w-10 h-10 rounded-full bg-slate-200 mr-3 flex items-center justify-center overflow-hidden">
                {post.author?.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{post.author?.name}</p>
                <p className="text-sm text-slate-600">
                  @{post.author?.username}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Share
            </Button>
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
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              Like
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
