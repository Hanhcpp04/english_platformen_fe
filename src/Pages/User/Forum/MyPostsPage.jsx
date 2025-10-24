import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  ThumbsUp,
  Eye,
  TrendingUp,
  Calendar,
  Award,
  Edit3,
  Settings,
  Share2,
  Filter,
  ArrowUpDown,
  PlusCircle,
  Heart,
  MessageCircle,
  FileText,
  ChevronDown,
  Star,
  Clock,
  Activity,
  Trash2,
  Pin,
  Lock,
  Unlock,
  MoreVertical,
  BarChart3,
} from "lucide-react";
import { toast } from "react-toastify";
import PostCard from "../../../components/Popups/forum/PostCard";
import Breadcrumb from "../../../components/Popups/forum/Breadcrumb";
import EmptyState from "../../../components/Popups/forum/EmptyState";


// Mock user data
const currentUser = {
  id: 1,
  name: "Nguyễn Văn A",
  username: "nguyenvana",
  avatar: "https://randomuser.me/api/portraits/men/46.jpg",
  coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200",
  bio: "Passionate English learner | IELTS 7.5 | Sharing my learning journey 📚",
  totalPosts: 12,
  totalComments: 45,
  totalLikes: 234,
  totalViews: 2847,
  memberSince: "Jan 2024",
  badges: [
    { name: "Top Contributor", icon: "🏆", color: "yellow" },
    { name: "Helpful", icon: "💡", color: "blue" },
    { name: "Active Member", icon: "⚡", color: "purple" },
  ],
  level: "Advanced",
  rank: "#23",
};

// Mock posts data
const mockPosts = [
  {
    id: 3,
    title: "Tips for improving IELTS Speaking confidence",
    content: "Practice speaking in front of mirror, record yourself and listen back to improve pronunciation. Focus on fluency over accuracy in the beginning...",
    author: currentUser,
    created_at: "3 ngày trước",
    likes_count: 18,
    comments_count: 7,
    views: 156,
    tags: ["IELTS", "Speaking"],
    images: [],
    pinned: false,
    locked: false,
  },
  {
    id: 7,
    title: "Common mistakes in English grammar",
    content: "Let's discuss the most common grammar mistakes Vietnamese learners make when learning English...",
    author: currentUser,
    created_at: "1 tuần trước",
    likes_count: 32,
    comments_count: 15,
    views: 289,
    tags: ["Grammar", "Tips"],
    images: ["https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600"],
    pinned: false,
    locked: false,
  },
];

// Mock comments
const mockComments = [
  {
    id: 1,
    postTitle: "How to improve IELTS Writing Task 2?",
    postId: 1,
    content: "Great tips! I especially like the planning technique. Thanks for sharing!",
    created_at: "2 giờ trước",
    likes_count: 5,
  },
  {
    id: 2,
    postTitle: "Best resources for learning vocabulary",
    postId: 5,
    content: "I've been using Anki and it works great. Highly recommend for spaced repetition.",
    created_at: "1 ngày trước",
    likes_count: 12,
  },
];

