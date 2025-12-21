import React, { useState, useEffect } from "react";
import { ThumbsUp, MessageSquare, Eye, Clock, Bookmark, Image as ImageIcon, FileText } from "lucide-react";
import PostDetailModal from "./components/PostDetailModal";
import HeaderNavBar from "./components/HeaderNavBar";
import { getPosts, likePost } from "../../../service/postService";
import { toast } from "react-toastify";

export default function PostList() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsState, setPostsState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 10;

  // Fetch posts from API
  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchQuery, dateFilter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getPosts({
        page: currentPage,
        limit: postsPerPage,
        search: searchQuery,
        dateFilter: dateFilter,
      });

      if (response.code === 1000 && response.result) {
        // Map API response to component state (PostListResponse structure)
        const mappedPosts = response.result.posts.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          excerpt: post.content.length > 200 ? post.content.substring(0, 200) + "..." : post.content,
          author: {
            name: post.username,
            avatar: post.userAvatar || "https://via.placeholder.com/40",
          },
          created_at: formatDate(post.createdAt),
          tags: post.tags || [],
          likes_count: post.likesCount,
          comments_count: post.commentsCount,
          views: post.viewsCount,
          images: post.media?.filter(m => m.mediaType === 'image').map(m => m.url) || [],
          files: post.media?.filter(m => m.mediaType === 'file').map(m => ({
            name: m.fileName,
            size: formatFileSize(m.fileSize),
            url: m.url,
          })) || [],
          hasLiked: post.isLiked,
          hasBookmarked: false, // Not in API
        }));

        setPostsState(mappedPosts);
        setTotalPosts(response.result.totalElements);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Không thể tải danh sách bài viết");
    } finally {
      setLoading(false);
    }
  };

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

  const toggleExpand = (postId) => {
    setExpandedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
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
      setPostsState((prev) =>
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
      setPostsState((prev) =>
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

  const handleBookmark = async (postId) => {
    // Note: Bookmark API is not available in the backend
    toast.info("Tính năng lưu bài viết sẽ được cập nhật sau");
  };

  const handleOpenDetail = (post) => {
    setSelectedPost(post);
  };

  const handleCloseDetail = () => {
    setSelectedPost(null);
    // Refresh posts to get updated counts
    fetchPosts();
  };

  const handleDownloadFile = (file) => {
    // TODO: Implement actual file download from server
    const link = document.createElement('a');
    link.href = file.url || '#'; // Thêm file.url vào data
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to check if post matches date filter
  const matchesDateFilter = (post) => {
    const now = new Date();
    const postTime = post.created_at.toLowerCase();
    
    if (dateFilter === "all") return true;
    
    // Simple time checking based on Vietnamese time format
    if (dateFilter === "today") {
      return postTime.includes("giờ trước") || postTime.includes("phút trước");
    }
    
    if (dateFilter === "week") {
      return postTime.includes("giờ trước") || postTime.includes("phút trước") || postTime.includes("ngày trước");
    }
    
    if (dateFilter === "month") {
      return postTime.includes("giờ trước") || postTime.includes("phút trước") || 
             postTime.includes("ngày trước") || postTime.includes("tuần trước");
    }
    
    return true;
  };

  // Pagination - API handles filtering, so we just display the posts
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const currentPosts = postsState;

  const renderMedia = (post) => {
    const hasImages = post.images && post.images.length > 0;
    const hasFiles = post.files && post.files.length > 0;

    return (
      <>
        {/* Render Images */}
        {hasImages && (() => {
          const imageCount = post.images.length;
          
          if (imageCount === 1) {
            return (
              <div className="mt-3 rounded-lg overflow-hidden cursor-pointer" onClick={() => handleOpenDetail(post)}>
                <img
                  src={post.images[0]}
                  alt="Post image"
                  className="w-full h-80 object-cover hover:opacity-95 transition-opacity"
                />
              </div>
            );
          }
          
          if (imageCount === 2) {
            return (
              <div className="mt-3 grid grid-cols-2 gap-1 rounded-lg overflow-hidden cursor-pointer" onClick={() => handleOpenDetail(post)}>
                {post.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Post image ${idx + 1}`}
                    className="w-full h-60 object-cover hover:opacity-95 transition-opacity"
                  />
                ))}
              </div>
            );
          }
          
          if (imageCount === 3) {
            return (
              <div className="mt-3 grid grid-cols-2 gap-1 rounded-lg overflow-hidden cursor-pointer" onClick={() => handleOpenDetail(post)}>
                <img
                  src={post.images[0]}
                  alt="Post image 1"
                  className="col-span-2 w-full h-60 object-cover hover:opacity-95 transition-opacity"
                />
                {post.images.slice(1).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Post image ${idx + 2}`}
                    className="w-full h-40 object-cover hover:opacity-95 transition-opacity"
                  />
                ))}
              </div>
            );
          }
          
          // 4 or more images
          return (
            <div className="mt-3 grid grid-cols-2 gap-1 rounded-lg overflow-hidden cursor-pointer" onClick={() => handleOpenDetail(post)}>
              {post.images.slice(0, 4).map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={img}
                    alt={`Post image ${idx + 1}`}
                    className="w-full h-48 object-cover hover:opacity-95 transition-opacity"
                  />
                  {idx === 3 && imageCount > 4 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">+{imageCount - 4}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })()}

        {/* Render Files */}
        {hasFiles && (
          <div className="mt-3 space-y-2">
            {post.files.map((file, idx) => (
              <div
                key={idx}
                onClick={() => handleDownloadFile(file)}
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
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      {/* Main Content */}
      <div className="ml-[20%] w-[80%] px-4 py-4">
        {/* Search and Filter Bar */}
        <HeaderNavBar />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-4">
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Date Filter Buttons */}
            <button
              onClick={() => setDateFilter("all")}
              className={`px-3 py-2 rounded-lg font-medium text-xs transition-all ${
                dateFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setDateFilter("today")}
              className={`px-3 py-2 rounded-lg font-medium text-xs transition-all ${
                dateFilter === "today"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Hôm nay
            </button>
            <button
              onClick={() => setDateFilter("week")}
              className={`px-3 py-2 rounded-lg font-medium text-xs transition-all ${
                dateFilter === "week"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tuần này
            </button>
            <button
              onClick={() => setDateFilter("month")}
              className={`px-3 py-2 rounded-lg font-medium text-xs transition-all ${
                dateFilter === "month"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tháng này
            </button>
            
            {/* Results Count */}
            <div className="text-xs text-gray-600 whitespace-nowrap">
              <span className="font-semibold text-gray-900">{totalPosts}</span> bài
            </div>
          </div>
        </div>
        {/* Posts List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải bài viết...</p>
          </div>
        ) : postsState.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy bài viết</h3>
            <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
          </div>
        ) : (
          <>
          <div className="space-y-4">
            {currentPosts.map((post) => {
            const isExpanded = expandedPosts.has(post.id);
            const contentToShow = isExpanded ? post.content : post.excerpt;
            const needsExpansion = post.content.length > post.excerpt.length;

            return (
              <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Post Header */}
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">{post.author.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{post.created_at}</span>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 
                    className="text-lg font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleOpenDetail(post)}
                  >
                    {post.title}
                  </h2>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="text-gray-800 leading-relaxed text-sm mb-2">
                    {contentToShow}
                    {needsExpansion && !isExpanded && (
                      <button
                        onClick={() => toggleExpand(post.id)}
                        className="text-blue-600 hover:text-blue-700 font-medium ml-1"
                      >
                        Xem thêm
                      </button>
                    )}
                    {isExpanded && (
                      <button
                        onClick={() => toggleExpand(post.id)}
                        className="text-blue-600 hover:text-blue-700 font-medium ml-1 block mt-1"
                      >
                        Thu gọn
                      </button>
                    )}
                  </div>

                  {/* Media (Images/Files) */}
                  {renderMedia(post)}
                </div>

                {/* Interaction Bar */}
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    {/* Left: Like and Comment buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-all ${
                          post.hasLiked
                            ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                            : 'text-gray-700 bg-white hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <ThumbsUp size={16} fill={post.hasLiked ? 'currentColor' : 'none'} />
                        <span className="text-sm">{post.likes_count}</span>
                      </button>

                      <button
                        onClick={() => handleOpenDetail(post)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 font-semibold transition-all"
                      >
                        <MessageSquare size={16} />
                        <span className="text-sm">{post.comments_count}</span>
                      </button>
                    </div>

                    {/* Right: Stats */}
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye size={16} />
                        {post.views}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
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
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  // Show first page, last page, current page, and pages around current
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
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Sau
              </button>
            </div>
          )}
          </>
        )}
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          isOpen={!!selectedPost}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}