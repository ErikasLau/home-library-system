// Library Service

import { apiClient } from './api-client';
import type {
  Response,
  Page,
  Library,
  LibraryRequest,
  PageableParams,
} from '../types/api';

export const libraryService = {
  /**
   * Get user's libraries (paginated)
   * GET /v1/library
   */
  getUserLibraries: async (params?: PageableParams): Promise<Page<Library>> => {
    const response = await apiClient.get<Response<Page<Library>>>('/v1/library', params);
    return response.data;
  },

  /**
   * Get all libraries (ADMIN only, paginated)
   * GET /v1/library/all
   */
  getAllLibraries: async (params?: PageableParams): Promise<Page<Library>> => {
    const response = await apiClient.get<Response<Page<Library>>>('/v1/library/all', params);
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
