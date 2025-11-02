import type { Library } from '../../../types/api';
import LibraryFormModal from './LibraryFormModal';

interface UpdateLibraryModalProps {
  onClose: () => void;
  library: Library;
  onSuccess?: () => void;
}

export default function UpdateLibraryModal({ onClose, library, onSuccess }: UpdateLibraryModalProps) {
  return <LibraryFormModal onClose={onClose} library={library} mode="update" onSuccess={onSuccess} />;
}
