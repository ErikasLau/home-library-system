import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, MessageSquare, Star } from 'lucide-react';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { toast } from 'sonner';
import { commentService } from '../../../services';
import type { Book } from '../../../types/api';

const commentSchema = z.object({
  text: z.string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be less than 1000 characters'),
  rating: z.number().min(1, 'Please select a rating').max(5)
});

type CommentFormData = z.infer<typeof commentSchema>;

interface UpdateCommentModalProps {
  comment: Book['comments'][0];
  libraryId: string;
  bookId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateCommentModal({ 
  comment, 
  libraryId, 
  bookId, 
  onClose, 
  onSuccess 
}: UpdateCommentModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      text: comment.text,
      rating: comment.rating
    }
  });

  const rating = watch('rating');
  const text = watch('text');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isSubmitting, onClose]);

  const onSubmit = async (data: CommentFormData) => {
    try {
      await commentService.updateComment(libraryId, bookId, comment.id, data);
      toast.success('Comment updated successfully!');
      onSuccess();
    } catch (err) {
      const apiError = err as { message?: string };
      toast.error(apiError?.message || 'Failed to update comment');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={!isSubmitting ? onClose : undefined}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 border-2 border-black"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-black text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 bg-white rounded-lg">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold">
                Update Comment
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 rounded-lg hover:bg-white/20 transition-all duration-300 hover:rotate-90 disabled:opacity-50 disabled:hover:rotate-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-black font-semibold text-sm">
              Rating
            </Label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setValue('rating', star, { shouldValidate: true })}
                  className="transition-all duration-200 hover:scale-110 focus:outline-none"
                  disabled={isSubmitting}
                >
                  <Star 
                    className={`w-6 h-6 transition-colors ${
                      star <= rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300 hover:text-gray-400'
                    }`}
                  />
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-red-600 text-sm">{errors.rating.message}</p>
            )}
          </div>

          {/* Comment Text */}
          <div className="space-y-2">
            <Label htmlFor="text" className="text-black font-semibold text-sm">
              Comment
            </Label>
            <Textarea 
              id="text"
              placeholder="Share your thoughts about this book..." 
              {...register('text')}
              rows={4} 
              disabled={isSubmitting}
              className="resize-none bg-white border-2 border-gray-300 text-black placeholder:text-gray-400 focus-visible:border-gray-500 focus-visible:ring-gray-500/50"
            />
            <div className="flex items-center justify-between text-xs">
              {errors.text && (
                <p className="text-red-600">{errors.text.message}</p>
              )}
              <p className={`ml-auto ${text.length > 1000 ? 'text-red-600' : 'text-gray-500'}`}>
                {text.length}/1000
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              variant="outline"
              className="flex-1 border-2 border-gray-300 hover:bg-gray-100 transition-all duration-300 font-medium h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-black hover:bg-gray-800 text-white transition-all duration-300 hover:shadow-lg font-semibold h-11"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Updating...
                </span>
              ) : (
                'Update Comment'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
