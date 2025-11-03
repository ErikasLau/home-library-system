// Library Service

import { apiClient } from './api-client';
import type {
  Response,
  Library,
  LibraryRequest,
} from '../types/api';

export const libraryService = {
  /**
   * Get user's libraries
   * GET /v1/library
   * Returns libraries sorted by updatedAt DESC, createdAt DESC
   */
  getUserLibraries: async (): Promise<Library[]> => {
    const response = await apiClient.get<Response<Library[]>>('/v1/library');
    return response.data;
  },

  /**
   * Get all libraries (ADMIN only)
   * GET /v1/library/all
   * Returns libraries sorted by updatedAt DESC, createdAt DESC
   */
  getAllLibraries: async (): Promise<Library[]> => {
    const response = await apiClient.get<Response<Library[]>>('/v1/library/all');
    return response.data;
  },

  /**
   * Get library by ID
   * GET /v1/library/{id}
   */
  getLibraryById: async (id: string): Promise<Library> => {
    const response = await apiClient.get<Response<Library>>(`/v1/library/${id}`);
    return response.data;
  },

  /**
   * Create a new library
   * POST /v1/library
   */
  createLibrary: async (data: LibraryRequest): Promise<Library> => {
    const response = await apiClient.post<Response<Library>>('/v1/library', data);
    return response.data;
  },

  /**
   * Update library
   * PUT /v1/library/{id}
   */
  updateLibrary: async (id: string, data: LibraryRequest): Promise<Library> => {
    const response = await apiClient.put<Response<Library>>(`/v1/library/${id}`, data);
    return response.data;
  },

  /**
   * Delete library
   * DELETE /v1/library/{id}
   */
  deleteLibrary: async (id: string): Promise<string> => {
    const response = await apiClient.delete<Response<string>>(`/v1/library/${id}`);
    return response.data;
  },
};
