import { apiClient } from './api-client';
import type {
  Response,
  Comment,
  CommentRequest,
  CommentUpdateRequest,
} from '../types/api';

export const commentService = {
  getCommentsByBook: async (libraryId: string, bookId: string): Promise<Comment[]> => {
    const response = await apiClient.get<Response<Comment[]>>(
      `/v1/library/${libraryId}/books/${bookId}/comments`
    );
    return response.data;
  },

  getCommentById: async (
    libraryId: string,
    bookId: string,
    commentId: string
  ): Promise<Comment> => {
    const response = await apiClient.get<Response<Comment>>(
      `/v1/library/${libraryId}/books/${bookId}/comments/${commentId}`
    );
    return response.data;
  },

  createComment: async (
    libraryId: string,
    bookId: string,
    data: CommentRequest
  ): Promise<Comment> => {
    const response = await apiClient.post<Response<Comment>>(
      `/v1/library/${libraryId}/books/${bookId}/comments`,
      data
    );
    return response.data;
  },

  updateComment: async (
    libraryId: string,
    bookId: string,
    commentId: string,
    data: CommentUpdateRequest
  ): Promise<Comment> => {
    const response = await apiClient.put<Response<Comment>>(
      `/v1/library/${libraryId}/books/${bookId}/comments/${commentId}`,
      data
    );
    return response.data;
  },

  deleteComment: async (
    libraryId: string,
    bookId: string,
    commentId: string
  ): Promise<string> => {
    return apiClient.delete<string>(
      `/v1/library/${libraryId}/books/${bookId}/comments/${commentId}`
    );
  },
};
