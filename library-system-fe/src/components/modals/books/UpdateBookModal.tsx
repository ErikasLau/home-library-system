import type { Book, Library } from '../../../types/api';
import BookFormModal from './BookFormModal';

interface UpdateBookModalProps {
  onClose: () => void;
  book: Book;
  library: Library;
  onSuccess?: () => void;
}

export default function UpdateBookModal({ onClose, book, library, onSuccess }: UpdateBookModalProps) {
  return <BookFormModal onClose={onClose} book={book} library={library} mode="update" onSuccess={onSuccess} />;
}
