// Comment Service

import { apiClient } from './api-client';
import type {
  Response,
  Comment,
  CommentRequest,
  CommentUpdateRequest,
} from '../types/api';

export const commentService = {
  /**
   * Get all comments for a book
   * GET /v1/library/{libraryId}/books/{bookId}/comments
   */
  getCommentsByBook: async (libraryId: string, bookId: string): Promise<Comment[]> => {
    const response = await apiClient.get<Response<Comment[]>>(
      `/v1/library/${libraryId}/books/${bookId}/comments`
    );
    return response.data;
  },

  /**
   * Get comment by ID
   * GET /v1/library/{libraryId}/books/{bookId}/comments/{id}
   */
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

  /**
   * Create a new comment
   * POST /v1/library/{libraryId}/books/{bookId}/comments
   */
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

  /**
   * Update comment
   * PUT /v1/library/{libraryId}/books/{bookId}/comments/{id}
   */
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

  /**
   * Delete comment
   * DELETE /v1/library/{libraryId}/books/{bookId}/comments/{id}
   * Note: Returns raw UUID (not wrapped in Response)
   */
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
