import { ArrowLeft, Plus, Lock, Globe, BookOpen } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import type { Library, BookShort } from '../../types/api';

interface BooksListPageProps {
  library: Library;
  books: BookShort[];
  bookCount: number;
  onBack: () => void;
  onAddBook: () => void;
  onBookClick: (book: BookShort) => void;
}

export default function BooksListPage({ library, books, bookCount, onBack, onAddBook, onBookClick }: BooksListPageProps) {
  const isPrivate = library.privacyStatus === 'PRIVATE';
  const headerBg = isPrivate ? 'bg-gradient-to-br from-secondary/50 to-secondary/30' : 'bg-gradient-to-br from-accent/50 to-accent/30';
  const PrivacyIcon = isPrivate ? Lock : Globe;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-x-1 group">
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:scale-110" />
        <span>Back to Libraries</span>
      </button>

      <div className={`rounded-2xl p-8 ${headerBg} border-2 border-border shadow-lg`}>
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
              <span>{bookCount} books</span>
            </div>
          </div>
          <Button onClick={onAddBook} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
            <Plus className="w-4 h-4 mr-2" />
            Add Book
          </Button>
        </div>
      </div>

      <div>
        <h2 className="mb-6 text-foreground">Books Collection</h2>
        {books.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {books.map((book, index) => (
              <div
                key={book.id}
                onClick={() => onBookClick(book)}
                className="group cursor-pointer space-y-3 animate-in fade-in duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="aspect-2/3 rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-muted">
                  <ImageWithFallback src={book.coverImageUrl || undefined} alt={book.title} className="w-full h-full object-cover" style={{ maxWidth: '100%' }} />
                </div>
                <div>
                  <h4 className="text-sm text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">{book.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-xl border-2 border-dashed border-border">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No books in this library yet. Add your first book!</p>
          </div>
        )}
      </div>
    </div>
  );
}
