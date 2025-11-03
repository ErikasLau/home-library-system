import { apiClient } from './api-client';
import type {
  Response,
  Book,
  BookShort,
  BookRequest,
  BookUpdateRequest,
} from '../types/api';

export const bookService = {
  getBooksByLibrary: async (libraryId: string): Promise<BookShort[]> => {
    const response = await apiClient.get<Response<BookShort[]>>(`/v1/library/${libraryId}/books`);
    return response.data;
  },

  getBookById: async (libraryId: string, bookId: string): Promise<Book> => {
    const response = await apiClient.get<Response<Book>>(
      `/v1/library/${libraryId}/books/${bookId}`
    );
    return response.data;
  },

  createBook: async (libraryId: string, data: BookRequest): Promise<Book> => {
    const response = await apiClient.post<Response<Book>>(
      `/v1/library/${libraryId}/books`,
      data
    );
    return response.data;
  },

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

  deleteBook: async (libraryId: string, bookId: string): Promise<string> => {
    const response = await apiClient.delete<Response<string>>(
      `/v1/library/${libraryId}/books/${bookId}`
    );
    return response.data;
  },
};
