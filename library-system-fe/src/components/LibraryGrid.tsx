import { useState } from 'react';
import { Plus, Lock, Globe } from 'lucide-react';
import { Button } from './ui/button';
import LibraryCard from './LibraryCard';
import type { User, Library } from '../App';

interface LibraryGridProps {
  user: User | null;
  onAddLibrary: () => void;
  onAddBook: (library: Library) => void;
  onViewLibrary: (library: Library) => void;
}

// Mock data
const mockLibraries: Library[] = [
  {
    id: 1,
    name: 'Science Fiction Collection',
    description: 'My favorite sci-fi novels and series',
    privacyStatus: 'PUBLIC',
    bookCount: 24,
    owner: { id: 1, name: 'Erikas Lau' },
  },
  {
    id: 2,
    name: 'Classic Literature',
    description: 'Timeless classics from around the world',
    privacyStatus: 'PUBLIC',
    bookCount: 18,
    owner: { id: 1, name: 'Erikas Lau' },
  },
  {
    id: 3,
    name: 'Personal Reading List',
    description: 'Books I want to read this year',
    privacyStatus: 'PRIVATE',
    bookCount: 12,
    owner: { id: 1, name: 'Erikas Lau' },
  },
];

export default function LibraryGrid({ user, onAddLibrary, onAddBook, onViewLibrary }: LibraryGridProps) {
  const [filter, setFilter] = useState<'ALL' | 'PUBLIC' | 'PRIVATE'>('ALL');

  const filteredLibraries = mockLibraries.filter((lib) => {
    if (filter === 'ALL') return true;
    return lib.privacyStatus === filter;
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b-2 border-border/50">
        <div>
          <h1 className="text-foreground mb-2">My Libraries</h1>
          <p className="text-muted-foreground">
            Manage your book collections and discover new reads
          </p>
        </div>
        <Button
          onClick={onAddLibrary}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Library
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            filter === 'ALL'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          All Libraries
        </button>
        <button
          onClick={() => setFilter('PUBLIC')}
          className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
            filter === 'PUBLIC'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <Globe className="w-4 h-4" />
          Public
        </button>
        <button
          onClick={() => setFilter('PRIVATE')}
          className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
            filter === 'PRIVATE'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <Lock className="w-4 h-4" />
          Private
        </button>
      </div>

      {/* Libraries Grid */}
      {filteredLibraries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLibraries.map((library) => (
            <LibraryCard
              key={library.id}
              library={library}
              user={user}
              onAddBook={onAddBook}
              onViewLibrary={onViewLibrary}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/30 rounded-xl border-2 border-dashed border-border">
          <p className="text-muted-foreground">
            No libraries found. Create your first library to get started!
          </p>
        </div>
      )}
    </div>
  );
}
