import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, BookOpen } from 'lucide-react';
import { Button } from '../../ui/button';
import { toast } from 'sonner';
import { bookService } from '../../../services';
import type { Book, Library } from '../../../types/api';
import BookFormFields, { type BookFormData } from './BookFormFields';

const bookSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title cannot exceed 255 characters'),
  author: z.string()
    .max(255, 'Author cannot exceed 255 characters')
    .optional(),
  isbn: z.string()
    .max(255, 'ISBN cannot exceed 255 characters')
    .optional(),
  releaseDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional()
    .or(z.literal('')),
  description: z.string()
    .max(2000, 'Description cannot exceed 2000 characters')
    .optional(),
  language: z.string()
    .max(255, 'Language cannot exceed 255 characters')
    .optional(),
  pages: z.number()
    .int('Pages must be a whole number')
    .positive('Pages must be positive')
    .optional()
    .or(z.nan()),
  publisher: z.string()
    .max(255, 'Publisher cannot exceed 255 characters')
    .optional(),
  genre: z.string()
    .max(255, 'Genre cannot exceed 255 characters')
    .optional(),
  coverImageUrl: z.string()
    .max(255, 'Cover image URL cannot exceed 255 characters')
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
});

interface BookFormModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  book?: Book;
  library: Library;
  mode: 'create' | 'update';
}

export default function BookFormModal({ onClose, onSuccess, book, library, mode }: BookFormModalProps) {
  const isUpdate = mode === 'update';
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    mode: 'onChange',
    defaultValues: {
      title: book?.title || '',
      author: book?.author || '',
      isbn: book?.isbn || '',
      releaseDate: book?.releaseDate || '',
      description: book?.description || '',
      language: book?.language || '',
      pages: book?.pages || undefined,
      publisher: book?.publisher || '',
      genre: book?.genre || '',
      coverImageUrl: book?.coverImageUrl || '',
    },
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const onSubmit = async (data: BookFormData) => {
    try {
      const bookData = {
        title: data.title.trim(),
        author: data.author?.trim() || undefined,
        isbn: data.isbn?.trim() || undefined,
        releaseDate: data.releaseDate || undefined,
        description: data.description?.trim() || undefined,
        language: data.language?.trim() || undefined,
        pages: data.pages || undefined,
        publisher: data.publisher?.trim() || undefined,
        genre: data.genre?.trim() || undefined,
        coverImageUrl: data.coverImageUrl?.trim() || undefined,
      };

      if (isUpdate && book) {
        await bookService.updateBook(library.id, book.id, bookData);
        toast.success('Book updated successfully!');
      } else {
        await bookService.createBook(library.id, bookData);
        toast.success('Book created successfully!');
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(`Error ${isUpdate ? 'updating' : 'creating'} book:`, err);
      toast.error(err instanceof Error ? err.message : `Failed to ${isUpdate ? 'update' : 'create'} book`);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 border-2 border-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-black text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 bg-white rounded-lg">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold">
                  {isUpdate ? 'Update Book' : 'Add New Book'}
                </h2>
                <p className="text-sm text-white/80">to {library.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800 transition-all duration-300 hover:rotate-90 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto max-h-[calc(90vh-120px)]">
          <BookFormFields
            register={register}
            errors={errors}
          />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-2 border-gray-300 hover:bg-gray-100 transition-all duration-300 font-medium h-11 cursor-pointer"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:shadow-lg font-semibold h-11 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  {isUpdate ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                <span>{isUpdate ? 'Update Book' : 'Add Book'}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
