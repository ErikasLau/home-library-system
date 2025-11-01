import { MessageCircle } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import type { Book } from '../../types';

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

export default function BookCard({ book, onClick }: BookCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex gap-3 p-3 bg-background rounded-lg border border-border hover:border-primary hover:shadow-md transition-all duration-300 cursor-pointer group"
    >
      <div className="flex-shrink-0 w-16 h-24 rounded overflow-hidden bg-muted">
        <ImageWithFallback
          src={book.coverUrl}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          style={{ maxWidth: '100%' }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm text-foreground truncate group-hover:text-primary transition-colors duration-300">
          {book.title}
        </h4>
        <p className="text-xs text-muted-foreground mb-2">{book.author}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MessageCircle className="w-3 h-3" />
          <span>{book.commentsCount} comments</span>
        </div>
      </div>
    </div>
  );
}
