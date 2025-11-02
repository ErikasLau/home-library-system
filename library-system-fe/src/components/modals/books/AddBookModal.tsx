import BookFormModal from './BookFormModal';
import type { Library } from '../../../types/api';

interface AddBookModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  library: Library;
}

export default function AddBookModal({ onClose, onSuccess, library }: AddBookModalProps) {
  return <BookFormModal onClose={onClose} onSuccess={onSuccess} mode="create" library={library} />;
}
