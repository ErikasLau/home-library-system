import { useState } from 'react';
import { Plus, Lock, Globe } from 'lucide-react';
import { Button } from '../ui/button';
import LibraryCard from '../cards/LibraryCard';
import type { User, Library } from '../../types/api';

interface LibraryGridProps {
  user: User | null;
  libraries: Library[];
  onAddLibrary: () => void;
  onAddBook: (library: Library) => void;
}

type FilterType = 'ALL' | 'PUBLIC' | 'PRIVATE';

const FILTERS: { type: FilterType; label: string; Icon?: typeof Globe | typeof Lock }[] = [
  { type: 'ALL', label: 'All Libraries' },
  { type: 'PUBLIC', label: 'Public', Icon: Globe },
  { type: 'PRIVATE', label: 'Private', Icon: Lock },
];

export default function LibraryGrid({ libraries, onAddLibrary, onAddBook }: LibraryGridProps) {
  const [filter, setFilter] = useState<FilterType>('ALL');
  
  const filteredLibraries = filter === 'ALL' ? libraries : libraries.filter(lib => lib.privacyStatus === filter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b-2 border-border/50">
        <div>
          <h1 className="text-foreground mb-2">My Libraries</h1>
          <p className="text-muted-foreground">Manage your book collections and discover new reads</p>
        </div>
        <Button onClick={onAddLibrary} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
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

      {filteredLibraries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLibraries.map(library => (
            <LibraryCard key={library.id} library={library} onAddBook={() => onAddBook(library)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/30 rounded-xl border-2 border-dashed border-border">
          <p className="text-muted-foreground">
            {filter === 'ALL' ? 'No libraries found. Create your first library to get started!' : `No ${filter.toLowerCase()} libraries found.`}
          </p>
        </div>
      )}
    </div>
  );
}
