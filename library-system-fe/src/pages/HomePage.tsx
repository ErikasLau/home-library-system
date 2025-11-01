import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Lock, Globe, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import LibraryCard from '../components/cards/LibraryCard';
import AddLibraryModal from '../components/modals/AddLibraryModal';
import { useAuth } from '../hooks/useAuth';
import { libraryService } from '../services';
import type { Library } from '../types';
import type { Library as ApiLibrary } from '../types/api';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'ALL' | 'PUBLIC' | 'PRIVATE'>('ALL');
  const [showAddLibraryModal, setShowAddLibraryModal] = useState(false);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch libraries from API
  const fetchLibraries = useCallback(async () => {
    // Check if user is authenticated before making the request
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch user's libraries with pagination
      const response = await libraryService.getUserLibraries({
        page,
        size: 10
      });

      // Transform API libraries to local format
      const transformedLibraries: Library[] = response.content.map((apiLib: ApiLibrary) => ({
        id: parseInt(apiLib.id) || 0,
        name: apiLib.name,
        description: apiLib.description || '',
        privacyStatus: 'PUBLIC' as const, // Default since API doesn't have this field
        bookCount: 0, // This would need to be fetched separately or added to API
        owner: {
          id: typeof user?.id === 'number' ? user.id : 0,
          name: user?.name || 'Unknown'
        }
      }));

      setLibraries(transformedLibraries);
      setTotalPages(response.totalPages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load libraries';
      
      // Check if it's an authentication error
      const apiError = err as { status?: number };
      if (apiError?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [page, user]);

  useEffect(() => {
    fetchLibraries();
  }, [fetchLibraries]);

  const filteredLibraries = libraries.filter((lib) => {
    if (filter === 'ALL') return true;
    return lib.privacyStatus === filter;
  });

  const handleAddLibrary = () => {
    setShowAddLibraryModal(true);
  };

  const handleLibraryAdded = () => {
    // Refresh libraries after adding a new one
    fetchLibraries();
  };

  const handleAddBook = (library: Library) => {
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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading libraries...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
          <p className="font-semibold">Error loading libraries</p>
          <p className="text-sm">{error}</p>
          <Button
            onClick={fetchLibraries}
            variant="outline"
            size="sm"
            className="mt-3"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Libraries Grid */}
      {!loading && !error && filteredLibraries.length > 0 && (
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
      )}

      {/* Empty State */}
      {!loading && !error && filteredLibraries.length === 0 && (
        <div className="text-center py-16 bg-muted/30 rounded-xl border-2 border-dashed border-border">
          <p className="text-muted-foreground">
            {filter === 'ALL' 
              ? 'No libraries found. Create your first library to get started!'
              : `No ${filter.toLowerCase()} libraries found.`}
          </p>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            variant="outline"
            size="sm"
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}

      {showAddLibraryModal && (
        <AddLibraryModal
          onClose={() => {
            setShowAddLibraryModal(false);
            handleLibraryAdded();
          }}
          user={user}
        />
      )}
    </div>
  );
}
