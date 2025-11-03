import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { toast } from 'sonner';

const commentSchema = z.object({
  text: z.string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be less than 1000 characters'),
  rating: z.number().min(1, 'Please select a rating').max(5)
});

export type CommentFormData = z.infer<typeof commentSchema>;

interface CommentFormProps {
  onSubmit: (data: CommentFormData) => void;
  isAuthenticated: boolean;
}

export default function CommentForm({ onSubmit, isAuthenticated }: CommentFormProps) {
  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      text: '',
      rating: 0
    }
  });

  const rating = watch('rating');
  const text = watch('text');

  const handleFormSubmit = (data: CommentFormData) => {
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }
    onSubmit(data);
    reset();
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-600">Please login to leave a comment</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Star Rating */}
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

      <div className="flex justify-end">
        <Button 
          type="submit" 
          className="bg-gray-900 hover:bg-gray-800 text-white transition-colors font-semibold"
        >
          <Send className="w-4 h-4 mr-2" />
          Post Comment
        </Button>
      </div>
    </form>
  );
}
