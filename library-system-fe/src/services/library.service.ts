import { apiClient } from './api-client';
import type {
  Response,
  Library,
  LibraryRequest,
} from '../types/api';

export const libraryService = {
  getUserLibraries: async (): Promise<Library[]> => {
    const response = await apiClient.get<Response<Library[]>>('/v1/library');
    return response.data;
  },

  getAllLibraries: async (): Promise<Library[]> => {
    const response = await apiClient.get<Response<Library[]>>('/v1/library/all');
    return response.data;
  },

  getLibraryById: async (id: string): Promise<Library> => {
    const response = await apiClient.get<Response<Library>>(`/v1/library/${id}`);
    return response.data;
  },

  createLibrary: async (data: LibraryRequest): Promise<Library> => {
    const response = await apiClient.post<Response<Library>>('/v1/library', data);
    return response.data;
  },

  updateLibrary: async (id: string, data: LibraryRequest): Promise<Library> => {
    const response = await apiClient.put<Response<Library>>(`/v1/library/${id}`, data);
    return response.data;
  },

  deleteLibrary: async (id: string): Promise<string> => {
    const response = await apiClient.delete<Response<string>>(`/v1/library/${id}`);
    return response.data;
  },
};
