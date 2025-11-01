import { useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router';
import { ArrowLeft, Calendar, Hash, MessageCircle, Send, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';
import type { Book, User, Comment } from '../types';

interface OutletContext {
  user: User | null;
  onLoginRequired: () => void;
}

// Mock book data
const mockBook: Book = {
  id: 1,
  title: 'Dune',
  author: 'Frank Herbert',
  isbn: '0441013597',
  publishedYear: 1965,
  description: 'A stunning blend of adventure and mysticism, environmentalism and politics. Set in the distant future amidst a sprawling feudal interstellar empire, Dune tells the story of young Paul Atreides as he and his family relocate to the desert planet Arrakis, the only source of the most valuable substance in the universe.',
  coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
  commentsCount: 5,
  libraryId: 1,
};

// Mock comments
const mockComments: Comment[] = [
  {
    id: 1,
    text: 'Absolutely amazing! One of the best sci-fi novels I\'ve ever read. The world-building is incredible.',
    author: { id: 1, name: 'Erikas Lau' },
    createdAt: '2025-10-15T14:30:00Z',
    bookId: 1,
  },
  {
    id: 2,
    text: 'A masterpiece that defined a genre. The political intrigue mixed with ecological themes is fascinating.',
    author: { id: 2, name: 'Sarah Connor' },
    createdAt: '2025-10-18T09:15:00Z',
    bookId: 1,
  },
  {
    id: 3,
    text: 'Started slow but became unputdownable. Can\'t wait to read the sequels!',
    author: { id: 3, name: 'John Doe' },
    createdAt: '2025-10-19T16:45:00Z',
    bookId: 1,
  },
];

export default function BookDetailsPage() {
  const { libraryId, bookId } = useParams();
  const navigate = useNavigate();
  const { user, onLoginRequired } = useOutletContext<OutletContext>();
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');

  // In a real app, fetch book data based on bookId
  const book = mockBook;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      onLoginRequired();
      return;
    }

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    const comment: Comment = {
      id: Date.now(),
      text: newComment,
      author: { id: user.id, name: user.name },
      createdAt: new Date().toISOString(),
      bookId: book.id,
    };

    setComments([comment, ...comments]);
    setNewComment('');
    toast.success('Comment added!');
  };

  const handleDeleteComment = (commentId: number) => {
    setComments(comments.filter(c => c.id !== commentId));
    toast.success('Comment deleted');
  };

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

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Back Button */}
      <button
        onClick={() => navigate(`/library/${libraryId}`)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-[-4px] group"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:scale-110" />
        <span>Back to Books</span>
      </button>

      {/* Book Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-card rounded-2xl p-8 border-2 border-border shadow-lg">
        <div className="md:col-span-1">
          <div className="rounded-xl overflow-hidden shadow-xl bg-muted sticky top-8">
            <ImageWithFallback
              src={book.coverUrl}
              alt={book.title}
              className="w-full h-auto object-cover"
              style={{ maxWidth: '100%' }}
            />
          </div>
        </div>
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="mb-2 text-foreground">{book.title}</h1>
            <p className="text-muted-foreground text-xl mb-4">by {book.author}</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {book.isbn && (
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">ISBN: {book.isbn}</span>
              </div>
            )}
            {book.publishedYear && (
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Published: {book.publishedYear}</span>
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-foreground">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {book.description}
            </p>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-card rounded-2xl p-8 border-2 border-border shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="w-6 h-6 text-primary" />
          <h2 className="text-foreground">Comments ({comments.length})</h2>
        </div>

        {/* Add Comment Form */}
        {user ? (
          <form onSubmit={handleAddComment} className="mb-8">
            <div className="space-y-3">
              <Textarea
                placeholder="Share your thoughts about this book..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                className="resize-none transition-all duration-300 focus:scale-[1.01]"
              />
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-md hover:scale-105"
              >
                <Send className="w-4 h-4 mr-2" />
                Post Comment
              </Button>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-6 bg-muted/50 rounded-xl border border-border text-center">
            <p className="text-muted-foreground">
              Please login to leave a comment
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div
                key={comment.id}
                className="p-6 bg-muted/30 rounded-xl border border-border hover:border-primary/50 transition-all duration-500 animate-in fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-foreground">
                      {comment.author.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                  {user && user.id === comment.author.id && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-300 hover:scale-110"
                      aria-label="Delete comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-foreground leading-relaxed">
                  {comment.text}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
