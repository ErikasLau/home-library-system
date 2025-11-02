import { Link } from 'react-router';
import { Lock, Globe, BookOpen, Plus, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { Library } from '../../types/api';

interface LibraryCardProps {
  library: Library;
  onAddBook: () => void;
}

export default function LibraryCard({ library, onAddBook }: LibraryCardProps) {
  const isPrivate = library.privacyStatus === 'PRIVATE';
  const headerBg = isPrivate ? 'bg-gradient-to-br from-secondary/50 to-secondary/30' : 'bg-gradient-to-br from-accent/50 to-accent/30';
  const PrivacyIcon = isPrivate ? Lock : Globe;

  return (
    <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className={`p-6 ${headerBg}`}>
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-card-foreground flex-1">{library.title}</h3>
          <Badge variant={isPrivate ? 'secondary' : 'outline'} className="flex items-center gap-1">
            <PrivacyIcon className="w-3 h-3" />
            {library.privacyStatus}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{library.description}</p>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <BookOpen className="w-4 h-4" />
          <span>Library</span>
        </div>
      </div>

      <div className="p-6 space-y-3">
        <Link to={`/library/${library.id}`} className="block">
          <Button variant="default" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105">
            <Eye className="w-4 h-4 mr-2" />
            View Books
          </Button>
        </Link>
        <Button onClick={onAddBook} variant="outline" className="w-full transition-all duration-300 hover:scale-105">
          <Plus className="w-4 h-4 mr-2" />
          Add Book
        </Button>
      </div>
    </div>
  );
}
