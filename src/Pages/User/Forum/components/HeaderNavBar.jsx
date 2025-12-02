import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, BookOpen, Plus, User, Clock } from "lucide-react";
import CreatePostModal from "../CreatePostPage";
import PostDetailModal from "./PostDetailModal";
import { getRecentPosts, getPostDetail } from "../../../../service/postService";
import { toast } from "react-toastify";

export default function HeaderNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      setLoading(true);
      const response = await getRecentPosts(10);
      
      if (response.code === 1000 && response.result) {
        const mappedPosts = response.result.map(post => ({
          id: post.id,
          title: post.title,
          author: post.author,
          avatar: post.avatar || "https://via.placeholder.com/40",
          time: post.time,
          likes: post.likes,
          comments: post.comments,
        }));
        setRecentPosts(mappedPosts);
      }
    } catch (error) {
      console.error("Error fetching recent posts:", error);
      toast.error("Không thể tải bài viết gần đây");
    } finally {
      setLoading(false);
    }
  };

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

  // Mock data - bài đăng gần đây (removed, now using API)
  const oldRecentPosts = [
    {
      id: 1,
      title: "Bí quyết cải thiện kỹ năng nói tiếng Anh hiệu quả trong 30 ngày",
      author: "Nguyễn Minh Anh",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      time: "15 phút trước",
      likes: 127,
      comments: 23
    },
    {
      id: 2,
      title: "Chia sẻ kinh nghiệm đạt 8.5 IELTS sau 6 tháng tự học",
      author: "Trần Quốc Bảo",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      time: "45 phút trước",
      likes: 298,
      comments: 67
    },
    {
      id: 3,
      title: "Top 10 lỗi ngữ pháp phổ biến người Việt hay mắc phải",
      author: "Lê Thị Cẩm",
      avatar: "https://randomuser.me/api/portraits/women/67.jpg",
      time: "2 giờ trước",
      likes: 445,
      comments: 89
    },
    {
      id: 4,
      title: "Phương pháp học từ vựng không cần flashcard nhưng vẫn nhớ lâu",
      author: "Phạm Văn Dũng",
      avatar: "https://randomuser.me/api/portraits/men/12.jpg",
      time: "5 giờ trước",
      likes: 213,
      comments: 45
    },
    {
      id: 5,
      title: "Review khóa học tiếng Anh online tốt nhất 2025",
      author: "Hoàng Thu Hà",
      avatar: "https://randomuser.me/api/portraits/women/88.jpg",
      time: "8 giờ trước",
      likes: 356,
      comments: 102
    },
    {
      id: 6,
      title: "Cách luyện phát âm chuẩn như người bản xứ chỉ trong 3 tháng",
      author: "Đỗ Minh Khoa",
      avatar: "https://randomuser.me/api/portraits/men/56.jpg",
      time: "12 giờ trước",
      likes: 189,
      comments: 34
    },
    {
      id: 7,
      title: "Kinh nghiệm thi TOEIC 990 điểm: Lộ trình chi tiết từ A-Z",
      author: "Vũ Thị Lan",
      avatar: "https://randomuser.me/api/portraits/women/23.jpg",
      time: "1 ngày trước",
      likes: 512,
      comments: 156
    },
    {
      id: 8,
      title: "5 kênh YouTube học tiếng Anh miễn phí cực hay",
      author: "Ngô Quang Minh",
      avatar: "https://randomuser.me/api/portraits/men/78.jpg",
      time: "1 ngày trước",
      likes: 278,
      comments: 67
    },
    {
      id: 9,
      title: "Học tiếng Anh qua phim: Phương pháp và danh sách phim hay",
      author: "Bùi Thị Nga",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      time: "2 ngày trước",
      likes: 423,
      comments: 98
    },
    {
      id: 10,
      title: "Tài liệu luyện Reading IELTS từ 5.0 lên 7.5 trong 2 tháng",
      author: "Trịnh Văn Phong",
      avatar: "https://randomuser.me/api/portraits/men/34.jpg",
      time: "2 ngày trước",
      likes: 367,
      comments: 81
    }
  ];

  const navItems = [
    {
      icon: Home,
      label: "Trang chủ",
      path: "/forum",
      action: () => navigate('/forum')
    },
    {
      icon: BookOpen,
      label: "Bài viết",
      path: "/forum/posts",
      action: () => navigate('/forum/posts')
    },
    {
      icon: Plus,
      label: "Tạo mới",
      path: "/forum/create",
      action: () => setIsCreateModalOpen(true),
    },
    {
      icon: User,
      label: "Của tôi",
      path: "/forum/my-posts",
      action: () => navigate('/forum/my-posts')
    }
  ];

  const isActive = (path) => {
    if (path === "/forum") {
      return location.pathname === "/forum";
    }
    return location.pathname.startsWith(path);
  };

  const handlePostClick = async (postId) => {
    try {
      const response = await getPostDetail(postId);
      
      if (response.code === 1000 && response.result) {
        const post = response.result;
        const BASE_UPLOAD_URL = "http://localhost:8088/api/v1/uploads/forum/";
        
        // Transform to full post format for modal
        const fullPost = {
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
          images: post.media?.filter(m => m.mediaType === 'image' && m.url).map(m => BASE_UPLOAD_URL + m.url) || [],
          files: post.media?.filter(m => m.mediaType === 'file' && m.url).map(m => ({
            name: m.fileName,
            size: formatFileSize(m.fileSize),
            url: BASE_UPLOAD_URL + m.url,
          })) || [],
          hasLiked: post.isLiked,
          hasBookmarked: false,
        };
        setSelectedPost(fullPost);
      }
    } catch (error) {
      console.error("Error fetching post detail:", error);
      toast.error("Không thể tải chi tiết bài viết");
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <>
      <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 shadow-lg z-20 w-[20%] overflow-y-auto">
        {/* Navigation Icons */}
        <nav className="flex items-center justify-around gap-2 p-4 border-b border-gray-200">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={index}
                onClick={item.action}
                className={`flex items-center justify-center p-3 rounded-lg transition-all ${
                  active
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-black hover:bg-gray-50'
                }`}
                title={item.label}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              </button>
            );
          })}
        </nav>

        {/* Recent Posts Section */}
        <div className="p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Clock size={16} />
            Bài đăng gần đây
          </h3>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : recentPosts.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Chưa có bài viết nào</p>
          ) : (
            <div className="space-y-2">
              {recentPosts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => handlePostClick(post.id)}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-all border border-gray-100 hover:border-gray-200"
                >
                  <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-xs text-gray-600 truncate flex-1">{post.author}</span>
                    <span className="text-xs text-gray-500">{post.time}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {post.likes} lượt thích
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  );
}
