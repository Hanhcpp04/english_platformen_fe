import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, File, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

export default function MediaUploader({ value = [], onChange, maxFiles = 5, maxImageSize = 5, maxFileSize = 10 }) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const maxImageSizeMB = maxImageSize;
  const maxFileSizeMB = maxFileSize;
  const maxImageSizeBytes = maxImageSizeMB * 1024 * 1024;
  const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

  const allowedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const allowedFileTypes = [
    ...allowedImageTypes,
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ];

  const handleFiles = async (files) => {
    if (value.length + files.length > maxFiles) {
      toast.error(`Chỉ được upload tối đa ${maxFiles} files!`);
      return;
    }

    setUploading(true);
    const newFiles = [];

    for (let file of Array.from(files)) {
      // Validate file type
      if (!allowedFileTypes.includes(file.type)) {
        toast.error(`File ${file.name} không được hỗ trợ!`);
        continue;
      }

      // Validate file size
      const isImage = allowedImageTypes.includes(file.type);
      const maxSize = isImage ? maxImageSizeBytes : maxFileSizeBytes;
      if (file.size > maxSize) {
        toast.error(`File ${file.name} quá lớn! Tối đa ${isImage ? maxImageSizeMB : maxFileSizeMB}MB`);
        continue;
      }

      // Create preview
      const preview = await createPreview(file);
      newFiles.push({
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
        preview,
        isImage: isImage,
      });
    }

    onChange([...value, ...newFiles]);
    setUploading(false);
  };

  const createPreview = (file) => {
    return new Promise((resolve) => {
      if (allowedImageTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      } else {
        resolve(null);
      }
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleRemove = (id) => {
    onChange(value.filter((f) => f.id !== id));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const getFileIcon = (type) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("word")) return "📝";
    if (type.includes("excel") || type.includes("sheet")) return "📊";
    return "📎";
  };

  return (
    <div className="mb-6">
      <label className="block font-heading font-semibold text-dark-primary mb-2">
        🖼️ Media (Hình ảnh & Files)
      </label>

      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
          dragActive
            ? "border-primary-600 bg-primary-50"
            : "border-gray-300 hover:border-primary-600 bg-gray-50"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedFileTypes.join(",")}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <Upload size={32} className="mx-auto text-gray-400 mb-2" />
        <p className="text-sm font-medium text-gray-700 mb-1 font-body">
          Click để chọn hoặc kéo thả files vào đây
        </p>
        <p className="text-xs text-gray-500 font-body">
          Hỗ trợ: JPG, PNG, GIF, PDF, DOCX, XLSX (max {maxFiles} files)
        </p>
        <p className="text-xs text-gray-400 mt-1 font-body">
          Ảnh: tối đa {maxImageSizeMB}MB • Files: tối đa {maxFileSizeMB}MB
        </p>
      </div>

      {/* Uploaded Files Preview */}
      {value.length > 0 && (
        <div className="mt-4 space-y-3">
          {/* Images Grid */}
          {value.filter((f) => f.isImage).length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {value
                .filter((f) => f.isImage)
                .map((file) => (
                  <div key={file.id} className="relative group aspect-square">
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemove(file.id)}
                      className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X size={16} className="text-red-500" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity truncate font-body">
                      {file.name}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Files List */}
          {value.filter((f) => !f.isImage).length > 0 && (
            <div className="space-y-2">
              {value
                .filter((f) => !f.isImage)
                .map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-2xl shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-dark-primary truncate font-body">
                        {file.name}
                      </div>
                      <div className="text-xs text-gray-500 font-body">{file.size}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(file.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X size={18} className="text-red-500" />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* File Count */}
      {value.length > 0 && (
        <div className="mt-2 text-xs text-gray-500 font-body">
          {value.length} / {maxFiles} files
        </div>
      )}

      {/* Loading State */}
      {uploading && (
        <div className="mt-3 flex items-center gap-2 text-sm text-primary-600 font-body">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-600 border-t-transparent"></div>
          Đang xử lý files...
        </div>
      )}
    </div>
  );
}
