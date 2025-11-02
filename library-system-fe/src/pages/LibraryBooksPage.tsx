import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Plus, Lock, Globe, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
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
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-pulse" />
            <p className="text-gray-600 font-medium">Loading library...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !library) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:-translate-x-1 group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span className="font-medium">Back to Libraries</span>
        </button>
        <div className="text-center py-16 bg-red-50 rounded-lg border-2 border-red-200">
          {isNotFound ? (
            <>
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-red-300" />
              <h2 className="text-2xl font-semibold text-red-800 mb-2">Library Not Found</h2>
              <p className="text-gray-600 mb-4">The library you're looking for doesn't exist or you don't have access to it.</p>
              <Button onClick={() => navigate('/')} variant="outline">Return to Home</Button>
            </>
          ) : (
            <>
              <p className="text-red-800 font-semibold text-lg mb-2">Error Loading Library</p>
              <p className="text-gray-600">{error || 'Library not found'}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  const isPrivate = library.privacyStatus === 'PRIVATE';
  const headerBg = isPrivate ? 'bg-gradient-to-br from-secondary/50 to-secondary/30' : 'bg-gradient-to-br from-accent/50 to-accent/30';
  const PrivacyIcon = isPrivate ? Lock : Globe;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:-translate-x-1 group"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:scale-110" />
        <span className="font-medium">Back to Libraries</span>
      </button>

      <div className={`rounded-xl p-6 md:p-8 ${headerBg} border border-gray-200 shadow-sm`}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-foreground">{library.title}</h1>
              <Badge variant={isPrivate ? 'secondary' : 'outline'} className="flex items-center gap-1">
                <PrivacyIcon className="w-3 h-3" />
                {library.privacyStatus}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-4">{library.description}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span>{totalBooks} books</span>
            </div>
          </div>
          <Button 
            onClick={() => setShowAddBookModal(true)} 
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Book
          </Button>
        </div>
      </div>

      {/* Books Grid */}
      <div>
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">Books Collection</h2>
        {books.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {books.map((book, index) => (
              <div
                key={book.id}
                onClick={() => navigate(`/library/${libraryId}/book/${book.id}`)}
                className="group cursor-pointer space-y-3 animate-in fade-in duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="aspect-2/3 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-[1.02] bg-gray-100">
                  <ImageWithFallback src={book.coverImageUrl || undefined} alt={book.title} className="w-full h-full object-cover" style={{ maxWidth: '100%' }} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors duration-200 line-clamp-2">{book.title}</h4>
                  <p className="text-xs text-gray-600 line-clamp-1">{book.author}</p>
                </div>
              </div>
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
