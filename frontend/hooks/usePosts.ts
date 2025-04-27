import { useState } from "react";
import {
  postApi,
  Post,
  PostParams,
  PostCreateData,
  PostUpdateData,
} from "../app/api";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchPosts = async (params: PostParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await postApi.getPosts(params);
      setPosts(response.data);
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        total: response.total,
      });
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch posts");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPostBySlug = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await postApi.getPostBySlug(slug);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch post");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: PostCreateData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await postApi.createPost(postData);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create post");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (id: string, postData: PostUpdateData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await postApi.updatePost(id, postData);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update post");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await postApi.deletePost(id);

      setPosts(posts.filter((post) => post.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete post");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await postApi.likePost(id);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to like post");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getFeaturedPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await postApi.getFeaturedPosts();
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch featured posts");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    posts,
    loading,
    error,
    pagination,
    fetchPosts,
    fetchPostBySlug,
    createPost,
    updatePost,
    deletePost,
    likePost,
    getFeaturedPosts,
  };
};

export default usePosts;
