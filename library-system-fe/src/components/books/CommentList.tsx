import { useState } from 'react';
import { Star, MessageSquare, User } from 'lucide-react';
import { CommentDetailsModal } from '../modals/comments';
import type { Book } from '../../types/api';

interface CommentListProps {
  comments: Book['comments'];
  currentUserId?: string;
  libraryId: string;
  bookId: string;
  onDeleteComment: (commentId: string) => void;
  onUpdateComment: () => void;
}

const trimText = (text: string, maxLength: number = 150) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export default function CommentList({ 
  comments, 
  currentUserId, 
  libraryId, 
  bookId, 
  onDeleteComment, 
  onUpdateComment 
}: CommentListProps) {
  const [selectedComment, setSelectedComment] = useState<Book['comments'][0] | null>(null);

  if (comments.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p className="text-gray-600 font-medium">No comments yet</p>
        <p className="text-gray-500 text-sm mt-1">Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comments.map((comment) => (
          <div 
            key={comment.id} 
            onClick={() => setSelectedComment(comment)}
            className="p-5 bg-white border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <p className="font-semibold text-sm text-gray-900">{comment.user.username}</p>
              </div>
              {comment.rating > 0 && (
                <div className="flex items-center gap-1">
                  {[...Array(comment.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              )}
            </div>
            <p className="text-gray-700 leading-relaxed text-sm">
              {trimText(comment.text)}
            </p>
            <div className="mt-3 text-xs text-gray-500 group-hover:text-gray-700 transition-colors font-medium">
              Click to view details
            </div>
          </div>
        ))}
      </div>

      {selectedComment && (
        <CommentDetailsModal
          comment={selectedComment}
          currentUserId={currentUserId}
          libraryId={libraryId}
          bookId={bookId}
          onClose={() => setSelectedComment(null)}
          onDelete={onDeleteComment}
          onUpdate={onUpdateComment}
        />
      )}
    </>
  );
}
