import { useState } from 'react';
import { Link } from 'react-router';
import { Lock, Globe, Eye, Pencil, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import UpdateLibraryModal from '../modals/libraries/UpdateLibraryModal';
import ConfirmationModal from '../modals/shared/ConfirmationModal';
import { libraryService } from '../../services';
import { usePermissions } from '../../hooks/usePermissions';
import type { Library } from '../../types/api';

interface LibraryCardProps {
  library: Library;
  onLibraryUpdated?: () => void;
  onLibraryDeleted?: () => void;
}

export default function LibraryCard({ library, onLibraryUpdated, onLibraryDeleted }: LibraryCardProps) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { canEditLibrary, canDeleteLibrary } = usePermissions();
  const isPrivate = library.privacyStatus === 'PRIVATE';
  const PrivacyIcon = isPrivate ? Lock : Globe;
  const canEdit = canEditLibrary(library);
  const canDelete = canDeleteLibrary(library);
  
  const getTransparentColor = (color: string | undefined) => {
    if (!color) return 'rgb(249 250 251)';
    
    const hex = color.replace('#', '');
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, 0.15)`;
  };

  const headerBgColor = getTransparentColor(library.color);

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    onLibraryUpdated?.();
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await libraryService.deleteLibrary(library.id);
      toast.success('Library deleted successfully');
      setShowDeleteModal(false);
      onLibraryDeleted?.();
    } catch (error) {
      const apiError = error as { message?: string };
      toast.error('Failed to delete library', {
        description: apiError.message || 'Please try again.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-colors duration-200 hover:bg-gray-50 flex flex-col h-full"
      >
        <div 
          className="p-6 border-b border-gray-200 flex-1"
          style={{ 
            backgroundColor: headerBgColor
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 flex-1">{library.title}</h3>
            <Badge 
              className={`flex items-center gap-1 ${
                isPrivate 
                  ? 'bg-red-100 text-red-800 border-red-300' 
                  : 'bg-green-100 text-green-800 border-green-300'
              }`}
            >
              <PrivacyIcon className="w-3 h-3" />
              {library.privacyStatus}
            </Badge>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{library.description}</p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <User className="w-3 h-3" />
            <span>{library.creator.username}</span>
          </div>
        </div>

        <div className="p-6 flex gap-2 items-center">
          <Link to={`/library/${library.id}`} className="flex-1">
            <Button 
              className="w-full bg-black text-white hover:bg-gray-800 shadow-sm hover:shadow-md transition-all"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Books
            </Button>
          </Link>
          {canEdit && (
            <Button
              onClick={() => setShowUpdateModal(true)}
              className="p-0 w-10 h-10 bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm hover:shadow-md transition-all"
              title="Update library"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          )}
          {canDelete && (
            <Button
              onClick={() => setShowDeleteModal(true)}
              className="p-0 w-10 h-10 bg-red-100 text-red-600 hover:bg-red-200 shadow-sm hover:shadow-md transition-all"
              title="Delete library"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {showUpdateModal && (
        <UpdateLibraryModal 
          onClose={() => setShowUpdateModal(false)}
          library={library}
          onSuccess={handleUpdateSuccess}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Library"
        description={`Are you sure you want to delete "${library.title}"? This action cannot be undone and will remove all books in this library.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        variant="danger"
      />
    </>
  );
}
