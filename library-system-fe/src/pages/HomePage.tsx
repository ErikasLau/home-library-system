import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router';
import { Plus, Lock, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import LibraryCard from '../components/cards/LibraryCard';
import AddLibraryModal from '../components/modals/AddLibraryModal';
import type { User, Library } from '../types';

interface OutletContext {
  user: User | null;
  onLoginRequired: () => void;
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

export default function HomePage() {
  const navigate = useNavigate();
  const { user, onLoginRequired } = useOutletContext<OutletContext>();
  const [filter, setFilter] = useState<'ALL' | 'PUBLIC' | 'PRIVATE'>('ALL');
  const [showAddLibraryModal, setShowAddLibraryModal] = useState(false);

  const filteredLibraries = mockLibraries.filter((lib) => {
    if (filter === 'ALL') return true;
    return lib.privacyStatus === filter;
  });

  const handleAddLibrary = () => {
    if (!user) {
      onLoginRequired();
      return;
    }
    setShowAddLibraryModal(true);
  };

  const handleAddBook = (library: Library) => {
    if (!user) {
      onLoginRequired();
      return;
    }
    navigate(`/library/${library.id}/add-book`);
  };

  const handleViewLibrary = (library: Library) => {
    navigate(`/library/${library.id}`);
  };

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
          onClick={handleAddLibrary}
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
              onAddBook={handleAddBook}
              onViewLibrary={handleViewLibrary}
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

      {showAddLibraryModal && (
        <AddLibraryModal
          onClose={() => setShowAddLibraryModal(false)}
          user={user}
        />
      )}
    </div>
  );
}
