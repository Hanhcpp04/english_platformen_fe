import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PencilLine, Trash2, Eye, ThumbsUp, MessageSquare, Clock, X, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import HeaderNavBar from "./components/HeaderNavBar";
import { getUserFromLocalStorage } from "../../../utils/userUtils";
import EditPostModal from "./components/EditPostModal";
import PostDetailModal from "./components/PostDetailModal";
import { getUserPosts, deletePost, likePost } from "../../../service/postService";
import { toast } from "react-toastify";

export default function MyPostsPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [selectedPostImages, setSelectedPostImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const postsPerPage = 10;

  useEffect(() => {
    const user = getUserFromLocalStorage();
    setCurrentUser(user);
    if (user && user.id) {
      fetchUserPosts(user.id);
    }
  }, [currentPage]);

  // Format date from ISO string to Vietnamese format
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
    return `${Math.floor(days / 30)} tháng trước`;
  };

  // Format file size from bytes to human readable
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const fetchUserPosts = async (userId) => {
    try {
      setLoading(true);
      const response = await getUserPosts(userId, {
        page: currentPage,
        limit: postsPerPage,
      });

      if (response.code === 1000 && response.result) {
        const mappedPosts = response.result.posts.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          author: {
            name: post.username,
            avatar: post.userAvatar || "https://via.placeholder.com/40",
          },
          created_at: formatDate(post.createdAt),
          tags: post.tags || [],
          likes_count: post.likesCount,
          comments_count: post.commentsCount,
          views: post.viewsCount,
          images: post.media?.filter(m => m.mediaType === 'image' && m.url).map(m => m.url) || [],
          media: post.media || [], // Keep original media for editing
          files: post.media?.filter(m => m.mediaType === 'file' && m.url).map(m => ({
            name: m.fileName,
            size: formatFileSize(m.fileSize),
            url: m.url,
            id: m.id,
          })) || [],
          hasLiked: post.isLiked,
          hasBookmarked: false,
        }));

        setPosts(mappedPosts);
        setTotalPosts(response.result.totalElements);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
      toast.error("Không thể tải danh sách bài viết của bạn");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      try {
        const response = await deletePost(postId);
        if (response.code === 1000) {
          toast.success("Đã xóa bài viết thành công");
          // Refresh the posts list
          if (currentUser && currentUser.id) {
            fetchUserPosts(currentUser.id);
          }
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        if (error.code === 9999 || error.response?.status === 401) {
          toast.error(error.message || "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        } else if (error.code === 404) {
          toast.error(error.message || "Không tìm thấy bài viết");
        } else {
          toast.error(error.message || "Không thể xóa bài viết");
        }
      }
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedPost) => {
    // Refresh the posts list after editing
    if (currentUser && currentUser.id) {
      fetchUserPosts(currentUser.id);
    }
    setIsEditModalOpen(false);
    setEditingPost(null);
  };

  const handleOpenDetail = (post) => {
    setSelectedPost(post);
  };

  const handleCloseDetail = () => {
    setSelectedPost(null);
    // Refresh posts to get updated counts
    if (currentUser && currentUser.id) {
      fetchUserPosts(currentUser.id);
    }
  };

  const handleImageClick = (images, index) => {
    setSelectedPostImages(images);
    setSelectedImageIndex(index);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : selectedPostImages.length - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev < selectedPostImages.length - 1 ? prev + 1 : 0));
  };

  const handleLike = async (postId) => {
    // Check if user is logged in
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.warning("Vui lòng đăng nhập để thích bài viết");
      return;
    }

    try {
      // Optimistic update
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                hasLiked: !post.hasLiked,
                likes_count: post.hasLiked ? post.likes_count - 1 : post.likes_count + 1,
              }
            : post
        )
      );

      await likePost(postId);
    } catch (error) {
      console.error("Error liking post:", error);
      // Revert on error
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                hasLiked: !post.hasLiked,
                likes_count: post.hasLiked ? post.likes_count - 1 : post.likes_count + 1,
              }
            : post
        )
      );
      
      // Show appropriate error message based on API response code
      if (error.code === 9999 || error.response?.status === 401) {
        toast.error(error.message || "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      } else if (error.code === 404) {
        toast.error(error.message || "Không tìm thấy bài viết");
      } else {
        toast.error(error.message || "Không thể thích bài viết");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderNavBar />
      
      {/* Image Viewer Modal */}
      {selectedImageIndex !== null && selectedPostImages[selectedImageIndex] && (
        <div 
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[60]"
          onClick={() => {
            setSelectedImageIndex(null);
            setSelectedPostImages([]);
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => {
              setSelectedImageIndex(null);
              setSelectedPostImages([]);
            }}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <X size={32} className="text-white" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white text-sm z-10">
            {selectedImageIndex + 1} / {selectedPostImages.length}
          </div>

          {/* Previous Button */}
          {selectedPostImages.length > 1 && (
            <button
              onClick={handlePrevImage}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ChevronLeft size={32} className="text-white" />
            </button>
          )}

          {/* Image */}
          <img
            src={selectedPostImages[selectedImageIndex].replace('w=400', 'w=1920')}
            alt={`Image ${selectedImageIndex + 1}`}
            className="max-w-[98%] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next Button */}
          {selectedPostImages.length > 1 && (
            <button
              onClick={handleNextImage}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ChevronRight size={32} className="text-white" />
            </button>
          )}

          {/* Thumbnails */}
          {selectedPostImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-[90%] overflow-x-auto px-4 py-2 bg-black/50 rounded-lg">
              {selectedPostImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
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

      {/* Edit Modal */}
      <EditPostModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingPost(null);
        }}
        post={editingPost}
        onSave={handleSaveEdit}
      />

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          isOpen={!!selectedPost}
          onClose={handleCloseDetail}
        />
      )}

      {/* Main Content */}
      <div className="ml-[20%] w-[80%] px-4 py-4">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải bài viết...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <MessageSquare size={64} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có bài viết nào</h3>
            <p className="text-gray-600 mb-6">Hãy bắt đầu chia sẻ kiến thức của bạn!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Post Header */}
                <div className="p-4 pb-3">
                  {/* Author Info */}
                  {currentUser && (
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={currentUser.avatar || "https://via.placeholder.com/40"}
                        alt={currentUser.fullname || currentUser.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-gray-900">
                          {currentUser.fullname || currentUser.username}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock size={12} />
                          <span>{post.created_at}</span>
                        </div>
                      </div>
                       <div className="flex items-center justify-between mb-3">
                    <div className="flex-1"></div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <PencilLine size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                    </div>
                  )}
                  
                  {/* Title */}
                  {post.title && (
                    <h2 
                      className="text-lg font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleOpenDetail(post)}
                    >
                      {post.title}
                    </h2>
                  )}

                  {/* Content */}
                  <p 
                    className="text-gray-900 text-base leading-relaxed mb-3 cursor-pointer hover:text-gray-700 transition-colors"
                    onClick={() => handleOpenDetail(post)}
                  >
                    {post.content}
                  </p>

                  {/* Images */}
                  {post.images && post.images.length > 0 && (
                    <div className={`grid gap-2 mb-3 ${
                      post.images.length === 1 ? 'grid-cols-1' : 
                      post.images.length === 2 ? 'grid-cols-2' : 
                      post.images.length === 3 ? 'grid-cols-3' : 
                      'grid-cols-2'
                    }`}>
                      {post.images.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={img}
                            alt={`Post image ${idx + 1}`}
                            className="w-full h-90 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handleImageClick(post.images, idx)}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Files */}
                  {post.files && post.files.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {post.files.map((file, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = file.url || '#';
                            link.download = file.name;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200 group"
                        >
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <FileText className="text-blue-600" size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-blue-600">{file.size} • Click để tải xuống</p>
                          </div>
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stats Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                        post.hasLiked
                          ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                          : 'text-gray-700 bg-white hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <ThumbsUp size={16} fill={post.hasLiked ? 'currentColor' : 'none'} />
                      <span>{post.likes_count}</span>
                    </button>
                    <span 
                      className="flex items-center gap-1.5 hover:text-blue-600 cursor-pointer transition-colors"
                      onClick={() => handleOpenDetail(post)}
                    >
                      <MessageSquare size={16} />
                      <span className="font-medium">{post.comments_count}</span>
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <Eye size={16} />
                    <span>{post.views}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && Math.ceil(totalPosts / postsPerPage) > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Trước
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(Math.ceil(totalPosts / postsPerPage))].map((_, index) => {
                const pageNum = index + 1;
                const totalPages = Math.ceil(totalPosts / postsPerPage);
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return <span key={pageNum} className="text-gray-400 px-1">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalPosts / postsPerPage)))}
              disabled={currentPage === Math.ceil(totalPosts / postsPerPage)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                currentPage === Math.ceil(totalPosts / postsPerPage)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}