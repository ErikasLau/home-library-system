import { apiClient } from './api-client';
import type {
  Response,
  Book,
  BookShort,
  BookRequest,
  BookUpdateRequest,
} from '../types/api';

export const bookService = {
  /**
   * Get books in a library
   * GET /v1/library/{libraryId}/books
   * Returns books sorted by updatedAt DESC, createdAt DESC
   */
  getBooksByLibrary: async (libraryId: string): Promise<BookShort[]> => {
    const response = await apiClient.get<Response<BookShort[]>>(`/v1/library/${libraryId}/books`);
    return response.data;
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
