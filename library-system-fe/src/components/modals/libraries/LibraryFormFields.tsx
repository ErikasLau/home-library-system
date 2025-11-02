import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { Library as LibraryIcon, FileText, Palette, Globe, Lock } from 'lucide-react';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Input } from '../../ui/input';
import type { LibraryFormData } from './LibraryFormModal';

const PRESET_COLORS = [
  '#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#F5FF33', 
  '#33FFF5', '#FF8C33', '#8C33FF', '#33FF8C'
];

interface LibraryFormFieldsProps {
  register: UseFormRegister<LibraryFormData>;
  errors: FieldErrors<LibraryFormData>;
  watch: UseFormWatch<LibraryFormData>;
  setValue: UseFormSetValue<LibraryFormData>;
}

export default function LibraryFormFields({ register, errors, watch, setValue }: LibraryFormFieldsProps) {
  const selectedColor = watch('color');
  const selectedPrivacy = watch('privacyStatus');

  return (
    <>
      {/* Title Field */}
      <div className="space-y-2">
        <Label htmlFor="title" className="flex items-center gap-2 text-black font-medium">
          <LibraryIcon className="w-4 h-4 text-gray-600" />
          Library Title
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="e.g., Science Fiction Collection"
          {...register('title')}
          className="bg-white border-2 border-gray-300 text-black placeholder:text-gray-400 focus-visible:border-gray-500 focus-visible:ring-gray-500/50"
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description" className="flex items-center gap-2 text-black font-medium">
          <FileText className="w-4 h-4 text-gray-600" />
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Describe your library..."
          {...register('description')}
          rows={3}
          className="resize-none bg-white border-2 border-gray-300 text-black placeholder:text-gray-400 focus-visible:border-gray-500 focus-visible:ring-gray-500/50"
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Color Picker */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-black font-medium">
          <Palette className="w-4 h-4 text-gray-600" />
          Library Color
        </Label>
        <div className="space-y-2">
          {errors.color && (
            <p className="text-red-600 text-sm">{errors.color.message}</p>
          )}
          
          {/* Preset Colors - Single Row */}
          <div className="grid grid-cols-9 gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setValue('color', color, { shouldValidate: true })}
                className={`w-full aspect-square rounded-lg border-2 transition-all duration-200 hover:scale-110 cursor-pointer ${
                  selectedColor === color ? 'border-black ring-2 ring-black ring-offset-2' : 'border-gray-300 hover:border-gray-500'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-black font-medium">
          Privacy Settings
        </Label>
        <RadioGroup
          value={selectedPrivacy}
          onValueChange={(value) => setValue('privacyStatus', value as 'PUBLIC' | 'PRIVATE', { shouldValidate: true })}
          className="space-y-2 sm:space-y-3 gap-1"
        >
          <div className={`flex items-center space-x-3 p-3 mb-2 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
            selectedPrivacy === 'PUBLIC' ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-500 hover:bg-gray-50'
          }`}>
            <RadioGroupItem value="PUBLIC" id="public" />
            <Label htmlFor="public" className="flex items-center gap-2 cursor-pointer flex-1">
              <Globe className="w-4 h-4 text-gray-700" />
              <div>
                <div className="text-black font-medium">Public</div>
                <div className="text-xs text-gray-600">Anyone can view this library</div>
              </div>
            </Label>
          </div>
          <div className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
            selectedPrivacy === 'PRIVATE' ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-500 hover:bg-gray-50'
          }`}>
            <RadioGroupItem value="PRIVATE" id="private" />
            <Label htmlFor="private" className="flex items-center gap-2 cursor-pointer flex-1">
              <Lock className="w-4 h-4 text-gray-700" />
              <div>
                <div className="text-black font-medium">Private</div>
                <div className="text-xs text-gray-600">Only you can access this library</div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </>
  );
}
