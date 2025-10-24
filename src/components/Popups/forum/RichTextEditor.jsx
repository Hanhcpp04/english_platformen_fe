import React, { useState, useRef, useEffect } from "react";
import { Bold, Italic, Link as LinkIcon, List, ListOrdered, Code, Heading1, Heading2, Quote, HelpCircle } from "lucide-react";

export default function RichTextEditor({ value, onChange, maxLength = 10000 }) {
  const [showPreview, setShowPreview] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const textareaRef = useRef(null);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current && !showPreview) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.max(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [value, showPreview]);

  const insertMarkdown = (before, after = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const toolbarButtons = [
    { icon: <Bold size={18} />, title: "Bold", action: () => insertMarkdown("**", "**") },
    { icon: <Italic size={18} />, title: "Italic", action: () => insertMarkdown("*", "*") },
    { icon: <Heading1 size={18} />, title: "Heading 1", action: () => insertMarkdown("# ", "") },
    { icon: <Heading2 size={18} />, title: "Heading 2", action: () => insertMarkdown("## ", "") },
    { icon: <LinkIcon size={18} />, title: "Link", action: () => insertMarkdown("[", "](url)") },
    { icon: <List size={18} />, title: "Bullet List", action: () => insertMarkdown("- ", "") },
    { icon: <ListOrdered size={18} />, title: "Numbered List", action: () => insertMarkdown("1. ", "") },
    { icon: <Code size={18} />, title: "Code", action: () => insertMarkdown("`", "`") },
    { icon: <Quote size={18} />, title: "Quote", action: () => insertMarkdown("> ", "") },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <label className="block font-heading font-semibold text-dark-primary">
          📄 Nội dung
          {!value.trim() && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="text-xs text-gray-500 hover:text-primary-600 flex items-center gap-1 font-body"
          >
            <HelpCircle size={14} />
            Markdown guide
          </button>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all font-body ${
                !showPreview ? "bg-white text-primary-600 shadow-sm" : "text-gray-600"
              }`}
            >
              Viết
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all font-body ${
                showPreview ? "bg-white text-primary-600 shadow-sm" : "text-gray-600"
              }`}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Markdown Help */}
      {showHelp && (
        <div className="mb-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm font-body">
          <div className="grid grid-cols-2 gap-2">
            <div><code>**bold**</code> → <strong>bold</strong></div>
            <div><code>*italic*</code> → <em>italic</em></div>
            <div><code># Heading 1</code> → Heading 1</div>
            <div><code>[text](url)</code> → Link</div>
            <div><code>- item</code> → Bullet list</div>
            <div><code>`code`</code> → Code</div>
          </div>
        </div>
      )}

      {!showPreview ? (
        <>
          {/* Toolbar */}
          <div className="flex items-center gap-1 p-2 bg-gray-50 border border-gray-300 rounded-t-lg flex-wrap">
            {toolbarButtons.map((button, idx) => (
              <button
                key={idx}
                type="button"
                onClick={button.action}
                title={button.title}
                className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-600 hover:text-gray-800"
              >
                {button.icon}
              </button>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Viết nội dung bài viết của bạn ở đây... Hỗ trợ Markdown formatting."
            className="w-full border border-t-0 border-gray-300 rounded-b-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent resize-none font-body"
            style={{ minHeight: "200px" }}
            maxLength={maxLength}
          />
        </>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4 min-h-[200px] bg-white">
          <div className="prose prose-sm max-w-none">
            <div className="text-gray-700 whitespace-pre-line font-body">
              {value || <span className="text-gray-400 italic">Chưa có nội dung...</span>}
            </div>
          </div>
        </div>
      )}

      {/* Character Counter */}
      <div className="flex items-center justify-between mt-2">
        <span className={`text-xs font-body ${
          value.length > maxLength * 0.9 ? "text-red-500" : "text-gray-400"
        }`}>
          {value.length} / {maxLength} ký tự
        </span>
        
        {!value.trim() && (
          <span className="text-xs text-red-500 font-body">
            Vui lòng nhập nội dung
          </span>
        )}
      </div>
    </div>
  );
}
