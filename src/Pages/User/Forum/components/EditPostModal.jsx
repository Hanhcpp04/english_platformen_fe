import React, { useState, useEffect } from "react";
import { X, Image as ImageIcon, Tag, FileText, Paperclip, ChevronLeft, ChevronRight } from "lucide-react";
import { getUserFromLocalStorage } from "../../../../utils/userUtils";
import { updatePost } from "../../../../service/postService";
import { toast } from "react-toastify";

export default function EditPostModal({ isOpen, onClose, post, onSave }) {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [originalMedia, setOriginalMedia] = useState([]);

  useEffect(() => {
    const user = getUserFromLocalStorage();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (post) {
      setContent(post.content || "");
      setTags(post.tags || []);
      
      // Store original media with metadata
      const BASE_UPLOAD_URL = "http://localhost:8088/api/v1/uploads/forum/";
      const existingImages = (post.media || [])
        .filter(m => m.mediaType === 'image' && m.url)
        .map(media => ({
          url: BASE_UPLOAD_URL + media.url,
          preview: BASE_UPLOAD_URL + media.url,
          isExisting: true,
          mediaId: media.id
        }));
      
      const existingFiles = (post.media || [])
        .filter(m => m.mediaType === 'file' && m.url)
        .map(media => ({
          url: BASE_UPLOAD_URL + media.url,
          name: media.fileName,
          size: formatFileSize(media.fileSize),
          isExisting: true,
          mediaId: media.id
        }));
      
      setImages(existingImages);
      setOriginalMedia(existingImages);
      setFiles(existingFiles);
    }
  }, [post]);

  // Format file size helper
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  if (!isOpen || !post) return null;

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim() && tags.length < 5) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isExisting: false,
    }));
    setImages([...images, ...newImages].slice(0, 4));
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    if (newImages[index].preview) {
      URL.revokeObjectURL(newImages[index].preview);
    }
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.map((file) => ({
      file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
    }));
    setFiles([...files, ...newFiles].slice(0, 5));
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung!");
      return;
    }

    setIsSubmitting(true);
    try {
      // Separate existing images from new ones
      const existingImages = images.filter(img => img.isExisting);
      const newImages = images.filter(img => !img.isExisting);

      // Separate existing files from new ones
      const existingFiles = files.filter(f => f.isExisting);
      const newFiles = files.filter(f => !f.isExisting);

      // Find removed images
      const removedImages = originalMedia.filter(
        orig => !images.find(img => img.url === orig.url)
      );

      // Find removed files (we need to track original files)
      const originalFiles = (post.media || [])
        .filter(m => m.mediaType === 'file' && m.url)
        .map(m => ({ mediaId: m.id, url: "http://localhost:8088/api/v1/uploads/forum/" + m.url }));
      
      const removedFiles = originalFiles.filter(
        orig => !files.find(f => f.url === orig.url)
      );

      // Prepare update data
      const updateData = {
        content: content.trim(),
        tags: tags,
        newImages: newImages,
        newFiles: newFiles,
        existingMediaIds: [
          ...existingImages.map(img => img.mediaId).filter(id => id != null),
          ...existingFiles.map(f => f.mediaId).filter(id => id != null)
        ],
        removedMediaIds: [
          ...removedImages.map(img => img.mediaId).filter(id => id != null),
          ...removedFiles.map(f => f.mediaId).filter(id => id != null)
        ],
      };

      console.log("Update data being sent:", {
        postId: post.id,
        content: updateData.content,
        tags: updateData.tags,
        newImagesCount: updateData.newImages.length,
        existingMediaIds: updateData.existingMediaIds,
        removedMediaIds: updateData.removedMediaIds,
      });

      const response = await updatePost(post.id, updateData);
      
      console.log("Update response:", response);
      
      if (response.code === 1000) {
        toast.success("Cập nhật bài viết thành công!");
        onSave(response.result);
        onClose();
      } else {
        toast.error(response.message || "Cập nhật bài viết thất bại!");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Có lỗi xảy ra khi cập nhật bài viết!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      {/* Image Viewer Modal */}
      {selectedImageIndex !== null && images[selectedImageIndex] && (
        <div 
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[60]"
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <X size={32} className="text-white" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white text-sm z-10">
            {selectedImageIndex + 1} / {images.length}
          </div>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={handlePrevImage}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ChevronLeft size={32} className="text-white" />
            </button>
          )}

          {/* Image */}
          <img
            src={(images[selectedImageIndex].preview || images[selectedImageIndex].url || '').replace('w=400', 'w=1920')}
            alt={`Image ${selectedImageIndex + 1}`}
            className="max-w-[98%] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={handleNextImage}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ChevronRight size={32} className="text-white" />
            </button>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-[90%] overflow-x-auto px-4 py-2 bg-black/50 rounded-lg">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.preview || img.url}
                  alt={`Thumbnail ${idx + 1}`}
                  className={`w-16 h-16 object-cover rounded cursor-pointer transition-all ${
                    idx === selectedImageIndex 
                      ? 'ring-2 ring-white scale-110' 
                      : 'opacity-50 hover:opacity-100'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(idx);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Post Modal */}
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col mt-15"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Chỉnh sửa bài viết</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
          
          {/* Author Info */}
          {currentUser && (
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar || "https://via.placeholder.com/40"}
                alt={currentUser.fullname || currentUser.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-sm text-gray-900">
                  {currentUser.fullname || currentUser.username}
                </h3>
                <p className="text-xs text-gray-500">Đang chỉnh sửa bài viết</p>
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {/* Content */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Bạn đang nghĩ gì?"
              className="w-full px-3 py-2 border-0 focus:outline-none text-gray-900 placeholder-gray-500 min-h-[100px] resize-none text-base leading-relaxed"
              autoFocus
            />
            {/* Images Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img.preview || img.url}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-50 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImageIndex(idx)}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(idx);
                      }}
                      className="absolute top-1 right-1 p-1 bg-white/90 hover:bg-white rounded-full shadow-md transition-all"
                    >
                      <X size={16} className="text-gray-700" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Tags Display */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-blue-900"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Files Display */}
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.size}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                    >
                      <X size={16} className="text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Tag Input */}
          {tagInput !== null && tags.length < 5 && (
            <div className="px-4 pb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Thêm thẻ và nhấn Enter..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Thêm vào bài viết</span>
            <div className="flex items-center gap-1">
              {/* Image Upload */}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="edit-image-upload"
                disabled={images.length >= 4}
              />
              <label
                htmlFor="edit-image-upload"
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  images.length >= 4
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-100'
                }`}
                title="Thêm ảnh"
              >
                <ImageIcon size={24} className="text-green-600" />
              </label>

              {/* Tag Button */}
              <button
                type="button"
                onClick={() => setTagInput(tagInput === null ? "" : null)}
                className={`p-2 rounded-lg transition-colors ${
                  tags.length >= 5
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-100'
                }`}
                disabled={tags.length >= 5}
                title="Thêm thẻ"
              >
                <Tag size={24} className="text-blue-600" />
              </button>

              {/* File Upload */}
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="edit-file-upload"
                disabled={files.length >= 5}
              />
              <label
                htmlFor="edit-file-upload"
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  files.length >= 5
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-100'
                }`}
                title="Đính kèm file"
              >
                <Paperclip size={24} className="text-purple-600" />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  </>
  );
}
