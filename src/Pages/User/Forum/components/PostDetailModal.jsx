import React, { useState, useEffect } from "react";
import { X, ThumbsUp, MessageSquare, Eye, Clock, Bookmark, Share2, Send } from "lucide-react";
import { getPostDetail, likePost, commentPost, getPostComments, likeComment as likeCommentAPI } from "../../../../service/postService";
import { toast } from "react-toastify";
import { getUserFromLocalStorage } from "../../../../utils/userUtils";

// Comment Item Component with nested replies - Compact version
function CommentItem({ comment, onLike, onReply, depth = 0 }) {
  const maxDepth = 3; // Maximum nesting level

  return (
    <div className={`flex gap-1.5 ${depth > 0 ? 'ml-6 mt-1.5' : ''}`}>
      <img
        src={comment.author.avatar}
        alt={comment.author.name}
        className="w-7 h-7 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1">
        <div className="bg-gray-100 rounded-2xl px-2.5 py-1.5">
          <h4 className="font-semibold text-xs text-gray-900">{comment.author.name}</h4>
          <p className="text-xs text-gray-800 mt-0.5 leading-relaxed">{comment.content}</p>
        </div>
        <div className="flex items-center gap-2 mt-0.5 px-2.5 text-[10px] text-gray-600">
          <span className="font-medium">{comment.created_at}</span>
          <button
            onClick={() => onLike(comment.id)}
            className={`hover:underline font-medium ${
              comment.hasLiked ? 'text-blue-600' : ''
            }`}
          >
            Thích
          </button>
          {depth < maxDepth && (
            <button
              onClick={() => onReply(comment.id, comment.author.name)}
              className="hover:underline font-medium"
            >
              Trả lời
            </button>
          )}
          {comment.likes > 0 && (
            <span className="flex items-center gap-0.5 text-gray-500">
              <ThumbsUp size={10} className="text-blue-600" />
              {comment.likes}
            </span>
          )}
        </div>
        
        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-1.5 space-y-1.5">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onLike={onLike}
                onReply={onReply}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PostDetailModal({ post: initialPost, isOpen, onClose }) {
  const [post, setPost] = useState(initialPost);
  const [isLiked, setIsLiked] = useState(initialPost?.hasLiked || false);
  const [likesCount, setLikesCount] = useState(initialPost?.likes_count || 0);
  const [isBookmarked, setIsBookmarked] = useState(initialPost?.hasBookmarked || false);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getUserFromLocalStorage();
    setCurrentUser(user);
  }, []);

  // Fetch detailed post data and comments when modal opens
  useEffect(() => {
    if (isOpen && initialPost?.id) {
      fetchPostDetail();
      fetchComments();
    }
  }, [isOpen, initialPost?.id]);

  // Format date from ISO string
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

  const fetchPostDetail = async () => {
    try {
      setLoading(true);
      const response = await getPostDetail(initialPost.id);
      
      if (response.code === 1000 && response.result) {
        const postData = response.result;
        const mappedPost = {
          id: postData.id,
          title: postData.title,
          content: postData.content,
          author: {
            name: postData.username,
            avatar: postData.userAvatar || "https://via.placeholder.com/40",
          },
          created_at: formatDate(postData.createdAt),
          tags: postData.tags || [],
          likes_count: postData.likesCount,
          comments_count: postData.commentsCount,
          views: postData.viewsCount,
          images: postData.media?.filter(m => m.mediaType === 'image' && m.url).map(m => m.url) || [],
          files: postData.media?.filter(m => m.mediaType === 'file' && m.url).map(m => ({
            name: m.fileName,
            size: formatFileSize(m.fileSize),
            url: m.url,
          })) || [],
          hasLiked: postData.isLiked,
          hasBookmarked: false,
        };
        
        setPost(mappedPost);
        setIsLiked(postData.isLiked);
        setLikesCount(postData.likesCount);
        setIsBookmarked(postData.isBookmarked || false);
      }
    } catch (error) {
      console.error("Error fetching post detail:", error);
      toast.error("Không thể tải chi tiết bài viết");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getPostComments(initialPost.id);
      
      if (response.code === 1000 && response.result) {
        // Map comments from API (CommentListResponse structure)
        const mapCommentWithReplies = (comment) => ({
          id: comment.id,
          author: {
            name: comment.username,
            avatar: comment.userAvatar || "https://via.placeholder.com/40",
          },
          content: comment.content,
          created_at: formatDate(comment.createdAt),
          likes: comment.likesCount || 0,
          hasLiked: comment.isLiked || false,
          replies: comment.replies?.map(mapCommentWithReplies) || [],
        });
        
        const mappedComments = response.result.comments.map(mapCommentWithReplies);
        setComments(mappedComments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      // Don't show error toast for comments, just log it
    }
  };

  // Format file size from bytes
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  if (!isOpen || !post) return null;

  const handleLike = async () => {
    // Check if user is logged in
    if (!currentUser) {
      toast.warning("Vui lòng đăng nhập để thích bài viết");
      return;
    }

    try {
      // Optimistic update
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

      await likePost(post.id);
    } catch (error) {
      console.error("Error liking post:", error);
      // Revert on error
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount + 1 : likesCount - 1);
      
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

  const handleBookmark = async () => {
    // Note: Bookmark API is not available in the backend
    toast.info("Tính năng lưu bài viết sẽ được cập nhật sau");
  };

  const handleLikeComment = async (commentId, parentPath = []) => {
    // Check if user is logged in
    if (!currentUser) {
      toast.warning("Vui lòng đăng nhập để thích bình luận");
      return;
    }

    try {
      // Optimistic update
      const updateCommentLike = (comments) => {
        return comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              hasLiked: !comment.hasLiked,
              likes: comment.hasLiked ? comment.likes - 1 : comment.likes + 1,
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentLike(comment.replies),
            };
          }
          return comment;
        });
      };

      setComments(updateCommentLike(comments));
      await likeCommentAPI(commentId);
    } catch (error) {
      console.error("Error liking comment:", error);
      // Revert on error
      const revertCommentLike = (comments) => {
        return comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              hasLiked: !comment.hasLiked,
              likes: comment.hasLiked ? comment.likes + 1 : comment.likes - 1,
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: revertCommentLike(comment.replies),
            };
          }
          return comment;
        });
      };
      setComments(revertCommentLike(comments));
      
      // Show appropriate error message based on API response code
      if (error.code === 9999 || error.response?.status === 401) {
        toast.error(error.message || "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      } else if (error.code === 404) {
        toast.error(error.message || "Không tìm thấy bình luận");
      } else {
        toast.error(error.message || "Không thể thích bình luận");
      }
    }
  };

  const handleReply = (commentId, authorName) => {
    setReplyingTo({ id: commentId, name: authorName });
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    // Check if user is logged in
    const token = localStorage.getItem("accessToken");
    if (!currentUser || !token) {
      toast.warning("Vui lòng đăng nhập để bình luận");
      return;
    }

    try {
      const commentData = {
        content: commentText,
        parentId: replyingTo?.id || null,
      };

      const response = await commentPost(post.id, commentData);
      
      if (response.code === 1000 && response.result) {
        const newComment = {
          id: response.result.id,
          author: {
            name: currentUser?.fullname || currentUser?.username || "Bạn",
            avatar: currentUser?.avatar || post.author.avatar,
          },
          content: commentText,
          created_at: "Vừa xong",
          likes: 0,
          hasLiked: false,
          replies: [],
        };

        if (replyingTo) {
          // Add as reply to existing comment
          const addReply = (comments) => {
            return comments.map((comment) => {
              if (comment.id === replyingTo.id) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), newComment],
                };
              }
              if (comment.replies && comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: addReply(comment.replies),
                };
              }
              return comment;
            });
          };
          setComments(addReply(comments));
          setReplyingTo(null);
        } else {
          // Add as top-level comment
          setComments([...comments, newComment]);
        }
        
        setCommentText("");
        toast.success("Đã đăng bình luận");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      
      // Show appropriate error message based on API response code
      if (error.code === 9999 || error.response?.status === 401) {
        toast.error(error.message || "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      } else if (error.code === 404) {
        toast.error(error.message || "Không tìm thấy bài viết");
      } else {
        toast.error(error.message || "Không thể đăng bình luận");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side - Post Content */}
        <div className="w-full md:w-3/5 flex flex-col border-r border-gray-200 min-h-0">
          {/* Post Header */}
          <div className="px-3 py-2.5 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-xs text-gray-900">{post.author.name}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500">
                    <Clock size={10} />
                    <span>{post.created_at}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={18} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Post Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3">
              {/* Title */}
              <h1 className="text-base font-bold text-gray-900 mb-2 leading-tight">
                {post.title}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-2">
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Content */}
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm mb-3">
                {post.content || post.excerpt}
              </div>

              {/* Images - Show if there are images */}
              {post.images && post.images.length > 0 && (
                <div className="mb-3">
                  {post.images.length === 1 ? (
                    <img
                      src={post.images[0]}
                      alt="Post image"
                      className="w-full rounded-lg object-cover max-h-96 cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() => {
                        setSelectedImage(post.images[0]);
                        setCurrentImageIndex(0);
                      }}
                    />
                  ) : post.images.length === 2 ? (
                    <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                      {post.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Image ${idx + 1}`}
                          className="w-full h-48 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                          onClick={() => {
                            setSelectedImage(img);
                            setCurrentImageIndex(idx);
                          }}
                        />
                      ))}
                    </div>
                  ) : post.images.length === 3 ? (
                    <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                      <img
                        src={post.images[0]}
                        alt="Image 1"
                        className="col-span-2 w-full h-48 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => {
                          setSelectedImage(post.images[0]);
                          setCurrentImageIndex(0);
                        }}
                      />
                      {post.images.slice(1).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Image ${idx + 2}`}
                          className="w-full h-32 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                          onClick={() => {
                            setSelectedImage(img);
                            setCurrentImageIndex(idx + 1);
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                      {post.images.slice(0, 4).map((img, idx) => (
                        <div 
                          key={idx} 
                          className="relative cursor-pointer hover:opacity-95 transition-opacity"
                          onClick={() => {
                            setSelectedImage(img);
                            setCurrentImageIndex(idx);
                          }}
                        >
                          <img
                            src={img}
                            alt={`Image ${idx + 1}`}
                            className="w-full h-40 object-cover"
                          />
                          {idx === 3 && post.images.length > 4 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
                              <span className="text-white text-xl font-bold">
                                +{post.images.length - 4}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Files - Show files if they exist */}
              {post.files && post.files.length > 0 && (
                <div className="mb-3 space-y-1.5">
                  {post.files.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs text-gray-900 truncate">{file.name}</p>
                        <p className="text-[10px] text-gray-500">{file.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Stats Bar */}
              <div className="flex items-center justify-between py-1.5 border-y border-gray-200 text-xs text-gray-600 mb-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <ThumbsUp size={14} className="text-blue-600" />
                    {likesCount}
                  </span>
                  <span>{post.comments_count} bình luận</span>
                </div>
                <span>{post.views} lượt xem</span>
              </div>

              {/* Action Buttons - Compact */}
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={handleLike}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-semibold transition-all ${
                    isLiked
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ThumbsUp size={16} fill={isLiked ? 'currentColor' : 'none'} />
                  <span className="text-xs">Thích</span>
                </button>
                
                <button className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 font-semibold transition-all">
                  <MessageSquare size={16} />
                  <span className="text-xs">Bình luận</span>
                </button>

                <button 
                  onClick={handleBookmark}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-semibold transition-all ${
                    isBookmarked
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                  <span className="text-xs">Lưu</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Comments Section */}
        <div className="w-full md:w-2/5 flex flex-col bg-white min-h-0">
          {/* Comments Header */}
          <div className="px-3 py-2.5 border-b border-gray-200 flex-shrink-0">
            <h3 className="font-semibold text-sm text-gray-900">
              Bình luận
            </h3>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onLike={handleLikeComment}
                onReply={handleReply}
                depth={0}
              />
            ))}
          </div>

          {/* Comment Input - Compact */}
          <div className="p-2.5 border-t border-gray-200 flex-shrink-0">
            {replyingTo && (
              <div className="flex items-center justify-between mb-1.5 px-2 py-1 bg-blue-50 rounded text-[10px]">
                <span className="text-blue-700">
                  Trả lời <span className="font-semibold">{replyingTo.name}</span>
                </span>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <form onSubmit={handleSubmitComment} className="flex gap-1.5 items-center">
              <img
                src={post.author.avatar}
                alt="You"
                className="w-7 h-7 rounded-full object-cover"
              />
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={replyingTo ? `Trả lời ${replyingTo.name}...` : "Viết bình luận..."}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-100 rounded-full text-xs focus:outline-none focus:bg-gray-200 pr-8"
                />
                {commentText.trim() && (
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700"
                  >
                    <Send size={14} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[70]"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} className="text-white" />
          </button>

          {/* Navigation Arrows */}
          {post.images && post.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : post.images.length - 1;
                  setCurrentImageIndex(newIndex);
                  setSelectedImage(post.images[newIndex]);
                }}
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newIndex = currentImageIndex < post.images.length - 1 ? currentImageIndex + 1 : 0;
                  setCurrentImageIndex(newIndex);
                  setSelectedImage(post.images[newIndex]);
                }}
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image Counter */}
          {post.images && post.images.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full">
              <span className="text-white text-sm font-medium">
                {currentImageIndex + 1} / {post.images.length}
              </span>
            </div>
          )}

          {/* Main Image */}
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
