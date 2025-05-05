import Link from "next/link";
import { Post } from "@/app/api";
import { formatDate } from "@/lib/utils";
import { BlogImage } from "./blog-image";

interface BlogCardProps {
  post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <div className=" rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow">
      <Link href={`/blog/${post.slug}`}>
        <div className="aspect-video relative">
          <BlogImage
            src={post.coverImage || "/images/placeholder.jpg"}
            alt={post.title}
            fill
            quality={50}
            aspectRatio="16/9"
          />
        </div>
      </Link>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3 text-sm text-slate-600">
          <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-200">
            {post.author && (
              <div className="flex items-center">
                <span>{post.author.name}</span>
              </div>
            )}
          </div>
          <span>•</span>
          <time dateTime={post.publishedAt || post.createdAt}>
            {formatDate(post.publishedAt || post.createdAt)}
          </time>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold mb-2 hover:text-slate-700 transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="text-slate-600 line-clamp-2 mb-4">{post.excerpt}</p>
        <div className="flex justify-between items-center">
          <Link
            href={`/blog/${post.slug}`}
            className="text-black font-medium hover:underline"
          >
            Read more
          </Link>

          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.slice(0, 2).map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${tag}`}
                  className="text-xs bg-slate-100 px-2 py-1 rounded hover:bg-slate-200 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
