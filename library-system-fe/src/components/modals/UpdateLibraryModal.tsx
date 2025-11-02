import type { Library } from '../../types/api';
import LibraryFormModal from './LibraryFormModal';

interface UpdateLibraryModalProps {
  onClose: () => void;
  library: Library;
}

export default function UpdateLibraryModal({ onClose, library }: UpdateLibraryModalProps) {
  return <LibraryFormModal onClose={onClose} library={library} mode="update" />;
}
