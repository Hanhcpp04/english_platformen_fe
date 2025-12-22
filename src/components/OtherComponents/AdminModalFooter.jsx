import React from 'react';

/**
 * AdminModalFooter - Consistent footer for admin modals
 * 
 * @param {function} onCancel - Cancel button callback
 * @param {function} onSubmit - Submit button callback (if provided, wraps in form submit)
 * @param {string} submitText - Submit button text
 * @param {string} cancelText - Cancel button text
 * @param {boolean} isSubmitting - Shows loading state
 * @param {React.ReactNode} submitIcon - Icon for submit button
 */
const AdminModalFooter = ({ 
  onCancel, 
  onSubmit,
  submitText = 'Lưu', 
  cancelText = 'Hủy',
  isSubmitting = false,
  submitIcon = null
}) => {
  return (
    <div className="border-t border-zinc-200 px-6 sm:px-8 py-5 flex justify-end gap-3 bg-zinc-50">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="px-5 py-2.5 rounded-lg border border-zinc-300 text-sm font-medium text-zinc-700 hover:bg-white transition-colors disabled:opacity-50"
      >
        {cancelText}
      </button>
      <button
        type={onSubmit ? 'submit' : 'button'}
        onClick={onSubmit}
        disabled={isSubmitting}
        className="px-5 py-2.5 rounded-lg bg-zinc-900 text-white text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Đang lưu...</span>
          </>
        ) : (
          <>
            {submitIcon}
            <span>{submitText}</span>
          </>
        )}
      </button>
    </div>
  );
};

export default AdminModalFooter;
