import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Library as LibraryIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { libraryService } from '../../services';
import type { Library } from '../../types/api';
import LibraryFormFields from './LibraryFormFields';

const librarySchema = z.object({
  title: z.string()
    .min(1, 'Library title is required')
    .max(255, 'Title cannot exceed 255 characters'),
  description: z.string()
    .max(255, 'Description cannot exceed 255 characters'),
  color: z.string()
    .max(255, 'Color cannot exceed 255 characters')
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
  privacyStatus: z.enum(['PUBLIC', 'PRIVATE']),
  editable: z.boolean(),
});

export type LibraryFormData = z.infer<typeof librarySchema>;

interface LibraryFormModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  library?: Library;
  mode: 'create' | 'update';
}

export default function LibraryFormModal({ onClose, onSuccess, library, mode }: LibraryFormModalProps) {
  const isUpdate = mode === 'update';
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LibraryFormData>({
    resolver: zodResolver(librarySchema),
    mode: 'onChange',
    defaultValues: {
      title: library?.title || '',
      description: library?.description || '',
      color: library?.color || '#FF5733',
      privacyStatus: library?.privacyStatus || 'PUBLIC',
      editable: library?.isEditable ?? true,
    },
  });

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const onSubmit = async (data: LibraryFormData) => {
    try {
      if (isUpdate && library) {
        await libraryService.updateLibrary(library.id, {
          title: data.title.trim(),
          description: data.description?.trim() || undefined,
          color: data.color,
          privacyStatus: data.privacyStatus,
        });
        toast.success('Library updated successfully!');
      } else {
        await libraryService.createLibrary({
          title: data.title.trim(),
          description: data.description?.trim() || undefined,
          color: data.color,
          privacyStatus: data.privacyStatus,
        });
        toast.success('Library created successfully!');
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(`Error ${isUpdate ? 'updating' : 'creating'} library:`, err);
      toast.error(err instanceof Error ? err.message : `Failed to ${isUpdate ? 'update' : 'create'} library`);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 border-2 border-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-black text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 bg-white rounded-lg">
                <LibraryIcon className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold">
                {isUpdate ? 'Update Library' : 'Create New Library'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800 transition-all duration-300 hover:rotate-90"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto max-h-[calc(90vh-80px)]">
          <LibraryFormFields
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
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
                <span>{isUpdate ? 'Update Library' : 'Create Library'}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
