import React, { useState, useRef, useEffect } from "react";
import { Smile, Send } from "lucide-react";

export default function CommentInput({ onSubmit, onCancel, placeholder = "Viết bình luận..." }) {
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="relative">
        <textarea
          ref={textareaRef}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent resize-none font-body"
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          style={{ minHeight: "48px", maxHeight: "200px" }}
        />
        
        {/* Emoji Button */}
        <button
          type="button"
          className="absolute right-3 top-3 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          title="Add emoji"
        >
          <Smile size={18} className="text-gray-400" />
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 font-body">
          Hỗ trợ @mention và markdown
        </span>
        
        <div className="flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors font-body"
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            disabled={!content.trim()}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-body"
          >
            <Send size={16} />
            Gửi
          </button>
        </div>
      </div>
    </form>
  );
}
