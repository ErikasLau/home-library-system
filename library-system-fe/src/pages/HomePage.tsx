import { useState, useEffect } from 'react';
import { Plus, Lock, Globe, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import LibraryCard from '../components/cards/LibraryCard';
import AddLibraryModal from '../components/modals/libraries/AddLibraryModal';
import PageTitle from '../components/layout/PageTitle';
import { useAuth } from '../hooks/useAuth';
import { libraryService } from '../services';
import type { Library } from '../types/api';

type FilterType = 'MY' | 'ALL';
type PrivacyFilterType = 'ALL' | 'PUBLIC' | 'PRIVATE';

const FILTERS: { type: FilterType; label: string; Icon?: typeof Globe | typeof Lock }[] = [
  { type: 'MY', label: 'My Libraries' },
  { type: 'ALL', label: 'Other Libraries' },
];

const PRIVACY_FILTERS: { type: PrivacyFilterType; label: string; Icon?: typeof Globe | typeof Lock }[] = [
  { type: 'ALL', label: 'All' },
  { type: 'PUBLIC', label: 'Public', Icon: Globe },
  { type: 'PRIVATE', label: 'Private', Icon: Lock },
];

export default function HomePage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterType>('MY');
  const [privacyFilter, setPrivacyFilter] = useState<PrivacyFilterType>('ALL');
  const [showAddLibraryModal, setShowAddLibraryModal] = useState(false);
  const [myLibraries, setMyLibraries] = useState<Library[]>([]);
  const [allLibraries, setAllLibraries] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        const [myLibs, allLibs] = await Promise.all([
          libraryService.getUserLibraries(),
          libraryService.getAllLibraries()
        ]);
        setMyLibraries(myLibs);
        setAllLibraries(allLibs);
      } catch (err) {
        const apiError = err as { status?: number; message?: string };
        setError(apiError?.status === 401 ? 'Authentication failed. Please log in again.' : apiError?.message || 'Failed to load libraries');
      } finally {
        setLoading(false);
      }
    };

    fetchLibraries();
  }, [user, refreshTrigger]);

  const getFilteredLibraries = () => {
    const baseLibraries = filter === 'MY' ? myLibraries : allLibraries;
    
    if (privacyFilter === 'ALL') {
      return baseLibraries;
    }
    
    return baseLibraries.filter(lib => lib.privacyStatus === privacyFilter);
  };

  const filteredLibraries = getFilteredLibraries();

  const handleCloseModal = () => {
    setShowAddLibraryModal(false);
  };

  const handleLibraryCreated = () => {
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

      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => {
                setFilter(type);
                setPrivacyFilter('ALL');
              }}
              className={`px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2 font-medium text-sm cursor-pointer ${
                filter === type 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {PRIVACY_FILTERS.map(({ type, label, Icon }) => (
            <button
              key={type}
              onClick={() => setPrivacyFilter(type)}
              className={`px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2 font-medium text-sm cursor-pointer ${
                privacyFilter === type 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {label}
            </button>
          ))}
        </div>
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
            onClick={() => setRefreshTrigger(prev => prev + 1)} 
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
            {filter === 'MY' 
              ? privacyFilter === 'ALL'
                ? 'No libraries found. Create your first library to get started!'
                : `No ${privacyFilter.toLowerCase()} libraries found.`
              : privacyFilter === 'ALL'
              ? 'No other libraries available yet.'
              : `No ${privacyFilter.toLowerCase()} libraries available yet.`}
          </p>
        </div>
      )}

      {showAddLibraryModal && <AddLibraryModal onClose={handleCloseModal} onSuccess={handleLibraryCreated} user={user} />}
    </div>
  );
}
