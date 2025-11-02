import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { BookOpen, User, Hash, Calendar, FileText, Image, Languages, FileDigit, Building, Tag } from 'lucide-react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

export interface BookFormData {
  title: string;
  author?: string;
  isbn?: string;
  releaseDate?: string;
  description?: string;
  language?: string;
  pages?: number;
  publisher?: string;
  genre?: string;
  coverImageUrl?: string;
}

interface BookFormFieldsProps {
  register: UseFormRegister<BookFormData>;
  errors: FieldErrors<BookFormData>;
}

export default function BookFormFields({ register, errors }: BookFormFieldsProps) {
  return (
    <>
      {/* Title - Required */}
      <div className="space-y-2">
        <Label htmlFor="title" className="flex items-center gap-2 text-black font-medium">
          <BookOpen className="w-4 h-4 text-gray-600" />
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="e.g., The Hitchhiker's Guide to the Galaxy"
          className="bg-white border-2 border-gray-300 text-black placeholder:text-gray-400 focus-visible:border-gray-500 focus-visible:ring-gray-500/50"
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Author */}
        <div className="space-y-2">
          <Label htmlFor="author" className="flex items-center gap-2 text-black font-medium">
            <User className="w-4 h-4 text-gray-600" />
            Author
          </Label>
          <Input
            id="author"
            {...register('author')}
            placeholder="e.g., Douglas Adams"
            className="bg-white border-2 border-gray-300 text-black placeholder:text-gray-400 focus-visible:border-gray-500 focus-visible:ring-gray-500/50"
          />
          {errors.author && (
            <p className="text-red-600 text-sm mt-1">{errors.author.message}</p>
          )}
        </div>

        {/* ISBN */}
        <div className="space-y-2">
          <Label htmlFor="isbn" className="flex items-center gap-2 text-black font-medium">
            <Hash className="w-4 h-4 text-gray-600" />
            ISBN
          </Label>
          <Input
            id="isbn"
            {...register('isbn')}
            placeholder="e.g., 978-0-345-39180-3"
            className="bg-white border-2 border-gray-300 text-black placeholder:text-gray-400 focus-visible:border-gray-500 focus-visible:ring-gray-500/50"
          />
          {errors.isbn && (
            <p className="text-red-600 text-sm mt-1">{errors.isbn.message}</p>
          )}
        </div>

        {/* Release Date */}
        <div className="space-y-2">
          <Label htmlFor="releaseDate" className="flex items-center gap-2 text-black font-medium">
            <Calendar className="w-4 h-4 text-gray-600" />
            Release Date
          </Label>
          <Input
            id="releaseDate"
            type="date"
            {...register('releaseDate')}
            className="bg-white border-2 border-gray-300 text-black placeholder:text-gray-400 focus-visible:border-gray-500 focus-visible:ring-gray-500/50"
          />
          {errors.releaseDate && (
            <p className="text-red-600 text-sm mt-1">{errors.releaseDate.message}</p>
          )}
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label htmlFor="language" className="flex items-center gap-2 text-black font-medium">
            <Languages className="w-4 h-4 text-gray-600" />
            Language
          </Label>
          <Input
            id="language"
            {...register('language')}
            placeholder="e.g., English"
            className="bg-white border-2 border-gray-300 text-black placeholder:text-gray-400 focus-visible:border-gray-500 focus-visible:ring-gray-500/50"
          />
          {errors.language && (
            <p className="text-red-600 text-sm mt-1">{errors.language.message}</p>
          )}
        </div>

        {/* Pages */}
        <div className="space-y-2">
          <Label htmlFor="pages" className="flex items-center gap-2 text-black font-medium">
            <FileDigit className="w-4 h-4 text-gray-600" />
            Pages
          </Label>
          <Input
            id="pages"
            type="number"
            {...register('pages', { valueAsNumber: true })}
            placeholder="e.g., 193"
            min="1"
            className="bg-white border-2 border-gray-300 text-black placeholder:text-gray-400 focus-visible:border-gray-500 focus-visible:ring-gray-500/50"
          />
          {errors.pages && (
            <p className="text-red-600 text-sm mt-1">{errors.pages.message}</p>
          )}
        </div>

        {/* Publisher */}
        <div className="space-y-2">
          <Label htmlFor="publisher" className="flex items-center gap-2 text-black font-medium">
            <Building className="w-4 h-4 text-gray-600" />
            Publisher
          </Label>
          <Input
            id="publisher"
            {...register('publisher')}
            placeholder="e.g., Pan Books"
            className="bg-white border-2 border-gray-300 text-black placeholder:text-gray-400 focus-visible:border-gray-500 focus-visible:ring-gray-500/50"
          />
          {errors.publisher && (
            <p className="text-red-600 text-sm mt-1">{errors.publisher.message}</p>
          )}
        </div>

        {/* Genre */}
        <div className="space-y-2">
          <Label htmlFor="genre" className="flex items-center gap-2 text-black font-medium">
            <Tag className="w-4 h-4 text-gray-600" />
            Genre
          </Label>
          <Input
            id="genre"
            {...register('genre')}
            placeholder="e.g., Science Fiction"
            className="bg-white border-2 border-gray-300 text-black placeholder:text-gray-400 focus-visible:border-gray-500 focus-visible:ring-gray-500/50"
          />
          {errors.genre && (
            <p className="text-red-600 text-sm mt-1">{errors.genre.message}</p>
          )}
        </div>

        {/* Cover Image URL */}
        <div className="space-y-2">
          <Label htmlFor="coverImageUrl" className="flex items-center gap-2 text-black font-medium">
            <Image className="w-4 h-4 text-gray-600" />
            Cover Image URL
          </Label>
          <Input
            id="coverImageUrl"
            type="url"
            {...register('coverImageUrl')}
            placeholder="https://example.com/cover.jpg"
            className="bg-white border-2 border-gray-300 text-black placeholder:text-gray-400 focus-visible:border-gray-500 focus-visible:ring-gray-500/50"
          />
          {errors.coverImageUrl && (
            <p className="text-red-600 text-sm mt-1">{errors.coverImageUrl.message}</p>
          )}
        </div>
      </div>

      {/* Description - Full Width */}
      <div className="space-y-2">
        <Label htmlFor="description" className="flex items-center gap-2 text-black font-medium">
          <FileText className="w-4 h-4 text-gray-600" />
          Description
        </Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="A brief description of the book..."
          rows={4}
          className="resize-none bg-white border-2 border-gray-300 text-black placeholder:text-gray-400 focus-visible:border-gray-500 focus-visible:ring-gray-500/50"
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>
    </>
  );
}
