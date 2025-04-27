export { default as axiosClient } from "./axiosClient";
export { default as authApi } from "./authApi";
export { default as postApi } from "./postApi";
export { default as commentApi } from "./commentApi";
export { default as profileApi } from "./profileApi";

export type {
  User,
  RegisterData,
  LoginData,
  AuthResponse,
  PasswordResetRequestData,
  PasswordResetData,
} from "./authApi";

export interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  coverImage?: string;
  status: "draft" | "published";
  commentCount?: number;
  likeCount?: number;
  viewCount?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  readingTime?: number;
  author?: {
    _id: string;
    name: string;
    username: string;
  };
}

export type {
  PostCreateData,
  PostUpdateData,
  PostSearchParams,
  PostsResponse,
} from "./postApi";

export type PostParams = {
  page?: number;
  limit?: number;
  sort?: string;
  author?: string;
  tag?: string;
  status?: string;
  featured?: boolean;
  search?: string;
};

export type {
  Comment,
  CommentCreateData,
  CommentUpdateData,
  CommentSearchParams,
  CommentsResponse,
} from "./commentApi";

export type {
  Profile,
  ProfileUpdateData,
  ProfileSearchParams,
  ProfilesResponse,
} from "./profileApi";
