import { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'danger'
}: ConfirmationModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const variantConfig = {
    danger: {
      buttonBg: 'bg-red-600',
      buttonHover: 'hover:bg-red-700'
    },
    warning: {
      buttonBg: 'bg-yellow-600',
      buttonHover: 'hover:bg-yellow-700'
    },
    info: {
      buttonBg: 'bg-black',
      buttonHover: 'hover:bg-gray-800'
    }
  };

  const config = variantConfig[variant];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={!isLoading ? onClose : undefined}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border-2 border-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-black text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 bg-white rounded-lg">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-white/20 transition-all duration-300 hover:rotate-90 disabled:opacity-50 disabled:hover:rotate-0 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6">
          <p className="text-gray-600 text-sm sm:text-base">{description}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 pt-0">
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="outline"
            className="flex-1 border-2 border-gray-300 hover:bg-gray-100 transition-all duration-300 font-medium h-11 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 ${config.buttonBg} ${config.buttonHover} text-white transition-all duration-300 hover:shadow-lg font-semibold h-11 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
