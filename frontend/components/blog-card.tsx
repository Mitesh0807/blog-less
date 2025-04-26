import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

export interface Author {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  publishedAt: string;
  authorId: string;
  author: Author;
}

interface BlogCardProps {
  post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow">
      <Link href={`/blog/${post.slug}`}>
        <div className="aspect-video relative">
          <Image
            src={post.coverImage || "/placeholder.svg?height=240&width=480"}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3 text-sm text-slate-600">
          <div className="w-6 h-6 rounded-full overflow-hidden">
            <Image
              src={post.author.avatar || "/placeholder.svg?height=24&width=24"}
              alt={post.author.name}
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
          <span>{post.author.name}</span>
          <span>•</span>
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold mb-2 hover:text-slate-700 transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="text-slate-600 line-clamp-2 mb-4">{post.excerpt}</p>
        <Link
          href={`/blog/${post.slug}`}
          className="text-black font-medium hover:underline"
        >
          Read more
        </Link>
      </div>
    </div>
  );
}
