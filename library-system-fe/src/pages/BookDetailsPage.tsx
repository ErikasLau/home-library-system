import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Calendar, Hash, MessageCircle, Send, Trash2, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { bookService } from '../services';
import type { Book } from '../types/api';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function BookDetailsPage() {
  const { libraryId, bookId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [newComment, setNewComment] = useState('');

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
        const bookData = await bookService.getBookById(libraryId, bookId);
        setBook(bookData);
      } catch (err) {
        const apiError = err as { status?: number; message?: string };
        if (apiError?.status === 404) {
          setIsNotFound(true);
          setError('Book not found');
        } else {
          setError(apiError?.message || 'Failed to load book details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [libraryId, bookId]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast.error('Please login to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    toast.info('API integration for adding comments coming soon');
    setNewComment('');
  };

  const handleDeleteComment = (commentId: string) => {
    toast.info(`Delete comment ${commentId} - API integration coming soon`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-pulse" />
            <p className="text-gray-600 font-medium">Loading book details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <button 
          onClick={() => navigate(`/library/${libraryId}`)} 
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Books</span>
        </button>
        <div className="text-center py-16 bg-red-50 rounded-lg border-2 border-red-200">
          {isNotFound ? (
            <>
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-red-300" />
              <h2 className="text-2xl font-semibold text-red-800 mb-2">Book Not Found</h2>
              <p className="text-gray-600 mb-4">The book you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate(`/library/${libraryId}`)} variant="outline">Return to Library</Button>
            </>
          ) : (
            <>
              <p className="text-red-800 font-semibold text-lg mb-2">Error Loading Book</p>
              <p className="text-gray-600">{error || 'Book not found'}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate(`/library/${libraryId}`)} 
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:-translate-x-1 group"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:scale-110" />
        <span className="font-medium">Back to Books</span>
      </button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white rounded-lg p-6 md:p-8 border border-gray-200 shadow-sm">
        <div className="md:col-span-1">
          <div className="rounded-lg overflow-hidden shadow-md bg-gray-100 sticky top-8">
            <ImageWithFallback src={book.coverImageUrl || undefined} alt={book.title} className="w-full h-auto object-cover" style={{ maxWidth: '100%' }} />
          </div>
        </div>
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-2 text-gray-900">{book.title}</h1>
            <p className="text-gray-600 text-xl mb-4">by {book.author}</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-md">
              <Hash className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">ISBN: {book.isbn}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-md">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{new Date(book.releaseDate).getFullYear()}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-md">
              <span className="text-sm text-gray-700">{book.language}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-md">
              <span className="text-sm text-gray-700">{book.pages} pages</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Description</h3>
            <p className="text-gray-600 leading-relaxed">{book.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Publisher</p>
              <p className="text-sm text-gray-900">{book.publisher}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Genre</p>
              <p className="text-sm text-gray-900">{book.genre}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 md:p-8 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="w-6 h-6 text-gray-900" />
          <h2 className="text-2xl font-semibold text-gray-900">Comments ({book.comments.length})</h2>
        </div>

        {user ? (
          <form onSubmit={handleAddComment} className="mb-8">
            <div className="space-y-3">
              <Textarea 
                placeholder="Share your thoughts about this book..." 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
                rows={4} 
                className="resize-none"
              />
              <Button type="submit" className="shadow-sm hover:shadow-md transition-shadow">
                <Send className="w-4 h-4 mr-2" />
                Post Comment
              </Button>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <p className="text-gray-600">Please login to leave a comment</p>
          </div>
        )}

        <div className="space-y-4">
          {book.comments.length > 0 ? (
            book.comments.map((comment, index) => (
              <div 
                key={comment.id} 
                className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 animate-in fade-in" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-gray-900">{comment.user.username}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(comment.createdAt)}</p>
                  </div>
                  {user && user.id === comment.user.id && (
                    <button 
                      onClick={() => handleDeleteComment(comment.id)} 
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200" 
                      aria-label="Delete comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-gray-700 leading-relaxed">{comment.text}</p>
                {comment.rating > 0 && (
                  <div className="mt-2 text-sm text-gray-600">Rating: {'⭐'.repeat(comment.rating)}</div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
