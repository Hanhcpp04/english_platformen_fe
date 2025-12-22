import React from 'react';
import { X } from 'lucide-react';

/**
 * AdminModal - Reusable modal component for admin pages
 * Strict Minimalist Design with improved spacing and larger width
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback when modal closes
 * @param {string} title - Modal title
 * @param {React.ReactNode} children - Modal content
 * @param {string} size - Modal size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
 */
const AdminModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'lg' 
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    'sm': 'max-w-md',
    'md': 'max-w-lg',
    'lg': 'max-w-2xl',
    'xl': 'max-w-4xl',
    '2xl': 'max-w-6xl',
    'full': 'max-w-7xl'
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
      <div 
        className={`bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200`}
      >
        {/* Header */}
        <div className="border-b border-zinc-200 px-6 sm:px-8 py-5 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-semibold text-zinc-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="px-6 sm:px-8 py-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