// Mock liked posts
const mockLikedPosts = [
  {
    id: 1,
    title: "How to improve IELTS Writing Task 2? Complete Guide & Tips",
    content: "I've been struggling with IELTS Writing Task 2 for months...",
    author: {
      id: 2,
      name: "Trần Thị B",
      username: "tranthib",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    created_at: "2 giờ trước",
    likes_count: 45,
    comments_count: 23,
    views: 567,
    tags: ["IELTS", "Writing", "Tips"],
    images: [],
    pinned: true,
    locked: false,
  },
];

export default function MyPostsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("posts");
  const [sortBy, setSortBy] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState(mockPosts);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  const sortOptions = [
    { value: "recent", label: "Mới nhất" },
    { value: "popular", label: "Phổ biến" },
    { value: "mostLiked", label: "Nhiều lượt thích" },
    { value: "mostCommented", label: "Nhiều bình luận" },
  ];

  // Handle post actions
  const handleEditPost = (postId) => {
    navigate(`/forum/edit/${postId}`);
    setShowActionMenu(null);
  };

  const handleDeletePost = (postId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      setPosts(posts.filter(p => p.id !== postId));
      toast.success("Đã xóa bài viết thành công!");
      setShowActionMenu(null);
    }
  };

  const handlePinPost = (postId) => {
    setPosts(posts.map(p => 
      p.id === postId ? { ...p, pinned: !p.pinned } : p
    ));
    const post = posts.find(p => p.id === postId);
    toast.success(post?.pinned ? "Đã bỏ ghim bài viết" : "Đã ghim bài viết");
    setShowActionMenu(null);
  };

  const handleLockPost = (postId) => {
    setPosts(posts.map(p => 
      p.id === postId ? { ...p, locked: !p.locked } : p
    ));
    const post = posts.find(p => p.id === postId);
    toast.success(post?.locked ? "Đã mở khóa bình luận" : "Đã khóa bình luận");
    setShowActionMenu(null);
  };

  const handleViewStats = (postId) => {
    toast.info("Tính năng thống kê đang được phát triển!");
    setShowActionMenu(null);
  };

  const tabConfig = [
    {
      id: "posts",
      label: "Bài viết",
      icon: FileText,
      count: mockPosts.length,
      color: "primary",
    },
    {
      id: "comments",
      label: "Bình luận",
      icon: MessageCircle,
      count: mockComments.length,
      color: "blue",
    },
    {
      id: "liked",
      label: "Đã thích",
      icon: Heart,
      count: mockLikedPosts.length,
      color: "red",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <ForumHeader /> */}

      <div className="container mx-auto px-4 py-6">
        <Breadcrumb items={["Forum", "Hồ sơ của tôi"]} />

        {/* Grid Layout: Sidebar + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* SIDEBAR - Sticky Profile Card */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              
              {/* Profile Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Cover Image */}
                <div className="h-24 bg-gradient-to-r from-primary-500 via-primary-600 to-blue-600 relative">
                  <img
                    src={currentUser.coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover opacity-30"
                  />
                </div>

                {/* Profile Info */}
                <div className="px-4 pb-4">
                  {/* Avatar */}
                  <div className="flex justify-center -mt-12 mb-3">
                    <div className="relative">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-2 py-0.5 rounded-md text-xs font-bold shadow">
                        {currentUser.level}
                      </div>
                    </div>
                  </div>

                  {/* Name and Username */}
                  <div className="text-center mb-3">
                    <h2 className="font-heading font-bold text-xl text-gray-900 mb-1">
                      {currentUser.name}
                    </h2>
                    <p className="text-sm text-gray-600 font-medium mb-2">
                      @{currentUser.username}
                    </p>
                    
                    {/* Badges */}
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {currentUser.badges.map((badge, idx) => (
                        <span
                          key={idx}
                          className="text-lg"
                          title={badge.name}
                        >
                          {badge.icon}
                        </span>
                      ))}
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-gray-700 font-body leading-relaxed">
                      {currentUser.bio}
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-gray-900">{currentUser.totalPosts}</div>
                      <div className="text-xs text-gray-600">Bài viết</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-gray-900">{currentUser.totalComments}</div>
                      <div className="text-xs text-gray-600">Bình luận</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-gray-900">{currentUser.totalLikes}</div>
                      <div className="text-xs text-gray-600">Lượt thích</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-gray-900">{currentUser.totalViews}</div>
                      <div className="text-xs text-gray-600">Lượt xem</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate("/forum/create")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg transition-all font-semibold"
                    >
                      <PlusCircle size={18} />
                      Tạo bài viết
                    </button>
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all">
                        <Settings size={16} />
                        <span className="text-sm font-medium">Cài đặt</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all">
                        <Share2 size={16} />
                        <span className="text-sm font-medium">Chia sẻ</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Activity size={18} className="text-primary-600" />
                  Thông tin thêm
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Calendar size={14} />
                      Tham gia
                    </span>
                    <span className="font-medium text-gray-900">{currentUser.memberSince}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center gap-2">
                      <TrendingUp size={14} />
                      Xếp hạng
                    </span>
                    <span className="font-medium text-primary-600">{currentUser.rank}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Star size={14} />
                      Huy hiệu
                    </span>
                    <span className="font-medium text-gray-900">{currentUser.badges.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="lg:col-span-3">
            {/* Tabs and Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                    {tabConfig.map((tabItem) => {
                      const Icon = tabItem.icon;
                      const isActive = tab === tabItem.id;
                      return (
                        <button
                          key={tabItem.id}
                          onClick={() => setTab(tabItem.id)}
                          className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap text-sm ${
                            isActive
                              ? "bg-white text-primary-600 shadow-sm"
                              : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                          }`}
                        >
                          <Icon size={16} />
                          <span>{tabItem.label}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                              isActive
                                ? "bg-primary-100 text-primary-700"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {tabItem.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Sort and Filter Controls */}
                  {tab === "posts" && (
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <button
                          onClick={() => setShowFilters(!showFilters)}
                          className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-all text-sm"
                        >
                          <ArrowUpDown size={14} />
                          <span className="font-medium hidden sm:inline">
                            {sortOptions.find((opt) => opt.value === sortBy)?.label}
                          </span>
                          <ChevronDown size={14} />
                        </button>
                        
                        {showFilters && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10">
                            {sortOptions.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => {
                                  setSortBy(option.value);
                                  setShowFilters(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm ${
                                  sortBy === option.value
                                    ? "bg-primary-50 text-primary-600 font-semibold"
                                    : "text-gray-700"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-4">
                {/* Posts Tab */}
                {tab === "posts" && (
                  <div className="space-y-4">
                    {posts.length > 0 ? (
                      posts.map((post) => (
                        <div key={post.id} className="relative group">
                          {/* Post Card with Management Overlay */}
                          <div 
                            className="cursor-pointer"
                            onClick={() => navigate(`/forum/${post.id}`)}
                          >
                            <PostCard post={post} onClick={() => {}} />
                          </div>

                          {/* Management Actions - Show on hover */}
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowActionMenu(showActionMenu === post.id ? null : post.id);
                                }}
                                className="p-2 bg-white hover:bg-gray-100 rounded-lg shadow-md border border-gray-200 transition-all"
                              >
                                <MoreVertical size={18} className="text-gray-700" />
                              </button>

                              {/* Action Dropdown Menu */}
                              {showActionMenu === post.id && (
                                <div 
                                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {/* Edit */}
                                  <button
                                    onClick={() => handleEditPost(post.id)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                                  >
                                    <Edit3 size={16} className="text-blue-600" />
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">Chỉnh sửa</div>
                                      <div className="text-xs text-gray-500">Sửa nội dung bài viết</div>
                                    </div>
                                  </button>

                                  {/* Pin/Unpin */}
                                  <button
                                    onClick={() => handlePinPost(post.id)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                                  >
                                    <Pin size={16} className={post.pinned ? "text-primary-600" : "text-gray-600"} />
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {post.pinned ? "Bỏ ghim" : "Ghim bài viết"}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {post.pinned ? "Bỏ ghim khỏi đầu trang" : "Ghim lên đầu trang"}
                                      </div>
                                    </div>
                                  </button>

                                  {/* Lock/Unlock */}
                                  <button
                                    onClick={() => handleLockPost(post.id)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                                  >
                                    {post.locked ? (
                                      <Unlock size={16} className="text-green-600" />
                                    ) : (
                                      <Lock size={16} className="text-amber-600" />
                                    )}
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {post.locked ? "Mở khóa" : "Khóa bình luận"}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {post.locked ? "Cho phép bình luận" : "Không cho phép bình luận"}
                                      </div>
                                    </div>
                                  </button>

                                  {/* View Stats */}
                                  <button
                                    onClick={() => handleViewStats(post.id)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left border-t border-gray-100"
                                  >
                                    <BarChart3 size={16} className="text-purple-600" />
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">Thống kê</div>
                                      <div className="text-xs text-gray-500">Xem chi tiết analytics</div>
                                    </div>
                                  </button>

                                  {/* Delete */}
                                  <button
                                    onClick={() => handleDeletePost(post.id)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left border-t border-gray-100"
                                  >
                                    <Trash2 size={16} className="text-red-600" />
                                    <div>
                                      <div className="text-sm font-medium text-red-600">Xóa bài viết</div>
                                      <div className="text-xs text-red-400">Không thể hoàn tác</div>
                                    </div>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Status Badges */}
                          <div className="absolute top-4 left-4 flex gap-2 pointer-events-none">
                            {post.pinned && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-primary-600 text-white rounded-md text-xs font-semibold shadow-sm">
                                <Pin size={12} />
                                Ghim
                              </span>
                            )}
                            {post.locked && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-amber-600 text-white rounded-md text-xs font-semibold shadow-sm">
                                <Lock size={12} />
                                Khóa
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <EmptyState
                        message="Bạn chưa có bài viết nào"
                        action={() => navigate("/forum/create")}
                        actionLabel="Tạo bài viết đầu tiên"
                      />
                    )}
                  </div>
                )}

                {/* Comments Tab */}
                {tab === "comments" && (
                  <div className="space-y-3">
                    {mockComments.length > 0 ? (
                      mockComments.map((comment) => (
                        <div
                          key={comment.id}
                          className="group bg-gray-50 hover:bg-white rounded-lg p-4 border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
                          onClick={() => navigate(`/forum/${comment.postId}`)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors flex-shrink-0">
                              <MessageCircle size={18} className="text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-gray-500 mb-1 font-medium">
                                Bình luận trong bài viết
                              </div>
                              <h4 className="text-sm text-primary-600 font-semibold hover:text-primary-700 transition-colors line-clamp-1 mb-2">
                                {comment.postTitle}
                              </h4>
                              <p className="text-sm text-gray-700 font-body mb-2 line-clamp-2">
                                {comment.content}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock size={12} />
                                  {comment.created_at}
                                </span>
                                <span className="flex items-center gap-1 text-red-600">
                                  <Heart size={12} />
                                  {comment.likes_count}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <EmptyState message="Bạn chưa có bình luận nào" />
                    )}
                  </div>
                )}

                {/* Liked Posts Tab */}
                {tab === "liked" && (
                  <div className="space-y-4">
                    {mockLikedPosts.length > 0 ? (
                      mockLikedPosts.map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          onClick={() => navigate(`/forum/${post.id}`)}
                        />
                      ))
                    ) : (
                      <EmptyState message="Bạn chưa thích bài viết nào" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
