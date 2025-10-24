import React from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Users,
  MessageSquare,
  TrendingUp,
  FileText,
} from "lucide-react";

export default function ForumSidebar() {
  // Mock data
  const tags = [
    { name: "All", count: 1234, color: "bg-blue-500" },
    { name: "Grammar", count: 456, color: "bg-primary-600" },
    { name: "Vocabulary", count: 789, color: "bg-yellow-500" },
    { name: "IELTS", count: 234, color: "bg-red-500" },
    { name: "Speaking", count: 123, color: "bg-purple-500" },
    { name: "Writing", count: 98, color: "bg-pink-500" },
    { name: "Listening", count: 156, color: "bg-indigo-500" },
  ];

  const topContributors = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      posts: 45,
    },
    {
      id: 2,
      name: "Trần Thị B",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      posts: 38,
    },
    {
      id: 3,
      name: "Lê Văn C",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      posts: 32,
    },
    {
      id: 4,
      name: "Phạm Thị D",
      avatar: "https://randomuser.me/api/portraits/women/50.jpg",
      posts: 28,
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      avatar: "https://randomuser.me/api/portraits/men/51.jpg",
      posts: 25,
    },
  ];

  const stats = [
    {
      icon: <MessageSquare size={20} />,
      label: "Tổng bài viết",
      value: "1,234",
    },
    { icon: <TrendingUp size={20} />, label: "Tổng bình luận", value: "5,678" },
    { icon: <Users size={20} />, label: "Thành viên", value: "890" },
    { icon: <BarChart3 size={20} />, label: "Hoạt động hôm nay", value: "45" },
  ];

  // My posts data
  const myPosts = [
    {
      id: 1,
      title: "How to improve IELTS Writing Task 2?",
      views: 156,
      comments: 23,
      created_at: "2 giờ trước",
    },
    {
      id: 2,
      title: "Kinh nghiệm luyện nghe tiếng Anh",
      views: 89,
      comments: 12,
      created_at: "1 ngày trước",
    },
    {
      id: 3,
      title: "Top 10 Common Grammar Mistakes",
      views: 234,
      comments: 31,
      created_at: "3 ngày trước",
    },
  ];

  return (
    <aside className="w-full space-y-4">
      <Link
        to="/forum"
        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors shrink-0"
      >
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">F</span>
        </div>
        <span className="font-heading font-bold text-xl hidden sm:block text-dark-primary">
          Forum
        </span>
      </Link>
      <hr />
      {/* My Posts Section - NEW */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h4 className="font-heading font-bold text-lg mb-3 text-dark-primary flex items-center gap-2">
          <span className="w-1 h-5 bg-primary-600 rounded-full"></span>
          Bài viết của tôi
        </h4>
        <div className="space-y-3">
          {myPosts.map((post) => (
            <Link
              key={post.id}
              to={`/forum/${post.id}`}
              className="block group hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="flex items-start gap-2 mb-2">
                <FileText
                  size={16}
                  className="text-primary-600 mt-0.5 flex-shrink-0"
                />
                <h5 className="font-semibold text-sm text-dark-primary group-hover:text-primary-600 transition-colors line-clamp-2 font-body">
                  {post.title}
                </h5>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 font-body ml-6">
                <span>{post.views} lượt xem</span>
                <span>•</span>
                <span>{post.comments} bình luận</span>
                <span>•</span>
                <span>{post.created_at}</span>
              </div>
            </Link>
          ))}
        </div>
        <Link
          to="/forum/me"
          className="block mt-3 text-center text-sm text-primary-600 hover:text-primary-700 font-medium font-body"
        >
          Xem tất cả →
        </Link>
      </div>

      {/* Tags/Topics Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h4 className="font-heading font-bold text-lg mb-3 text-dark-primary flex items-center gap-2">
          <span className="w-1 h-5 bg-primary-600 rounded-full"></span>
          Topics
        </h4>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.name}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:shadow-md hover:scale-105 active:scale-95 font-body"
              style={{
                backgroundColor: tag.color + "20",
                color: tag.color.replace("bg-", "text-"),
              }}
            >
              <span className={`w-2 h-2 rounded-full ${tag.color}`}></span>
              {tag.name}
              <span className="text-xs opacity-75">({tag.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Top Contributors Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h4 className="font-heading font-bold text-lg mb-3 text-dark-primary flex items-center gap-2">
          <span className="w-1 h-5 bg-primary-600 rounded-full"></span>
          Top Contributors
        </h4>
        <p className="text-xs text-gray-500 mb-3 font-body">Tuần này</p>
        <div className="space-y-3">
          {topContributors.map((user, idx) => (
            <Link
              key={user.id}
              to={`/forum/user/${user.id}`}
              className="flex items-center gap-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-dark-primary group-hover:text-primary-600 transition-colors truncate font-body">
                  {user.name}
                </div>
                <div className="text-xs text-gray-500 font-body">
                  {user.posts} bài viết
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Forum Stats Section */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl shadow-sm border border-primary-200 p-4">
        <h4 className="font-heading font-bold text-lg mb-3 text-primary-700 flex items-center gap-2">
          <BarChart3 size={20} />
          Forum Stats
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/60 backdrop-blur-sm rounded-lg p-3 hover:bg-white/80 transition-all"
            >
              <div className="text-primary-600 mb-1">{stat.icon}</div>
              <div className="font-bold text-lg text-dark-primary font-heading">
                {stat.value}
              </div>
              <div className="text-xs text-gray-600 font-body">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
