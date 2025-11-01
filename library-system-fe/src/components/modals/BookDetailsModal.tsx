import { useState } from 'react';
import { X, Calendar, Hash, MessageCircle, Send, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner';
import type { Book, User, Comment } from '../../types';

interface BookDetailsModalProps {
  book: Book;
  user: User | null;
  onClose: () => void;
}

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

export default function BookDetailsModal({ book, user, onClose }: BookDetailsModalProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to comment');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-4xl my-8 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-muted to-muted/60 text-foreground p-6 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="mb-2">{book.title}</h2>
              <p className="text-muted-foreground">by {book.author}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-background/50 transition-all duration-300 hover:rotate-90"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Book Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="rounded-xl overflow-hidden shadow-lg bg-muted">
                <ImageWithFallback
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-auto object-cover"
                  style={{ maxWidth: '100%' }}
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {book.description}
                </p>
              </div>
              {book.isbn && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Hash className="w-4 h-4" />
                  <span>ISBN: {book.isbn}</span>
                </div>
              )}
              {book.publishedYear && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Published: {book.publishedYear}</span>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t-2 border-border pt-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h3>Comments ({comments.length})</h3>
            </div>

            {/* Add Comment Form */}
            {user ? (
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="space-y-3">
                  <Textarea
                    placeholder="Share your thoughts about this book..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="resize-none transition-all duration-300 focus:scale-[1.01]"
                  />
                  <Button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-md"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post Comment
                  </Button>
                </div>
              </form>
            ) : (
              <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border text-center">
                <p className="text-muted-foreground">
                  Please login to leave a comment
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm text-foreground">
                          {comment.author.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
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
                    <p className="text-sm text-foreground leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No comments yet. Be the first to share your thoughts!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
