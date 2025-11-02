import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';
import UpdateBookModal from '../modals/books/UpdateBookModal';
import ConfirmationModal from '../modals/shared/ConfirmationModal';
import { bookService } from '../../services';
import type { BookShort, Library } from '../../types/api';

interface BookCardProps {
  book: BookShort;
  library: Library;
  onClick: () => void;
  index?: number;
  onBookUpdated?: () => void;
  onBookDeleted?: () => void;
}

export default function BookCard({ book, library, onClick, index = 0, onBookUpdated, onBookDeleted }: BookCardProps) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const releaseYear = book.releaseDate ? new Date(book.releaseDate).getFullYear() : null;
  const badgeText = [book.language, releaseYear].filter(Boolean).join(' • ');

  const handleUpdateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowUpdateModal(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    onBookUpdated?.();
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await bookService.deleteBook(library.id, book.id);
      toast.success('Book deleted successfully');
      setShowDeleteModal(false);
      onBookDeleted?.();
    } catch (error) {
      const apiError = error as { message?: string };
      toast.error('Failed to delete book', {
        description: apiError.message || 'Please try again.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        className="group cursor-pointer bg-white rounded-lg border border-gray-200 overflow-hidden hover:bg-gray-50 transition-colors duration-200 flex flex-col max-w-xs mx-auto w-full"
        style={{ animationDelay: `${index * 50}ms`, animationDuration: '500ms' }}
      >
        <div className="aspect-2/3 overflow-hidden bg-gray-100 relative border-b border-gray-200" onClick={onClick}>
          <div className="absolute inset-0 bg-linear-to-b from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none h-24" />
          
          <ImageWithFallback
            src={book.coverImageUrl || undefined}
            alt={book.title}
            className="w-full h-full object-cover object-center"
          />
          
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <Button
              onClick={handleUpdateClick}
              className="p-0 w-8 h-8 bg-white/90 text-gray-800 hover:bg-white shadow-sm hover:shadow-md transition-all backdrop-blur-sm"
              title="Update book"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              onClick={handleDeleteClick}
              className="p-0 w-8 h-8 bg-red-500/90 text-white hover:bg-red-600 shadow-sm hover:shadow-md transition-all backdrop-blur-sm"
              title="Delete book"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
          
          {badgeText && (
            <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
              {badgeText}
            </div>
          )}
        </div>
        
        <div className="p-4" onClick={onClick}>
          <p className="text-sm text-gray-600 line-clamp-1 mb-1">{book.author}</p>
          <h4 className="text-base font-medium text-gray-900 group-hover:text-gray-700 transition-colors duration-200 line-clamp-2">
            {book.title}
          </h4>
        </div>
      </div>

      {showUpdateModal && (
        <UpdateBookModal 
          onClose={() => setShowUpdateModal(false)}
          bookId={book.id}
          library={library}
          onSuccess={handleUpdateSuccess}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Book"
        description={`Are you sure you want to delete "${book.title}"? This action cannot be undone and will remove all comments on this book.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        variant="danger"
      />
    </>
  );
}
