import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, MessageCircle, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import { BookInfo, CommentForm, CommentList } from '../components/books';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { bookService, commentService, libraryService } from '../services';
import type { Book, Library } from '../types/api';

export default function BookDetailsPage() {
  const { libraryId, bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { canAddComment } = usePermissions();
  const [book, setBook] = useState<Book | null>(null);
  const [library, setLibrary] = useState<Library | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);

  useEffect(() => {
    if (book) {
      document.title = `${book.title} - Home Library System`;
    }
  }, [book]);

  useEffect(() => {
    const fetchBook = async () => {
      if (!libraryId || !bookId) {
        setError('Invalid library or book ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setIsNotFound(false);
        setIsForbidden(false);
        const [bookData, libraryData] = await Promise.all([
          bookService.getBookById(libraryId, bookId),
          libraryService.getLibraryById(libraryId)
        ]);
        setBook(bookData);
        setLibrary(libraryData);
      } catch (err) {
        const apiError = err as { status?: number; message?: string };
        if (apiError?.status === 404) {
          setIsNotFound(true);
          setError('Book not found');
        } else if (apiError?.status === 403) {
          setIsForbidden(true);
          setError('Access denied');
        } else {
          setError(apiError?.message || 'Failed to load book details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [libraryId, bookId]);

  const handleAddComment = async (data: { text: string; rating: number }) => {
    if (!libraryId || !bookId) return;
    
    try {
      await commentService.createComment(libraryId, bookId, data);
      toast.success('Comment posted successfully!');
      
      const bookData = await bookService.getBookById(libraryId, bookId);
      setBook(bookData);
    } catch (err) {
      const apiError = err as { message?: string };
      toast.error(apiError?.message || 'Failed to post comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!libraryId || !bookId) return;
    
    try {
      await commentService.deleteComment(libraryId, bookId, commentId);
      toast.success('Comment deleted successfully!');
      
      const bookData = await bookService.getBookById(libraryId, bookId);
      setBook(bookData);
    } catch (err) {
      const apiError = err as { message?: string };
      toast.error(apiError?.message || 'Failed to delete comment');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-20 bg-gray-50 rounded-lg">
          <BookOpen className="w-8 h-8 animate-pulse text-gray-400 mr-3" />
          <span className="text-gray-600 font-medium">Loading book details...</span>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Link 
          to={`/library/${libraryId}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:-translate-x-1 group cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span className="font-medium">Back to Books</span>
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg animate-shake">
          {isForbidden ? (
            <>
              <p className="font-semibold text-lg mb-1">Access Denied</p>
              <p className="text-sm mb-3">
                You don't have permission to view this book.
              </p>
              <Button 
                onClick={() => navigate('/')} 
                variant="outline" 
                size="sm"
                className="border-red-300 hover:bg-red-100 active:scale-95 transition-transform"
              >
                Return to Home
              </Button>
            </>
          ) : isNotFound ? (
            <>
              <p className="font-semibold text-lg mb-1">Book Not Found</p>
              <p className="text-sm mb-3">
                The book you're looking for doesn't exist or has been removed.
              </p>
              <Button 
                onClick={() => navigate(`/library/${libraryId}`)} 
                variant="outline" 
                size="sm"
                className="border-red-300 hover:bg-red-100 active:scale-95 transition-transform"
              >
                Return to Library
              </Button>
            </>
          ) : (
            <>
              <p className="font-semibold text-lg mb-1">Error Loading Book</p>
              <p className="text-sm">{error || 'Book not found'}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      <Link 
        to={`/library/${libraryId}`}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:-translate-x-1 group cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:scale-110" />
        <span className="font-medium">Back to Books</span>
      </Link>

      <div className="bg-gray-50 rounded-lg p-6 md:p-8 border border-gray-200 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
        <BookInfo book={book} />
      </div>

      <div className="bg-gray-50 rounded-lg p-6 md:p-8 border border-gray-200 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="w-6 h-6 text-gray-900" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Comments ({book.comments.length})
          </h2>
        </div>

        {library && canAddComment(library) && (
          <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
            <CommentForm 
              onSubmit={handleAddComment} 
              isAuthenticated={!!user} 
            />
          </div>
        )}

        {library && !canAddComment(library) && user && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <p className="text-gray-600">Comments are disabled for private libraries unless you're the owner</p>
          </div>
        )}

        {library && (
          <CommentList 
            comments={book.comments} 
            library={library}
            libraryId={libraryId!}
            bookId={bookId!}
            onDeleteComment={handleDeleteComment}
            onUpdateComment={async () => {
              if (!libraryId || !bookId) return;
              const bookData = await bookService.getBookById(libraryId, bookId);
              setBook(bookData);
            }}
          />
        )}
      </div>
    </div>
  );
}
