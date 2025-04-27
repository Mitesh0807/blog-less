export * from "./user";

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: "draft" | "published";
  author?: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  tags: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  coverImage?: string;
  readingTime?: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostParams {
  page?: number;
  limit?: number;
  sort?: string;
  author?: string;
  tag?: string;
  status?: string;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}
