import { Post, PostParams } from "../app/api";
import { PostSearchParams } from "../app/api/postApi";
import { publicApi } from "./api";

// Define proper types for API responses
interface ApiAuthor {
  _id: string;
  name: string;
  username: string;
  bio?: string;
  profilePicture?: string;
}

interface ApiPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  excerpt?: string;
  views: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  author: ApiAuthor;
  tags: string[];
  likes?: string[];
  readingTime?: number;
  commentCount?: number;
  featuredImageUrl?: string;
  coverImage?: string;
}

//TODO:zod or valibot
function convertParams(params: PostParams): PostSearchParams {
  return {
    page: params.page,
    limit: params.limit,
    sort: params.sort,
    author: params.author,
    tag: params.tag,
    status: params.status as "draft" | "published" | undefined,
    featured: params.featured,
    search: params.search,
  };
}

function formatImagePath(imagePath?: string): string {
  if (!imagePath) return "/images/placeholder.jpg";

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  if (imagePath.startsWith("/uploads/")) {
    return `http://localhost:8080${imagePath}`;
  }

  return imagePath;
}

export async function getAllPosts(params: PostParams = {}): Promise<Post[]> {
  try {
    const apiParams = convertParams(params);
    const response = await publicApi.get("/posts", { params: apiParams });

    if (response && response.data && response.data.data) {
      return response.data.data.map(
        (post: ApiPost): Post => ({
          _id: post._id,
          title: post.title,
          excerpt: post.summary,
          slug: post.slug,
          content: post.content,
          viewCount: post.views,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          publishedAt: post.publishedAt,
          author: post.author
            ? {
                _id: post.author._id,
                name: post.author.name,
                username: post.author.username,
              }
            : undefined,
          tags: post.tags,
          commentCount: 0,
          likeCount: post.likes?.length || 0,
          status: post.status as "draft" | "published",
          coverImage: formatImagePath(post.coverImage),
          readingTime: post.readingTime,
        }),
      );
    }
    return [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const response = await publicApi.get(`/posts/${slug}`);

    if (response && response.data && response.data.data) {
      const post = response.data.data as ApiPost;
      return {
        _id: post._id,
        title: post.title,
        excerpt: post.summary,
        slug: post.slug,
        content: post.content,
        viewCount: post.views,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        publishedAt: post.publishedAt,
        author: post.author
          ? {
              _id: post.author._id,
              name: post.author.name,
              username: post.author.username,
            }
          : undefined,
        tags: post.tags,
        commentCount: 0,
        likeCount: post.likes?.length || 0,
        status: post.status as "draft" | "published",
        coverImage: formatImagePath(post.coverImage),
        readingTime:
          post.readingTime || Math.ceil(post.content.split(/\s+/).length / 200),
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
}

export async function getFeaturedPosts(): Promise<Post[]> {
  try {
    const response = await publicApi.get("/posts/featured");

    if (response && response.data && response.data.data) {
      return response.data.data.map(
        (post: ApiPost): Post => ({
          _id: post._id,
          title: post.title,
          excerpt: post.summary,
          slug: post.slug,
          content: post.content,
          viewCount: post.views,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          publishedAt: post.publishedAt,
          author: post.author
            ? {
                _id: post.author._id,
                name: post.author.name,
                username: post.author.username,
              }
            : undefined,
          tags: post.tags,
          commentCount: 0,
          likeCount: post.likes?.length || 0,
          status: post.status as "draft" | "published",
          coverImage: formatImagePath(post.coverImage),
        }),
      );
    }
    return [];
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return [];
  }
}

export async function getPostsByAuthor(authorId: string): Promise<Post[]> {
  try {
    const response = await publicApi.get(`/posts/author/${authorId}`);

    if (response && response.data && response.data.data) {
      return response.data.data.map(
        (post: ApiPost): Post => ({
          _id: post._id,
          title: post.title,
          excerpt: post.summary || post.excerpt,
          slug: post.slug,
          content: post.content,
          viewCount: post.views || 0,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          publishedAt: post.publishedAt,
          author: post.author
            ? {
                _id: post.author._id,
                name: post.author.name,
                username: post.author.username,
              }
            : undefined,
          tags: post.tags || [],
          commentCount: post.commentCount || 0,
          likeCount: post.likes?.length || 0,
          status: post.status as "draft" | "published",
          coverImage: formatImagePath(post.featuredImageUrl || post.coverImage),
        }),
      );
    }
    return [];
  } catch (error) {
    console.error(`Error fetching posts by author ${authorId}:`, error);
    return [];
  }
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  try {
    const response = await publicApi.get(`/posts/tag/${tag}`);

    if (response && response.data && response.data.data) {
      return response.data.data.map(
        (post: ApiPost): Post => ({
          _id: post._id,
          title: post.title,
          excerpt: post.summary,
          slug: post.slug,
          content: post.content,
          viewCount: post.views,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          publishedAt: post.publishedAt,
          author: post.author
            ? {
                _id: post.author._id,
                name: post.author.name,
                username: post.author.username,
              }
            : undefined,
          tags: post.tags,
          commentCount: 0,
          likeCount: post.likes?.length || 0,
          status: post.status as "draft" | "published",
          coverImage: "/images/placeholder.jpg",
        }),
      );
    }
    return [];
  } catch (error) {
    console.error(`Error fetching posts with tag ${tag}:`, error);
    return [];
  }
}

export function formatPost(post: ApiPost): Post {
  return {
    _id: post._id,
    title: post.title,
    excerpt: post.summary || post.excerpt,
    slug: post.slug,
    content: post.content,
    viewCount: post.views || 0,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    publishedAt: post.publishedAt,
    author: post.author
      ? {
          _id: post.author._id,
          name: post.author.name,
          username: post.author.username,
        }
      : undefined,
    tags: post.tags || [],
    commentCount: post.commentCount || 0,
    likeCount: post.likes?.length || 0,
    status: post.status as "draft" | "published",
    coverImage: formatImagePath(post.coverImage),
    readingTime:
      post.readingTime || Math.ceil(post.content.split(/\s+/).length / 200),
  };
}

export async function getPostById(id: string): Promise<Post | null> {
  try {
    const response = await publicApi.get(`/posts/id/${id}`);

    if (response && response.data && response.data.data) {
      const post = response.data.data as ApiPost;
      return formatPost(post);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching post with ID ${id}:`, error);
    return null;
  }
}

export async function getPostsByIds(ids: string[]): Promise<Post[]> {
  try {
    const response = await publicApi.post("/posts/batch", { ids });

    if (response && response.data && response.data.data) {
      return response.data.data.map((post: ApiPost): Post => formatPost(post));
    }
    return [];
  } catch (error) {
    console.error(`Error fetching posts by IDs:`, error);
    return [];
  }
}