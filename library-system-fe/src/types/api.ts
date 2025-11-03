export interface Response<T> {
  status: string;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface UserShort {
  id: string;
  username: string;
}
export interface RegistrationRequest {
  email: string;
  password: string;
  name: string;
  surname: string;
  username: string;
  dateOfBirth: string;
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
  dateOfBirth: string;
  role: 'MEMBER' | 'ADMIN' | 'MODERATOR';
}
export interface Library {
  id: string;
  title: string;
  description?: string;
  color?: string;
  privacyStatus: 'PUBLIC' | 'PRIVATE';
  isEditable: boolean;
  creator: UserShort;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryRequest {
  title: string;
  description?: string;
  color?: string;
  privacyStatus?: 'PUBLIC' | 'PRIVATE';
}

export interface BookShort {
  id: string;
  title: string;
  author: string;
  releaseDate: string;
  language: string;
  coverImageUrl: string | null;
  creator: UserShort;
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
  creator: UserShort;
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
  author?: string;
  isbn?: string;
  releaseDate?: string;
  description?: string;
  language?: string;
  pages?: number;
  publisher?: string;
  genre?: string;
  coverImageUrl?: string;
}

export interface BookUpdateRequest {
  title?: string;
  author?: string;
  isbn?: string;
  releaseDate?: string;
  description?: string;
  language?: string;
  pages?: number;
  publisher?: string;
  genre?: string;
  coverImageUrl?: string;
}
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
  text: string;
  rating: number;
}

export interface CommentUpdateRequest {
  text: string;
  rating?: number;
}

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
