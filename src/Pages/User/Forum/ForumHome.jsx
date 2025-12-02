import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  BookOpen, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Award,
  Sparkles,
  FileText,
  Heart,
  Eye,
  ArrowRight,
  Zap,
  Target,
  BookMarked
} from "lucide-react";

export default function ForumHome() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Forum statistics
  const stats = {
    totalPosts: 1234,
    totalComments: 5678,
    totalMembers: 890,
    todayActive: 45
  };

  // Main features
  const features = [
    {
      icon: BookOpen,
      title: "Xem tất cả bài viết",
      description: "Khám phá hàng ngàn bài viết từ cộng đồng học tiếng Anh",
      color: "from-blue-500 to-blue-600",
      action: () => navigate("/forum/posts"),
      stats: `${stats.totalPosts} bài viết`
    },
    {
      icon: Plus,
      title: "Tạo bài viết mới",
      description: "Chia sẻ kiến thức, kinh nghiệm hoặc đặt câu hỏi",
      color: "from-green-500 to-green-600",
      action: () => navigate("/forum/create"),
      stats: "Bắt đầu ngay"
    },
    {
      icon: Search,
      title: "Tìm kiếm",
      description: "Tìm bài viết, chủ đề hoặc người dùng bạn quan tâm",
      color: "from-purple-500 to-purple-600",
      action: () => navigate("/forum/search"),
      stats: "Khám phá"
    },
    {
      icon: Users,
      title: "Hồ sơ của tôi",
      description: "Quản lý bài viết, bình luận và hoạt động của bạn",
      color: "from-orange-500 to-orange-600",
      action: () => navigate("/forum/my-posts"),
      stats: "Xem hồ sơ"
    }
  ];

  // Quick topics
  const topics = [
    { name: "IELTS", icon: Award, count: 456 },
    { name: "Grammar", icon: BookMarked, count: 789 },
    { name: "Vocabulary", icon: Sparkles, count: 634 },
    { name: "Speaking", icon: MessageSquare, count: 342 },
    { name: "Writing", icon: FileText, count: 287 },
    { name: "Listening", icon: Zap, count: 198 }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/forum/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-green-350 to-green-500 text-white">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-4xl mb-3">
              Forum Học Tiếng Anh
            </h1>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto">
              Chia sẻ kinh nghiệm và cùng nhau tiến bộ
            </p>
          </div>
           <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalPosts}</div>
            <div className="text-xs text-gray-600">Bài viết</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalComments}</div>
            <div className="text-xs text-gray-600">Bình luận</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalMembers}</div>
            <div className="text-xs text-gray-600">Thành viên</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.todayActive}</div>
            <div className="text-xs text-gray-600">Hoạt động</div>
          </div>
        </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Main Features - 4 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                onClick={feature.action}
                className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-200 hover:border-primary-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon size={28} className="text-white" strokeWidth={2.5} />
                  </div>
                  
                  <h3 className="font-heading font-bold text-sm text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-xs mb-2">
                    {feature.stats}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Topics Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="font-heading font-bold text-lg text-gray-900 mb-4 flex items-center">
            <TrendingUp size={20} className="mr-2 text-primary-600" />
            Chủ đề phổ biến
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {topics.map((topic, index) => {
              const TopicIcon = topic.icon;
              return (
                <div
                  key={index}
                  onClick={() => navigate(`/forum/posts?topic=${topic.name.toLowerCase()}`)}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg p-3 cursor-pointer transition-colors border border-gray-100 hover:border-primary-300"
                >
                  <div className="flex flex-col items-center text-center">
                    <TopicIcon size={24} className="text-primary-600 mb-2" />
                    <div className="font-medium text-xs text-gray-900 mb-1">{topic.name}</div>
                    <div className="text-xs text-gray-500">{topic.count} bài</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Trending Posts */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="font-heading font-bold text-lg text-gray-900 mb-4 flex items-center">
              <Heart size={20} className="mr-2 text-red-500" />
              Bài viết nổi bật
            </h2>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-start p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  onClick={() => navigate('/forum/posts')}
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-1">
                      Tips học IELTS hiệu quả trong 3 tháng
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 space-x-3">
                      <span className="flex items-center">
                        <Eye size={14} className="mr-1" />
                        {Math.floor(Math.random() * 500 + 100)}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare size={14} className="mr-1" />
                        {Math.floor(Math.random() * 50 + 10)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/forum/posts')}
              className="w-full mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center justify-center py-2 hover:bg-primary-50 rounded-lg transition-colors"
            >
              Xem tất cả
              <ArrowRight size={16} className="ml-1" />
            </button>
          </div>

          {/* New Posts */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="font-heading font-bold text-lg text-gray-900 mb-4 flex items-center">
              <Sparkles size={20} className="mr-2 text-yellow-500" />
              Bài viết mới nhất
            </h2>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-start p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  onClick={() => navigate('/forum/posts')}
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-1">
                      Cách học từ vựng hiệu quả cho người mới bắt đầu
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 space-x-3">
                      <span className="flex items-center">
                        <Eye size={14} className="mr-1" />
                        {Math.floor(Math.random() * 100 + 10)}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare size={14} className="mr-1" />
                        {Math.floor(Math.random() * 20 + 1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/forum/posts')}
              className="w-full mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center justify-center py-2 hover:bg-primary-50 rounded-lg transition-colors"
            >
              Xem tất cả
              <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
