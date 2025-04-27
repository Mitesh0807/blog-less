export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: "user" | "admin";
  bio?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: "draft" | "published";
  author: User;
  tags: string[];
  featured: boolean;
  coverImage?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: string[];
}

export interface Comment {
  _id: string;
  content: string;
  post: string;
  author: User;
  parent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  _id: string;
  user: User;
  bio?: string;
  location?: string;
  website?: string;
  social?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
  interests: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  total: number;
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  data: T[];
}
