import { Calendar, Hash, Languages, FileText, Building2, BookType, User } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import type { Book } from '../../types/api';

interface BookInfoProps {
  book: Book;
}

export default function BookInfo({ book }: BookInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <div className="rounded-lg overflow-hidden bg-gray-100 sticky top-8 h-full min-h-[200px] md:min-h-[250px]">
          <ImageWithFallback 
            src={book.coverImageUrl || undefined} 
            alt={book.title} 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>

      <div className="md:col-span-2 space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold mb-2 text-gray-900">
            {book.title}
          </h1>
          {book.author && (
            <p className="text-gray-600 text-lg mb-2">by {book.author}</p>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <User className="w-4 h-4" />
            <span>Added by {book.creator.username}</span>
          </div>
          {book.description && (
            <p className="text-gray-600 leading-relaxed">{book.description}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {book.genre && (
            <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <BookType className="w-4 h-4 text-gray-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Genre</p>
                <p className="text-sm text-gray-900 font-medium">{book.genre}</p>
              </div>
            </div>
          )}
          {book.publisher && (
            <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Building2 className="w-4 h-4 text-gray-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Publisher</p>
                <p className="text-sm text-gray-900 font-medium">{book.publisher}</p>
              </div>
            </div>
          )}
          {book.releaseDate && (
            <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="w-4 h-4 text-gray-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Release Year</p>
                <p className="text-sm text-gray-900 font-medium">
                  {new Date(book.releaseDate).getFullYear()}
                </p>
              </div>
            </div>
          )}
          {book.language && (
            <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Languages className="w-4 h-4 text-gray-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Language</p>
                <p className="text-sm text-gray-900 font-medium">{book.language}</p>
              </div>
            </div>
          )}
          {book.pages != null && book.pages > 0 && (
            <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FileText className="w-4 h-4 text-gray-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Pages</p>
                <p className="text-sm text-gray-900 font-medium">{book.pages}</p>
              </div>
            </div>
          )}
          {book.isbn && (
            <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Hash className="w-4 h-4 text-gray-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">ISBN</p>
                <p className="text-sm text-gray-900 font-medium">{book.isbn}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
