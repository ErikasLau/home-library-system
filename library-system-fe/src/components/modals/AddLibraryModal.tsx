import type { User } from '../../types/api';
import LibraryFormModal from './LibraryFormModal';

interface AddLibraryModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  user: User | null;
}

export default function AddLibraryModal({ onClose, onSuccess }: AddLibraryModalProps) {
  return <LibraryFormModal onClose={onClose} onSuccess={onSuccess} mode="create" />;
}
