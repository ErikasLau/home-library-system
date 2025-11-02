import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import BookCard from '../components/cards/BookCard';
import LibraryHeader from '../components/layout/LibraryHeader';
import AddBookModal from '../components/modals/AddBookModal';
import { bookService, libraryService } from '../services';
import type { Library, BookShort } from '../types/api';

export default function LibraryBooksPage() {
  const { libraryId } = useParams();
  const navigate = useNavigate();
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [library, setLibrary] = useState<Library | null>(null);
  const [books, setBooks] = useState<BookShort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [totalBooks, setTotalBooks] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!libraryId) {
        setError('Library ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setIsNotFound(false);
        const [libraryData, booksPage] = await Promise.all([
          libraryService.getLibraryById(libraryId),
          bookService.getBooksByLibrary(libraryId)
        ]);
        setLibrary(libraryData);
        setBooks(booksPage.content);
        setTotalBooks(booksPage.totalElements);
      } catch (err) {
        const apiError = err as { status?: number; message?: string };
        if (apiError?.status === 404) {
          setIsNotFound(true);
          setError('Library not found');
        } else {
          setError(apiError?.message || 'Failed to load library data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [libraryId]);

  const refetchBooks = async () => {
    if (!libraryId) return;
    const booksPage = await bookService.getBooksByLibrary(libraryId);
    setBooks(booksPage.content);
    setTotalBooks(booksPage.totalElements);
  };

  const handleCloseModal = () => {
    setShowAddBookModal(false);
    refetchBooks();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-20 bg-gray-50 rounded-lg">
          <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
          <span className="ml-3 text-gray-600 font-medium">Loading library...</span>
        </div>
      </div>
    );
  }

  if (error || !library) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Link 
          to="/"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:-translate-x-1 group cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span className="font-medium">Back to Libraries</span>
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg">
          {isNotFound ? (
            <>
              <p className="font-semibold text-lg mb-1">Library Not Found</p>
              <p className="text-sm mb-3">The library you're looking for doesn't exist or you don't have access to it.</p>
              <Button onClick={() => navigate('/')} variant="outline" size="sm" className="border-red-300 hover:bg-red-100">
                Return to Home
              </Button>
            </>
          ) : (
            <>
              <p className="font-semibold text-lg mb-1">Error Loading Library</p>
              <p className="text-sm">{error || 'Library not found'}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Link 
        to="/"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:-translate-x-1 group cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:scale-110" />
        <span className="font-medium">Back to Libraries</span>
      </Link>

      <LibraryHeader 
        library={library}
        onAddBook={() => setShowAddBookModal(true)}
      />

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Books Collection</h2>
          <span className="text-sm text-gray-600">
            {totalBooks} {totalBooks === 1 ? 'book' : 'books'} found
          </span>
        </div>
        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {books.map((book, index) => (
              <BookCard
                key={book.id}
                book={book}
                index={index}
                onClick={() => navigate(`/library/${libraryId}/book/${book.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg">No books in this library yet. Add your first book!</p>
          </div>
        )}
      </div>

      {showAddBookModal && library && <AddBookModal library={library} onClose={handleCloseModal} />}
    </div>
  );
}
