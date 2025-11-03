import { useEffect, useState } from 'react';
import { X, Star, MessageSquare, User, Trash2, Pencil } from 'lucide-react';
import { Button } from '../../ui/button';
import { UpdateCommentModal } from '../comments';
import { usePermissions } from '../../../hooks/usePermissions';
import type { Book, Library } from '../../../types/api';

interface CommentDetailsModalProps {
  comment: Book['comments'][0];
  library: Library;
  libraryId: string;
  bookId: string;
  onClose: () => void;
  onDelete: (commentId: string) => void;
  onUpdate: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric'
  }) + ' at ' + date.toLocaleTimeString('en-US', { 
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export default function CommentDetailsModal({ 
  comment, 
  library,
  libraryId,
  bookId,
  onClose, 
  onDelete,
  onUpdate
}: CommentDetailsModalProps) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { canEditComment, canDeleteComment } = usePermissions();
  const canEdit = canEditComment(comment, library);
  const canDelete = canDeleteComment(comment, library);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    onClose();
    onUpdate();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 border-2 border-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-black text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 bg-white rounded-lg">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold">
                Comment Details
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/20 transition-all duration-300 hover:rotate-90"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* User Info */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-base text-gray-900">{comment.user.username}</p>
              <p className="text-sm text-gray-500">{formatDate(comment.createdAt)}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <p className="text-black font-semibold text-sm">Rating</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= comment.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600 font-medium">
                {comment.rating} out of 5
              </span>
            </div>
          </div>

          {/* Comment Text */}
          <div className="space-y-3">
            <p className="text-black font-semibold text-sm">Comment</p>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {comment.text}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 pt-0">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-2 border-gray-300 hover:bg-gray-100 transition-all duration-300 font-medium h-11"
          >
            Close
          </Button>
          {canEdit && (
            <Button
              onClick={() => setShowUpdateModal(true)}
              className="p-0 w-11 h-11 bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm hover:shadow-md transition-all"
              title="Update comment"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          )}
          {canDelete && (
            <Button
              onClick={() => {
                onDelete(comment.id);
                onClose();
              }}
              className="p-0 w-11 h-11 bg-red-100 text-red-600 hover:bg-red-200 shadow-sm hover:shadow-md transition-all"
              title="Delete comment"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {showUpdateModal && (
        <UpdateCommentModal
          comment={comment}
          libraryId={libraryId}
          bookId={bookId}
          onClose={() => setShowUpdateModal(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}
