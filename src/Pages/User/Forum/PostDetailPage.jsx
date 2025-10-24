import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostDetail from "../../../components/Popups/forum/PostDetail";
import CommentsSection from "../../../components/Popups/forum/CommentThread";
import LoadingSkeleton from "../../../components/Popups/forum/LoadingSkeleton";
import Breadcrumb from "../../../components/Popups/forum/Breadcrumb";
import { 
  User, 
  MessageSquare, 
  Award, 
  Eye,
  Clock,
  TrendingUp,
  Shield,
  Star,
  Calendar,
  Link2,
  Share2,
  Bookmark,
  Flag,
  ThumbsUp,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

// Enhanced mock post data
const mockPost = {
  id: 1,
  title: "How to improve IELTS Writing Task 2? Complete Guide & Tips",
  content: `I've been struggling with IELTS Writing Task 2 for months. After extensive practice and research, here are my comprehensive tips:

**1. Understanding the Task**
Task 2 asks you to write an essay responding to a point of view, argument, or problem. You need to write at least 250 words in about 40 minutes.

**2. Essay Structure**
- Introduction (2-3 sentences)
- Body Paragraph 1 (main idea + explanation + example)
- Body Paragraph 2 (main idea + explanation + example)
- Conclusion (2-3 sentences)

**3. Key Tips**
✅ Always plan before writing (5 minutes)
✅ Use a variety of vocabulary and grammar structures
✅ Stay on topic and answer the question directly
✅ Use linking words effectively (However, Moreover, Furthermore)
✅ Write clear topic sentences for each paragraph

**4. Common Mistakes to Avoid**
❌ Writing less than 250 words
❌ Going off-topic
❌ Using informal language
❌ Not supporting ideas with examples

Hope this helps! Feel free to ask questions below.`,
  author: {
    id: 1,
    name: "Nguyễn Văn A",
    username: "nguyenvana",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    memberSince: "Jan 2024",
    totalPosts: 45,
    totalComments: 123,
  },
  created_at: "2 giờ trước",
  edited_at: "1 giờ trước",
  likes_count: 45,
  comments_count: 23,
  views: 156,
  tags: ["IELTS", "Writing", "Tips"],
  images: [
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
  ],
  files: [
    {
      name: "IELTS_Writing_Sample_Essays.pdf",
      size: "2.5 MB",
      url: "#",
    },
  ],
  pinned: true,
  locked: false,
};

// Related posts
const relatedPosts = [
  {
    id: 2,
    title: "IELTS Speaking Part 2 - Preparation Tips",
    views: 234,
  },
  {
    id: 3,
    title: "Common Grammar Mistakes in IELTS",
    views: 189,
  },
  {
    id: 4,
    title: "How I achieved Band 8.0 in IELTS",
    views: 567,
  },
];

export default function PostDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* <ForumHeader /> */}
        <div className="container mx-auto px-4 py-6">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <ForumHeader /> */}

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Breadcrumb items={["Forum", "Bài viết"]} />

        {/* Post Header Stats Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Eye size={16} className="text-blue-600" />
                <span className="font-medium">{mockPost.views}</span>
                <span className="hidden sm:inline">lượt xem</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ThumbsUp size={16} className="text-green-600" />
                <span className="font-medium">{mockPost.likes_count}</span>
                <span className="hidden sm:inline">lượt thích</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MessageSquare size={16} className="text-purple-600" />
                <span className="font-medium">{mockPost.comments_count}</span>
                <span className="hidden sm:inline">bình luận</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} className="text-amber-600" />
                <span className="hidden sm:inline">Đăng</span>
                <span className="font-medium">{mockPost.created_at}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm font-medium ${
                  isBookmarked 
                    ? 'bg-primary-50 border-primary-300 text-primary-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                <span className="hidden sm:inline">Lưu</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                <Share2 size={16} />
                <span className="hidden sm:inline">Chia sẻ</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                <Flag size={16} />
                <span className="hidden sm:inline">Báo cáo</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Content - 3 columns */}
          <main className="lg:col-span-3 space-y-4">
            <PostDetail post={mockPost} isOwner={false} isAdmin={false} />
            <CommentsSection postId={mockPost.id} isLocked={mockPost.locked} />
          </main>

          {/* Sidebar - 1 column, Sticky */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              
              {/* Author Card - Enhanced */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Author Header */}
                <div className="bg-gradient-to-r from-primary-500 to-blue-500 h-16"></div>
                
                <div className="px-4 pb-4 -mt-8">
                  <div className="text-center">
                    <img
                      src={mockPost.author.avatar}
                      alt={mockPost.author.name}
                      className="w-16 h-16 rounded-full mx-auto mb-2 object-cover border-4 border-white shadow-lg"
                    />
                    <h3 className="font-heading font-bold text-base text-gray-900">
                      {mockPost.author.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2 font-body">
                      @{mockPost.author.username}
                    </p>
                    
                    {/* Member Badge */}
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium mb-3">
                      <CheckCircle2 size={12} />
                      Active Member
                    </div>

                    {/* Author Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <div className="text-lg font-bold text-gray-900">{mockPost.author.totalPosts}</div>
                        <div className="text-xs text-gray-600">Bài viết</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <div className="text-lg font-bold text-gray-900">{mockPost.author.totalComments}</div>
                        <div className="text-xs text-gray-600">Bình luận</div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mb-3 flex items-center justify-center gap-1">
                      <Calendar size={12} />
                      Tham gia {mockPost.author.memberSince}
                    </div>

                    <button
                      onClick={() => navigate(`/forum/me`)}
                      className="w-full px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                    >
                      Bài viết
                    </button>
                  </div>
                </div>
              </div>

              {/* Post Meta Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h4 className="font-bold text-gray-900 mb-3 text-sm font-heading">
                  Thông tin bài viết
                </h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="flex items-center gap-2">
                      <Clock size={14} className="text-primary-600" />
                      Đăng
                    </span>
                    <span className="font-medium text-gray-900">{mockPost.created_at}</span>
                  </div>
                  {mockPost.edited_at && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="flex items-center gap-2">
                        <TrendingUp size={14} className="text-blue-600" />
                        Cập nhật
                      </span>
                      <span className="font-medium text-gray-900">{mockPost.edited_at}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="flex items-center gap-2">
                      <Eye size={14} className="text-blue-600" />
                      Lượt xem
                    </span>
                    <span className="font-medium text-gray-900">{mockPost.views}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="flex items-center gap-2">
                      <MessageSquare size={14} className="text-purple-600" />
                      Phản hồi
                    </span>
                    <span className="font-medium text-gray-900">{mockPost.comments_count}</span>
                  </div>
                </div>
              </div>

              {/* Tags Cloud */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h4 className="font-bold text-gray-900 mb-3 text-sm font-heading">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {mockPost.tags.map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => navigate(`/forum?tag=${tag}`)}
                      className="px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg text-xs font-medium transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Related Posts - Enhanced */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h4 className="font-bold text-gray-900 mb-3 text-sm font-heading flex items-center gap-2">
                  <Link2 size={16} className="text-primary-600" />
                  Bài viết liên quan
                </h4>
                <div className="space-y-2">
                  {relatedPosts.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => navigate(`/forum/${post.id}`)}
                      className="block w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors group"
                    >
                      <div className="font-medium text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">
                        {post.title}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Eye size={12} />
                        {post.views} views
                      </div>
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => navigate('/forum')}
                  className="w-full mt-3 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  Xem tất cả
                  <ExternalLink size={14} />
                </button>
              </div>

              {/* Community Guidelines */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-4">
                <h4 className="font-bold text-gray-900 mb-2 text-sm font-heading flex items-center gap-2">
                  <Shield size={16} className="text-amber-600" />
                  Quy tắc cộng đồng
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Tôn trọng ý kiến người khác</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Không spam hoặc quảng cáo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Giữ nội dung phù hợp</span>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
