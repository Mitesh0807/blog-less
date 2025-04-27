import axiosClient from './axiosClient';

export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  authorUsername: string;
  authorDisplayName: string;
  authorAvatarUrl?: string;
  parentId?: string;
  likeCount: number;
  isLiked?: boolean;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface CommentCreateData {
  content: string;
  postId: string;
  parentId?: string;
}

export interface CommentUpdateData {
  content: string;
}

export interface CommentSearchParams {
  page?: number;
  limit?: number;
  postId: string;
  parentId?: string | null;
  sort?: string;
}

export interface CommentsResponse {
  comments: Comment[];
  totalCount: number;
  page: number;
  totalPages: number;
}

export const commentApi = {
  getComments: async (params: CommentSearchParams): Promise<CommentsResponse> => {
    const response = await axiosClient.get('/comments', { params });
    return response.data.data;
  },

  getComment: async (id: string): Promise<Comment> => {
    const response = await axiosClient.get(`/comments/${id}`);
    return response.data.data;
  },

  getPostComments: async (postId: string, params: Omit<CommentSearchParams, 'postId'> = {}): Promise<CommentsResponse> => {
    return commentApi.getComments({ ...params, postId });
  },

  getReplies: async (commentId: string, postId: string, params: Omit<CommentSearchParams, 'parentId' | 'postId'> = {}): Promise<CommentsResponse> => {
    return commentApi.getComments({ ...params, parentId: commentId, postId });
  },

  createComment: async (commentData: CommentCreateData): Promise<Comment> => {
    const response = await axiosClient.post('/comments', commentData);
    return response.data.data;
  },

  updateComment: async (id: string, commentData: CommentUpdateData): Promise<Comment> => {
    const response = await axiosClient.put(`/comments/${id}`, commentData);
    return response.data.data;
  },

  deleteComment: async (id: string): Promise<{ message: string }> => {
    const response = await axiosClient.delete(`/comments/${id}`);
    return response.data;
  },

  likeComment: async (id: string): Promise<{ isLiked: boolean }> => {
    const response = await axiosClient.post(`/comments/${id}/like`);
    return response.data.data;
  },

  getCommentLikes: async (
    commentId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<{ users: Array<{ id: string; username: string; displayName: string; avatarUrl?: string }>, totalCount: number }> => {
    const response = await axiosClient.get(`/comments/${commentId}/likes`, { params });
    return response.data.data;
  }
};

export default commentApi;