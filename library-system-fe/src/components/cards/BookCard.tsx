import { ImageWithFallback } from '../figma/ImageWithFallback';
import type { BookShort } from '../../types/api';

interface BookCardProps {
  book: BookShort;
  onClick: () => void;
  index?: number;
}

export default function BookCard({ book, onClick, index = 0 }: BookCardProps) {
  // Extract year from releaseDate (format: YYYY-MM-DD)
  const releaseYear = book.releaseDate ? new Date(book.releaseDate).getFullYear() : null;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-lg border border-gray-200 overflow-hidden hover:bg-gray-50 transition-colors duration-200 flex flex-col"
      style={{ animationDelay: `${index * 50}ms`, animationDuration: '500ms' }}
    >
      <div className="aspect-2/3 overflow-hidden bg-gray-100 relative border-b border-gray-200">
        <ImageWithFallback
          src={book.coverImageUrl || undefined}
          alt={book.title}
          className="w-full h-full object-cover"
          style={{ maxWidth: '100%' }}
        />
        {/* Language and Year Badge */}
        <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          {book.language} • {releaseYear || 'N/A'}
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 line-clamp-1 mb-1">{book.author}</p>
        <h4 className="text-base font-medium text-gray-900 group-hover:text-gray-700 transition-colors duration-200 line-clamp-2">
          {book.title}
        </h4>
      </div>
    </div>
  );
}
