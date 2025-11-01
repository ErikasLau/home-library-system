import { useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router';
import { ArrowLeft, Plus, Lock, Globe, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import AddBookModal from '../components/modals/AddBookModal';
import type { Library, User, Book } from '../types';

interface OutletContext {
  user: User | null;
  onLoginRequired: () => void;
}

// Mock library data
const mockLibrary: Library = {
  id: 1,
  name: 'Science Fiction Collection',
  description: 'My favorite sci-fi novels and series',
  privacyStatus: 'PUBLIC',
  bookCount: 24,
  owner: { id: 1, name: 'Erikas Lau' },
};

// Mock books data
const mockBooks: Book[] = [
  {
    id: 1,
    title: 'Dune',
    author: 'Frank Herbert',
    isbn: '0441013597',
    publishedYear: 1965,
    description: 'A stunning blend of adventure and mysticism, environmentalism and politics.',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    commentsCount: 5,
    libraryId: 1,
  },
  {
    id: 2,
    title: 'Foundation',
    author: 'Isaac Asimov',
    isbn: '0553293354',
    publishedYear: 1951,
    description: 'The first novel in Isaac Asimov\'s seminal Foundation series.',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    commentsCount: 3,
    libraryId: 1,
  },
  {
    id: 3,
    title: 'Neuromancer',
    author: 'William Gibson',
    isbn: '0441569595',
    publishedYear: 1984,
    description: 'The book that defined the cyberpunk movement.',
    coverUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
    commentsCount: 7,
    libraryId: 1,
  },
  {
    id: 4,
    title: 'The Left Hand of Darkness',
    author: 'Ursula K. Le Guin',
    isbn: '0441478123',
    publishedYear: 1969,
    description: 'A groundbreaking work of science fiction.',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    commentsCount: 4,
    libraryId: 1,
  },
  {
    id: 5,
    title: 'Snow Crash',
    author: 'Neal Stephenson',
    isbn: '0553380958',
    publishedYear: 1992,
    description: 'A mind-altering romp through a future America.',
    coverUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop',
    commentsCount: 6,
    libraryId: 1,
  },
  {
    id: 6,
    title: 'The Dispossessed',
    author: 'Ursula K. Le Guin',
    isbn: '0061054887',
    publishedYear: 1974,
    description: 'An ambiguous utopia exploring anarchism and capitalism.',
    coverUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
    commentsCount: 2,
    libraryId: 1,
  },
];

export default function LibraryBooksPage() {
  const { libraryId } = useParams();
  const navigate = useNavigate();
  const { user, onLoginRequired } = useOutletContext<OutletContext>();
  const [showAddBookModal, setShowAddBookModal] = useState(false);

  // In a real app, fetch library data based on libraryId
  const library = mockLibrary;
  const books = mockBooks;

  const isPrivate = library.privacyStatus === 'PRIVATE';

  const handleAddBook = () => {
    if (!user) {
      onLoginRequired();
      return;
    }
    setShowAddBookModal(true);
  };

  const handleBookClick = (book: Book) => {
    navigate(`/library/${libraryId}/book/${book.id}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-[-4px] group"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:scale-110" />
        <span>Back to Libraries</span>
      </button>

      {/* Library Header */}
      <div className={`rounded-2xl p-8 ${isPrivate ? 'bg-gradient-to-br from-secondary/50 to-secondary/30' : 'bg-gradient-to-br from-accent/50 to-accent/30'} border-2 border-border shadow-lg`}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-foreground">{library.name}</h1>
              <Badge
                variant={isPrivate ? 'secondary' : 'outline'}
                className="flex items-center gap-1"
              >
                {isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                {library.privacyStatus}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-4">
              {library.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{library.bookCount} books</span>
              </div>
              <div className="flex items-center gap-2">
                <span>By {library.owner.name}</span>
              </div>
            </div>
          </div>
          <Button
            onClick={handleAddBook}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Book
          </Button>
        </div>
      </div>

      {/* Books Grid */}
      <div>
        <h2 className="mb-6 text-foreground">Books Collection</h2>
        {books.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {books.map((book, index) => (
              <div
                key={book.id}
                onClick={() => handleBookClick(book)}
                className="group cursor-pointer space-y-3 animate-in fade-in duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-muted">
                  <ImageWithFallback
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    style={{ maxWidth: '100%' }}
                  />
                </div>
                <div>
                  <h4 className="text-sm text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {book.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {book.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-xl border-2 border-dashed border-border">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              No books in this library yet. Add your first book!
            </p>
          </div>
        )}
      </div>

      {showAddBookModal && (
        <AddBookModal
          library={library}
          onClose={() => setShowAddBookModal(false)}
        />
      )}
    </div>
  );
}
