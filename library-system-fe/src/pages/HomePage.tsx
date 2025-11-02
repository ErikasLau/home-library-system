import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Lock, Globe, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import LibraryCard from '../components/cards/LibraryCard';
import AddLibraryModal from '../components/modals/AddLibraryModal';
import { useAuth } from '../hooks/useAuth';
import { libraryService } from '../services';
import type { Library } from '../types/api';

type FilterType = 'ALL' | 'PUBLIC' | 'PRIVATE';

const FILTERS: { type: FilterType; label: string; Icon?: typeof Globe | typeof Lock }[] = [
  { type: 'ALL', label: 'All Libraries' },
  { type: 'PUBLIC', label: 'Public', Icon: Globe },
  { type: 'PRIVATE', label: 'Private', Icon: Lock },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [showAddLibraryModal, setShowAddLibraryModal] = useState(false);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchLibraries = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await libraryService.getUserLibraries({ page, size: 10 });
        setLibraries(response.content);
        setTotalPages(response.totalPages);
      } catch (err) {
        const apiError = err as { status?: number; message?: string };
        setError(apiError?.status === 401 ? 'Authentication failed. Please log in again.' : apiError?.message || 'Failed to load libraries');
      } finally {
        setLoading(false);
      }
    };

    fetchLibraries();
  }, [page, user]);

  const filteredLibraries = filter === 'ALL' ? libraries : libraries.filter(lib => lib.privacyStatus === filter);

  const handleCloseModal = () => {
    setShowAddLibraryModal(false);
    setPage(0);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b-2 border-border/50">
        <div>
          <h1 className="text-foreground mb-2">My Libraries</h1>
          <p className="text-muted-foreground">Manage your book collections and discover new reads</p>
        </div>
        <Button onClick={() => setShowAddLibraryModal(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
          <Plus className="w-4 h-4 mr-2" />
          Create Library
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(({ type, label, Icon }) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
              filter === type ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading libraries...</span>
        </div>
      )}

      {error && !loading && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
          <p className="font-semibold">Error loading libraries</p>
          <p className="text-sm">{error}</p>
          <Button onClick={() => setPage(0)} variant="outline" size="sm" className="mt-3">
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && filteredLibraries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLibraries.map(library => (
            <LibraryCard key={library.id} library={library} onAddBook={() => navigate(`/library/${library.id}/add-book`)} />
          ))}
        </div>
      )}

      {!loading && !error && filteredLibraries.length === 0 && (
        <div className="text-center py-16 bg-muted/30 rounded-xl border-2 border-dashed border-border">
          <p className="text-muted-foreground">
            {filter === 'ALL' ? 'No libraries found. Create your first library to get started!' : `No ${filter.toLowerCase()} libraries found.`}
          </p>
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} variant="outline" size="sm">
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {page + 1} of {totalPages}</span>
          <Button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} variant="outline" size="sm">
            Next
          </Button>
        </div>
      )}

      {showAddLibraryModal && <AddLibraryModal onClose={handleCloseModal} user={user} />}
    </div>
  );
}
