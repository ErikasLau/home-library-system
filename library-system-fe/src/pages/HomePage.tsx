import { useState, useEffect } from 'react';
import { Plus, Lock, Globe, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import LibraryCard from '../components/cards/LibraryCard';
import AddLibraryModal from '../components/modals/AddLibraryModal';
import PageTitle from '../components/layout/PageTitle';
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
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [showAddLibraryModal, setShowAddLibraryModal] = useState(false);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
  }, [page, user, refreshTrigger]);

  const filteredLibraries = filter === 'ALL' ? libraries : libraries.filter(lib => lib.privacyStatus === filter);

  const handleCloseModal = () => {
    setShowAddLibraryModal(false);
  };

  const handleLibraryCreated = () => {
    setPage(0);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLibraryUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLibraryDeleted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <PageTitle
        title="My Libraries"
        description="Manage your book collections and discover new reads"
        action={
          <Button 
            onClick={() => setShowAddLibraryModal(true)}
            className="bg-black text-white hover:bg-gray-800 shadow-sm hover:shadow-md transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Library
          </Button>
        }
      />

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(({ type, label, Icon }) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2 font-medium text-sm cursor-pointer ${
              filter === type 
                ? 'bg-gray-900 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 bg-gray-50 rounded-lg">
          <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
          <span className="ml-3 text-gray-600 font-medium">Loading libraries...</span>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg">
          <p className="font-semibold text-lg mb-1">Error loading libraries</p>
          <p className="text-sm mb-3">{error}</p>
          <Button 
            onClick={() => setPage(0)} 
            variant="outline" 
            size="sm" 
            className="border-red-300 hover:bg-red-100"
          >
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && filteredLibraries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLibraries.map(library => (
            <LibraryCard 
              key={library.id} 
              library={library} 
              onLibraryUpdated={handleLibraryUpdated}
              onLibraryDeleted={handleLibraryDeleted}
            />
          ))}
        </div>
      )}

      {!loading && !error && filteredLibraries.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 text-lg">
            {filter === 'ALL' ? 'No libraries found. Create your first library to get started!' : `No ${filter.toLowerCase()} libraries found.`}
          </p>
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6 pb-2">
          <Button 
            onClick={() => setPage(p => Math.max(0, p - 1))} 
            disabled={page === 0} 
            variant="outline" 
            size="sm"
            className="shadow-sm"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600 font-medium px-3">
            Page {page + 1} of {totalPages}
          </span>
          <Button 
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} 
            disabled={page >= totalPages - 1} 
            variant="outline" 
            size="sm"
            className="shadow-sm"
          >
            Next
          </Button>
        </div>
      )}

      {showAddLibraryModal && <AddLibraryModal onClose={handleCloseModal} onSuccess={handleLibraryCreated} user={user} />}
    </div>
  );
}
