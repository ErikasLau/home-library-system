import { useState } from 'react';
import { X, BookOpen, User, Hash, Calendar, FileText, Image } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import type { Library } from '../App';

interface AddBookModalProps {
  library: Library;
  onClose: () => void;
}

export default function AddBookModal({ library, onClose }: AddBookModalProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !author.trim()) {
      toast.error('Title and author are required');
      return;
    }

    // Mock API call
    const newBook = {
      title,
      author,
      isbn,
      publishedYear: publishedYear ? parseInt(publishedYear) : undefined,
      description,
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
      libraryId: library.id,
    };

    toast.success(`"${title}" added to ${library.name}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-background rounded-lg">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2>Add Book</h2>
                <p className="text-sm text-secondary-foreground/80 mt-1">to {library.name}</p>
              </div>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                Book Title *
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="e.g., Dune"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="transition-all duration-300 focus:scale-[1.02]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author" className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Author *
              </Label>
              <Input
                id="author"
                type="text"
                placeholder="e.g., Frank Herbert"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="transition-all duration-300 focus:scale-[1.02]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isbn" className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                ISBN
              </Label>
              <Input
                id="isbn"
                type="text"
                placeholder="e.g., 0441013597"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className="transition-all duration-300 focus:scale-[1.02]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                Published Year
              </Label>
              <Input
                id="year"
                type="number"
                placeholder="e.g., 1965"
                value={publishedYear}
                onChange={(e) => setPublishedYear(e.target.value)}
                min="1000"
                max="2100"
                className="transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover-url" className="flex items-center gap-2">
              <Image className="w-4 h-4 text-muted-foreground" />
              Cover Image URL
            </Label>
            <Input
              id="cover-url"
              type="url"
              placeholder="https://example.com/cover.jpg"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              className="transition-all duration-300 focus:scale-[1.02]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="book-description" className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Description
            </Label>
            <Textarea
              id="book-description"
              placeholder="Brief description of the book..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none transition-all duration-300 focus:scale-[1.02]"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 transition-all duration-300 hover:scale-105"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Add Book
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
