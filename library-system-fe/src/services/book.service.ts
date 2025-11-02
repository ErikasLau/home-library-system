import { apiClient } from './api-client';
import type {
  Response,
  Page,
  Book,
  BookShort,
  BookRequest,
  BookUpdateRequest,
  PageableParams,
} from '../types/api';

export const bookService = {
  /**
   * Get books in a library (paginated)
   * GET /v1/library/{libraryId}/books
   * Note: Returns Page<BookShort> directly (not wrapped in Response)
   */
  getBooksByLibrary: async (libraryId: string, params?: PageableParams): Promise<Page<BookShort>> => {
    return apiClient.get<Page<BookShort>>(`/v1/library/${libraryId}/books`, params);
  },

  /**
   * Get book details with comments
   * GET /v1/library/{libraryId}/books/{id}
   */
  getBookById: async (libraryId: string, bookId: string): Promise<Book> => {
    const response = await apiClient.get<Response<Book>>(
      `/v1/library/${libraryId}/books/${bookId}`
    );
    return response.data;
  },

  /**
   * Create a new book in a library
   * POST /v1/library/{libraryId}/books
   */
  createBook: async (libraryId: string, data: BookRequest): Promise<Book> => {
    const response = await apiClient.post<Response<Book>>(
      `/v1/library/${libraryId}/books`,
      data
    );
    return response.data;
  },

  /**
   * Update book
   * PUT /v1/library/{libraryId}/books/{id}
   */
  updateBook: async (
    libraryId: string,
    bookId: string,
    data: BookUpdateRequest
  ): Promise<Book> => {
    const response = await apiClient.put<Response<Book>>(
      `/v1/library/${libraryId}/books/${bookId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete book
   * DELETE /v1/library/{libraryId}/books/{id}
   */
  deleteBook: async (libraryId: string, bookId: string): Promise<string> => {
    const response = await apiClient.delete<Response<string>>(
      `/v1/library/${libraryId}/books/${bookId}`
    );
    return response.data;
  },
};
