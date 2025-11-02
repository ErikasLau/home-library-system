import { Link } from 'react-router';
import { Lock, Globe, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { Library } from '../../types/api';

interface LibraryCardProps {
  library: Library;
}

export default function LibraryCard({ library }: LibraryCardProps) {
  const isPrivate = library.privacyStatus === 'PRIVATE';
  const PrivacyIcon = isPrivate ? Lock : Globe;
  
  // Convert hex color to rgba with transparency
  const getTransparentColor = (color: string | undefined) => {
    if (!color) return 'rgb(249 250 251)'; // fallback to gray-50
    
    // Remove # if present
    const hex = color.replace('#', '');
    
    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, 0.15)`;
  };

  const headerBgColor = getTransparentColor(library.color);

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-colors duration-200 hover:bg-gray-50 flex flex-col h-full"
    >
      <div 
        className="p-6 border-b border-gray-200 flex-1"
        style={{ 
          backgroundColor: headerBgColor
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex-1">{library.title}</h3>
          <Badge 
            className={`flex items-center gap-1 ${
              isPrivate 
                ? 'bg-red-100 text-red-800 border-red-300' 
                : 'bg-green-100 text-green-800 border-green-300'
            }`}
          >
            <PrivacyIcon className="w-3 h-3" />
            {library.privacyStatus}
          </Badge>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2">{library.description}</p>
      </div>

      <div className="p-6">
        <Link to={`/library/${library.id}`} className="block">
          <Button 
            className="w-full bg-black text-white hover:bg-gray-800 shadow-sm hover:shadow-md transition-all"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Books
          </Button>
        </Link>
      </div>
    </div>
  );
}
