import { ImageWithFallback } from '../figma/ImageWithFallback';
import type { BookShort } from '../../types/api';

interface BookCardProps {
  book: BookShort;
  onClick: () => void;
}

export default function BookCard({ book, onClick }: BookCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex gap-3 p-3 bg-background rounded-lg border border-border hover:border-primary hover:shadow-md transition-all duration-300 cursor-pointer group"
    >
      <div className="shrink-0 w-16 h-24 rounded overflow-hidden bg-muted">
        <ImageWithFallback
          src={book.coverImageUrl || undefined}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          style={{ maxWidth: '100%' }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm text-foreground truncate group-hover:text-primary transition-colors duration-300">
          {book.title}
        </h4>
        <p className="text-xs text-muted-foreground">{book.author}</p>
      </div>
    </div>
  );
}
