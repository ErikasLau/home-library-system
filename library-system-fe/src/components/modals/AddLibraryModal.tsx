import { useState } from 'react';
import { X, Library, Lock, Globe, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { toast } from 'sonner';
import { libraryService } from '../../services';
import type { User } from '../../types/api';

interface AddLibraryModalProps {
  onClose: () => void;
  user: User | null;
}

export default function AddLibraryModal({ onClose }: AddLibraryModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [privacyStatus, setPrivacyStatus] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Library name is required');
      return;
    }

    try {
      setIsSubmitting(true);

      // Call the API to create the library
      await libraryService.createLibrary({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      toast.success('Library created successfully!');
      onClose();
    } catch (err) {
      console.error('Error creating library:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to create library');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-background rounded-lg">
                <Library className="w-5 h-5 text-primary" />
              </div>
              <h2>Create New Library</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-background/10 transition-all duration-300 hover:rotate-90"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="library-name" className="flex items-center gap-2">
              <Library className="w-4 h-4 text-muted-foreground" />
              Library Name
            </Label>
            <Input
              id="library-name"
              type="text"
              placeholder="e.g., Science Fiction Collection"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="transition-all duration-300 focus:scale-[1.02]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your library..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none transition-all duration-300 focus:scale-[1.02]"
            />
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              Privacy Settings
            </Label>
            <RadioGroup
              value={privacyStatus}
              onValueChange={(value) => setPrivacyStatus(value as 'PUBLIC' | 'PRIVATE')}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-accent/30 transition-all duration-300 cursor-pointer">
                <RadioGroupItem value="PUBLIC" id="public" />
                <Label htmlFor="public" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Globe className="w-4 h-4 text-primary" />
                  <div>
                    <div className="text-foreground">Public</div>
                    <div className="text-xs text-muted-foreground">Anyone can view this library</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-accent/30 transition-all duration-300 cursor-pointer">
                <RadioGroupItem value="PRIVATE" id="private" />
                <Label htmlFor="private" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Lock className="w-4 h-4 text-primary" />
                  <div>
                    <div className="text-foreground">Private</div>
                    <div className="text-xs text-muted-foreground">Only you can access this library</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 transition-all duration-300 hover:scale-105"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:scale-105"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Library'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
