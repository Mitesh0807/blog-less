export interface DashboardPostSummary {
  _id: string;
  title: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  views?: number;
  likes?: string[];
  tags?: string[];
  slug: string;
  author?: {
    _id: string;
    name: string;
    username: string;
  };
}

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
}

export interface DashboardError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export interface PostsResponse {
  posts: DashboardPostSummary[];
  totalPosts: number;
  currentPage: number;
  totalPages: number;
}