import { Lock, Globe, BookOpen, Plus, Eye, User } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { Library, User as UserType } from '../App';

interface LibraryCardProps {
  library: Library;
  user: UserType | null;
  onAddBook: (library: Library) => void;
  onViewLibrary: (library: Library) => void;
}

export default function LibraryCard({ library, user, onAddBook, onViewLibrary }: LibraryCardProps) {
  const isPrivate = library.privacyStatus === 'PRIVATE';

  return (
    <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Card Header */}
      <div className={`p-6 ${isPrivate ? 'bg-gradient-to-br from-secondary/50 to-secondary/30' : 'bg-gradient-to-br from-accent/50 to-accent/30'}`}>
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-card-foreground flex-1">{library.name}</h3>
          <Badge
            variant={isPrivate ? 'secondary' : 'outline'}
            className="flex items-center gap-1"
          >
            {isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
            {library.privacyStatus}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {library.description}
        </p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>{library.bookCount} books</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4" />
            <span className="text-xs">{library.owner.name}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-3">
        <Button
          onClick={() => onViewLibrary(library)}
          variant="default"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Books
        </Button>
        <Button
          onClick={() => onAddBook(library)}
          variant="outline"
          className="w-full transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Book
        </Button>
      </div>
    </div>
  );
}
