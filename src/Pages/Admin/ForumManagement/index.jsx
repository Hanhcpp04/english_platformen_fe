import React, { useState, useEffect } from 'react';
import { 
  Search,
  Eye,
  Trash2,
  MessageSquare,
  Flag,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  User,
  ThumbsUp,
  Calendar,
  Ban,
  X
} from 'lucide-react';

const ForumManagement = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [searchQuery, statusFilter, posts]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Mock data - Replace with actual API call
      setTimeout(() => {
        const mockPosts = [
          {
            id: 1,
            userId: 1,
            username: 'johndoe',
            userFullname: 'John Doe',
            title: 'How to improve speaking skills?',
            content: 'I have been learning English for 2 years but still struggle with speaking...',
            tags: ['speaking', 'tips', 'practice'],
            viewCount: 245,
            likeCount: 18,
            commentCount: 12,
            status: 'published',
            isReported: false,
            reportCount: 0,
            createdAt: '2024-11-19T10:30:00',
            updatedAt: '2024-11-19T10:30:00'
          },
          {
            id: 2,
            userId: 2,
            username: 'janesmith',
            userFullname: 'Jane Smith',
            title: 'Best grammar resources for beginners',
            content: 'Can anyone recommend good online resources for learning English grammar?',
            tags: ['grammar', 'resources', 'beginner'],
            viewCount: 189,
            likeCount: 24,
            commentCount: 15,
            status: 'published',
            isReported: false,
            reportCount: 0,
            createdAt: '2024-11-18T14:20:00',
            updatedAt: '2024-11-18T14:20:00'
          },
          {
            id: 3,
            userId: 3,
            username: 'mikejohnson',
            userFullname: 'Mike Johnson',
            title: 'INAPPROPRIATE CONTENT - SPAM',
            content: 'Click here for free English courses!!! Visit my website now!!!',
            tags: ['spam'],
            viewCount: 56,
            likeCount: 0,
            commentCount: 3,
            status: 'published',
            isReported: true,
            reportCount: 5,
            createdAt: '2024-11-20T08:15:00',
            updatedAt: '2024-11-20T08:15:00'
          },
          {
            id: 4,
            userId: 4,
            username: 'sarahwilson',
            userFullname: 'Sarah Wilson',
            title: 'Tips for IELTS Writing Task 2',
            content: 'Here are some useful strategies I used to improve my IELTS writing score...',
            tags: ['ielts', 'writing', 'tips'],
            viewCount: 412,
            likeCount: 56,
            commentCount: 28,
            status: 'published',
            isReported: false,
            reportCount: 0,
            createdAt: '2024-11-17T16:45:00',
            updatedAt: '2024-11-18T09:20:00'
          },
          {
            id: 5,
            userId: 5,
            username: 'tombrown',
            userFullname: 'Tom Brown',
            title: 'English vs American pronunciation',
            content: 'What are the main differences between British and American pronunciation?',
            tags: ['pronunciation', 'accent', 'question'],
            viewCount: 178,
            likeCount: 15,
            commentCount: 9,
            status: 'hidden',
            isReported: false,
            reportCount: 0,
            createdAt: '2024-11-20T11:00:00',
            updatedAt: '2024-11-20T11:30:00'
          }
        ];
        setPosts(mockPosts);
        setFilteredPosts(mockPosts);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    if (statusFilter !== 'all') {
      if (statusFilter === 'reported') {
        filtered = filtered.filter(p => p.isReported);
      } else {
        filtered = filtered.filter(p => p.status === statusFilter);
      }
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.userFullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  };

  const handleViewDetails = (post) => {
    setSelectedPost(post);
    setShowDetailModal(true);
  };

  const handleDeletePost = (postId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      setPosts(posts.filter(p => p.id !== postId));
      setShowDetailModal(false);
    }
  };

  const handleTogglePostStatus = (postId, newStatus) => {
    setPosts(posts.map(p => 
      p.id === postId ? { ...p, status: newStatus } : p
    ));
    if (selectedPost?.id === postId) {
      setSelectedPost({ ...selectedPost, status: newStatus });
    }
  };

  const stats = [
    {
      label: 'Tổng bài viết',
      value: posts.length,
      icon: MessageSquare,
      color: 'blue'
    },
    {
      label: 'Đang hiển thị',
      value: posts.filter(p => p.status === 'published').length,
      icon: CheckCircle,
      color: 'green'
    },
    {
      label: 'Bị ẩn',
      value: posts.filter(p => p.status === 'hidden').length,
      icon: XCircle,
      color: 'gray'
    },
    {
      label: 'Bị báo cáo',
      value: posts.filter(p => p.isReported).length,
      icon: Flag,
      color: 'red'
    }
  ];

  const DetailModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Chi tiết bài viết</h2>
          <button
            onClick={() => setShowDetailModal(false)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Author Info */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-medium">
                {selectedPost?.userFullname.charAt(0)}
              </div>
              <div>
                <div className="text-base font-medium text-gray-900">{selectedPost?.userFullname}</div>
                <div className="text-sm text-gray-500">@{selectedPost?.username}</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {new Date(selectedPost?.createdAt).toLocaleString('vi-VN')}
            </div>
          </div>

          {/* Status & Reports */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
              selectedPost?.status === 'published'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {selectedPost?.status === 'published' ? (
                <><CheckCircle className="w-4 h-4" /> Đang hiển thị</>
              ) : (
                <><XCircle className="w-4 h-4" /> Đã ẩn</>
              )}
            </span>
            {selectedPost?.isReported && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                <Flag className="w-4 h-4" />
                {selectedPost.reportCount} báo cáo
              </span>
            )}
          </div>

          {/* Title */}
          <div>
            <div className="text-2xl font-semibold text-gray-900">{selectedPost?.title}</div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {selectedPost?.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                #{tag}
              </span>
            ))}
          </div>

          {/* Content */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Nội dung:</div>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-900 leading-relaxed">
              {selectedPost?.content}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">{selectedPost?.viewCount}</div>
              <div className="text-xs text-gray-500">Lượt xem</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">{selectedPost?.likeCount}</div>
              <div className="text-xs text-gray-500">Lượt thích</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">{selectedPost?.commentCount}</div>
              <div className="text-xs text-gray-500">Bình luận</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            {selectedPost?.status === 'published' ? (
              <button
                onClick={() => handleTogglePostStatus(selectedPost.id, 'hidden')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100"
              >
                <Ban className="w-4 h-4" />
                Ẩn bài viết
              </button>
            ) : (
              <button
                onClick={() => handleTogglePostStatus(selectedPost.id, 'published')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100"
              >
                <CheckCircle className="w-4 h-4" />
                Hiển thị lại
              </button>
            )}
            <button
              onClick={() => handleDeletePost(selectedPost.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100"
            >
              <Trash2 className="w-4 h-4" />
              Xóa vĩnh viễn
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-56">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header + Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Quản lý Forum</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kiểm duyệt và quản lý bài viết</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm bài viết hoặc người dùng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md w-64 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="published">Đang hiển thị</option>
              <option value="hidden">Đã ẩn</option>
              <option value="reported">Bị báo cáo</option>
            </select>
          </div>

          <button className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Xuất
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-3 bg-white border border-gray-200 rounded-md px-3 py-2 min-w-[160px]">
            <div className={`p-2 rounded-md bg-${stat.color}-50`}>
              <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
            </div>
            <div>
              <div className="text-xs text-gray-500">{stat.label}</div>
              <div className="text-sm font-semibold text-gray-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Tác giả</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Tiêu đề</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Tương tác</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Trạng thái</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Ngày tạo</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPosts.map((post) => (
                <tr key={post.id} className={`hover:bg-gray-50 ${post.isReported ? 'bg-red-50/50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                        {post.userFullname.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{post.userFullname}</div>
                        <div className="text-xs text-gray-500">@{post.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="max-w-md">
                      <div className="text-sm font-medium text-gray-900 truncate">{post.title}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="text-xs text-blue-600">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.viewCount}
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {post.likeCount}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {post.commentCount}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs w-fit ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {post.status === 'published' ? (
                          <><CheckCircle className="w-3 h-3" /> Hiển thị</>
                        ) : (
                          <><XCircle className="w-3 h-3" /> Đã ẩn</>
                        )}
                      </span>
                      {post.isReported && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800 w-fit">
                          <Flag className="w-3 h-3" />
                          {post.reportCount} báo cáo
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(post)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {post.status === 'published' ? (
                        <button
                          onClick={() => handleTogglePostStatus(post.id, 'hidden')}
                          className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                          title="Ẩn"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleTogglePostStatus(post.id, 'published')}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Hiển thị"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex items-center justify-between text-sm">
          <div className="text-gray-600">
            Hiển thị <span className="font-medium text-gray-900">{filteredPosts.length}</span> / <span className="font-medium">{posts.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 text-sm border border-gray-200 rounded hover:bg-gray-100">Trước</button>
            <button className="px-2 py-1 text-sm bg-blue-600 text-white rounded">1</button>
            <button className="px-2 py-1 text-sm border border-gray-200 rounded hover:bg-gray-100">Tiếp</button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900 mb-1">Không tìm thấy bài viết</h3>
          <p className="text-sm text-gray-600">Thử điều chỉnh bộ lọc hoặc tìm kiếm</p>
        </div>
      )}

      {showDetailModal && selectedPost && <DetailModal />}
    </div>
  );
};

export default ForumManagement;
