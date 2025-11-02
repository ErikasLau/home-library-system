// API Type Definitions

// Generic Response Wrapper
export interface Response<T> {
  status: string; // "OK", "ERROR", etc.
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

// Spring Page Response
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Pageable parameters
export interface PageableParams extends Record<string, string | number | boolean | undefined> {
  page?: number;
  size?: number;
  sort?: string;
}

// Authentication
export interface RegistrationRequest {
  email: string;
  password: string;
  name: string;
  surname: string;
  username: string;
  dateOfBirth: string; // Format: YYYY-MM-DD
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  pk: number;
  id: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  dateOfBirth: string; // Format: YYYY-MM-DD
  role: 'MEMBER' | 'ADMIN';
}

// Library
export interface Library {
  id: string;
  title: string;
  description?: string;
  color?: string;
  privacyStatus: 'PUBLIC' | 'PRIVATE';
  isEditable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryRequest {
  title: string;
  description?: string;
  color?: string;
  privacyStatus?: 'PUBLIC' | 'PRIVATE';
}

// Book
export interface BookShort {
  id: string;
  title: string;
  author: string;
  releaseDate: string;
  language: string;
  coverImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  releaseDate: string;
  description: string;
  language: string;
  pages: number;
  publisher: string;
  genre: string;
  coverImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  comments: CommentWithUser[];
}

export interface CommentWithUser {
  id: string;
  text: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
  };
}

export interface BookRequest {
  title: string;
  author: string;
  releaseDate: string; // Format: YYYY-MM-DD
  language: string;
  coverImageUrl?: string | null;
}

export interface BookUpdateRequest {
  title?: string;
  author?: string;
  releaseDate?: string; // Format: YYYY-MM-DD
  language?: string;
  coverImageUrl?: string | null;
}

// Comment
export interface Comment {
  id: string;
  content: string;
  bookId: string;
  userId: string;
  userName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommentRequest {
  content: string;
}

export interface CommentUpdateRequest {
  content: string;
}

// Error Response
export interface ApiError {
  message: string;
  status: number;
  success?: boolean;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
  details?: string;
  title?: string;
}
