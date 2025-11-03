import { useAuth } from './useAuth';
import type { Library, Book, CommentWithUser } from '../types/api';

export function usePermissions() {
  const { user } = useAuth();

  const canEditLibrary = (library: Library): boolean => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    return library.creator.id === user.id;
  };

  const canDeleteLibrary = (library: Library): boolean => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    return library.creator.id === user.id;
  };

  const canAddBook = (library: Library): boolean => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    if (library.creator.id === user.id) return true;
    return library.privacyStatus === 'PUBLIC';
  };

  const canEditBook = (book: Book | { creator: { id: string } }, library: Library): boolean => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    if (library.creator.id === user.id) return true;
    return book.creator.id === user.id;
  };

  const canDeleteBook = (book: Book | { creator: { id: string } }, library: Library): boolean => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    if (library.creator.id === user.id) return true;
    return book.creator.id === user.id;
  };

  const canAddComment = (library: Library): boolean => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    if (library.creator.id === user.id) return true;
    return library.privacyStatus === 'PUBLIC';
  };

  const canEditComment = (comment: CommentWithUser, library: Library): boolean => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    if (user.role === 'MODERATOR') return true;
    if (library.creator.id === user.id) return true;
    return comment.user.id === user.id;
  };

  const canDeleteComment = (comment: CommentWithUser, library: Library): boolean => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    if (user.role === 'MODERATOR') return true;
    if (library.creator.id === user.id) return true;
    return comment.user.id === user.id;
  };

  return {
    canEditLibrary,
    canDeleteLibrary,
    canAddBook,
    canEditBook,
    canDeleteBook,
    canAddComment,
    canEditComment,
    canDeleteComment,
  };
}
