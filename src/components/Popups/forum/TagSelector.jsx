import React, { useState } from "react";
import { X, Plus } from "lucide-react";

const availableTags = [
  "Grammar", "Vocabulary", "IELTS", "TOEIC", "Speaking", "Listening",
  "Writing", "Reading", "Pronunciation", "Business English", "Tips", "Resources"
];

export default function TagSelector({ value = [], onChange, maxTags = 3 }) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddTag = (tag) => {
    if (value.length < maxTags && !value.includes(tag)) {
      onChange([...value, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const suggestions = availableTags.filter(tag => !value.includes(tag));

  return (
    <div className="mb-6">
      <label className="block font-heading font-semibold text-dark-primary mb-2">
        🏷️ Tags (Chọn tối đa {maxTags})
        {value.length === 0 && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full font-medium text-sm font-body"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="hover:bg-primary-200 rounded-full p-0.5 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        
        {value.length < maxTags && (
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="inline-flex items-center gap-1 px-3 py-1.5 border-2 border-dashed border-gray-300 text-gray-500 hover:border-primary-600 hover:text-primary-600 rounded-full font-medium text-sm transition-colors font-body"
          >
            <Plus size={14} />
            Thêm tag
          </button>
        )}
      </div>

      {/* Validation Message */}
      {value.length === 0 && (
        <p className="text-xs text-red-500 mb-2 font-body">
          Vui lòng chọn ít nhất 1 tag
        </p>
      )}

      {/* Suggestions */}
      {(showSuggestions || value.length === 0) && suggestions.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-500 mb-2 font-semibold uppercase font-body">
            Gợi ý:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddTag(tag)}
                disabled={value.length >= maxTags}
                className="px-3 py-1 bg-white border border-gray-300 text-gray-700 hover:border-primary-600 hover:text-primary-600 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-body"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
