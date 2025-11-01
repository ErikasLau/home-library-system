// Local application types

export interface User {
  id: number;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
}

export interface Library {
  id: number;
  name: string;
  description: string;
  privacyStatus: "PUBLIC" | "PRIVATE";
  bookCount: number;
  owner: { id: number; name: string };
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  publishedYear?: number;
  description: string;
  coverUrl: string;
  commentsCount: number;
  libraryId: number;
}

export interface Comment {
  id: number;
  text: string;
  author: { id: number; name: string };
  createdAt: string;
  bookId: number;
}
