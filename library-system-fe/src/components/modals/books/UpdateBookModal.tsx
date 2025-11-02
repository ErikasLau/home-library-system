import { useState, useEffect } from 'react';
import { X, BookOpen, Loader2 } from 'lucide-react';
import type { Book, Library } from '../../../types/api';
import BookFormModal from './BookFormModal';
import { bookService } from '../../../services';

interface UpdateBookModalProps {
  onClose: () => void;
  bookId: string;
  library: Library;
  onSuccess?: () => void;
}

export default function UpdateBookModal({ onClose, bookId, library, onSuccess }: UpdateBookModalProps) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const bookData = await bookService.getBookById(library.id, bookId);
        setBook(bookData);
      } catch (err) {
        console.error('Error fetching book:', err);
        setError(err instanceof Error ? err.message : 'Failed to load book details');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [library.id, bookId]);

  if (loading) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border-2 border-black"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-black text-white p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                </div>
                <h2 className="text-lg sm:text-2xl font-bold">Loading Book...</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-800 transition-all duration-300 hover:rotate-90 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
            <span className="ml-3 text-gray-600 font-medium">Loading book details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border-2 border-black"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-black text-white p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                </div>
                <h2 className="text-lg sm:text-2xl font-bold">Error</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-800 transition-all duration-300 hover:rotate-90 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <p className="text-red-600 mb-4">{error || 'Failed to load book details'}</p>
            <button
              onClick={onClose}
              className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <BookFormModal onClose={onClose} book={book} library={library} mode="update" onSuccess={onSuccess} />;
}
