import { Plus, Lock, Globe, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { Library } from '../../types/api';

interface LibraryHeaderProps {
  library: Library;
  onAddBook: () => void;
}

export default function LibraryHeader({ library, onAddBook }: LibraryHeaderProps) {
  const isPrivate = library.privacyStatus === 'PRIVATE';
  const PrivacyIcon = isPrivate ? Lock : Globe;

  const handleShare = async () => {
    const url = `${window.location.origin}/library/${library.id}`;
    
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!', {
        description: 'Share this link with others to let them view your library.',
      });
    } catch {
      toast.error('Failed to copy link', {
        description: 'Please try again.',
      });
    }
  };

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div 
        className="p-6 md:p-8 border-b border-gray-200"
        style={{ 
          backgroundColor: headerBgColor
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">{library.title}</h1>
              <Badge 
                className={`flex items-center gap-1 self-center ${
                  isPrivate 
                    ? 'bg-red-100 text-red-800 border-red-300' 
                    : 'bg-green-100 text-green-800 border-green-300'
                }`}
              >
                <PrivacyIcon className="w-3 h-3" />
                {library.privacyStatus}
              </Badge>
            </div>
            <p className="text-base text-gray-600">{library.description}</p>
          </div>
          <div className="shrink-0 flex gap-2">
            {!isPrivate && (
              <Button 
                onClick={handleShare}
                variant="outline"
                className="bg-white text-gray-900 border-gray-300 hover:bg-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            )}
            <Button 
              onClick={onAddBook}
              className="bg-black text-white hover:bg-gray-800 shadow-sm hover:shadow-md transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Book
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
