import React, { useState, useEffect } from 'react';
import { 
  Search,
  Eye,
  Trash2,
  MessageSquare,
  ThumbsUp,
  Calendar,
  User,
  FileText,
  TrendingUp,
  X,
  Filter,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { toast } from 'react-toastify';
import * as adminService from '../../../service/adminService';

const ForumManagement = () => {
  const [activeTab, setActiveTab] = useState('posts'); // posts, comments, statistics
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, deleted
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);

  useEffect(() => {
    if (activeTab === 'posts') {
      fetchPosts();
    } else if (activeTab === 'comments') {
      fetchComments();
    } else if (activeTab === 'statistics') {
      fetchStatistics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentPage, statusFilter, searchQuery]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const isActive = statusFilter === 'all' ? null : statusFilter === 'active';
      const search = searchQuery.trim() || null;
      
      const response = await adminService.getAllForumPosts(currentPage, pageSize, isActive, search);
      if (response.code === 1000 && response.result) {
        setPosts(response.result.content || []);
        setTotalPages(response.result.totalPages || 0);
        setTotalElements(response.result.totalElements || 0);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const isActive = statusFilter === 'all' ? null : statusFilter === 'active';
      
      const response = await adminService.getAllForumComments(currentPage, pageSize, isActive, null);
      if (response.code === 1000 && response.result) {
        setComments(response.result.content || []);
        setTotalPages(response.result.totalPages || 0);
        setTotalElements(response.result.totalElements || 0);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Không thể tải danh sách bình luận');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await adminService.getForumStatistics();
      if (response.code === 1000 && response.result) {
        setStatistics(response.result);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast.error('Không thể tải thống kê');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRestorePost = async (postId, isActive) => {
    const action = isActive ? 'delete' : 'restore';
    const confirmMsg = isActive 
      ? 'Bạn có chắc muốn xóa bài viết này?' 
      : 'Bạn có chắc muốn khôi phục bài viết này?';
    
    if (!window.confirm(confirmMsg)) return;
    
    try {
      const response = await adminService.deleteOrRestoreForumPost(postId, action);
      if (response.code === 1000) {
        toast.success(isActive ? 'Đã xóa bài viết' : 'Đã khôi phục bài viết');
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting/restoring post:', error);
      toast.error('Không thể thực hiện thao tác');
    }
  };

  const handleDeleteRestoreComment = async (commentId, isActive) => {
    const action = isActive ? 'delete' : 'restore';
    const confirmMsg = isActive 
      ? 'Bạn có chắc muốn xóa bình luận này?' 
      : 'Bạn có chắc muốn khôi phục bình luận này?';
    
    if (!window.confirm(confirmMsg)) return;
    
    try {
      const response = await adminService.deleteOrRestoreForumComment(commentId, action);
      if (response.code === 1000) {
        toast.success(isActive ? 'Đã xóa bình luận' : 'Đã khôi phục bình luận');
        fetchComments();
      }
    } catch (error) {
      console.error('Error deleting/restoring comment:', error);
      toast.error('Không thể thực hiện thao tác');
    }
  };

  const handleRefresh = () => {
    setCurrentPage(0);
    if (activeTab === 'posts') fetchPosts();
    else if (activeTab === 'comments') fetchComments();
    else if (activeTab === 'statistics') fetchStatistics();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Forum</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý bài viết và bình luận của người dùng</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => { setActiveTab('posts'); setCurrentPage(0); }}
              className={`px-6 py-3 font-medium flex items-center gap-2 ${
                activeTab === 'posts'
                  ? 'border-b-2 border-gray-800 text-gray-800'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              Bài viết
            </button>
            <button
              onClick={() => { setActiveTab('comments'); setCurrentPage(0); }}
              className={`px-6 py-3 font-medium flex items-center gap-2 ${
                activeTab === 'comments'
                  ? 'border-b-2 border-gray-800 text-gray-800'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Bình luận
            </button>
            <button
              onClick={() => { setActiveTab('statistics'); setCurrentPage(0); }}
              className={`px-6 py-3 font-medium flex items-center gap-2 ${
                activeTab === 'statistics'
                  ? 'border-b-2 border-gray-800 text-gray-800'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Thống kê
            </button>
          </div>
        </div>

        {/* Filters (chỉ hiện cho Posts và Comments) */}
        {(activeTab === 'posts' || activeTab === 'comments') && (
          <div className="p-4 bg-gray-50 border-b flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={activeTab === 'posts' ? 'Tìm kiếm bài viết...' : 'Tìm kiếm bình luận...'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(0);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700"
            >
              <option value="all">Tất cả</option>
              <option value="active">Đang hoạt động</option>
              <option value="deleted">Đã xóa</option>
            </select>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {activeTab === 'posts' && (
            <div>
              {loading ? (
                <div className="text-center py-8">Đang tải...</div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Không có bài viết nào</div>
              ) : (
                <>
                  <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Tiêu đề</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Tác giả</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Thống kê</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Ngày tạo</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Trạng thái</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Hành động</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 border-r border-gray-300">
                                <button
                                  onClick={() => {
                                    setSelectedPost(post);
                                    setShowDetailModal(true);
                                  }}
                                  className="text-gray-700 hover:text-gray-900 flex items-center gap-1 text-left"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span className="line-clamp-2 font-medium text-sm">{post.title}</span>
                                </button>
                                {post.tags && post.tags.length > 0 && (
                                  <div className="flex gap-1 mt-1 flex-wrap">
                                    {post.tags.slice(0, 3).map((tag, idx) => (
                                      <span key={idx} className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3 border-r border-gray-300">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-gray-400" />
                                  <div>
                                    <div className="text-sm font-medium">{post.userFullname}</div>
                                    <div className="text-xs text-gray-500">@{post.username}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 border-r border-gray-300">
                                <div className="flex gap-3 text-xs text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {post.viewCount || 0}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <ThumbsUp className="w-3 h-3" />
                                    {post.likesCount || 0}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" />
                                    {post.commentsCount || 0}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-300">
                                {formatDate(post.createdAt)}
                              </td>
                              <td className="px-4 py-3 text-center border-r border-gray-300">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  post.isActive ? 'bg-gray-200 text-gray-800' : 'bg-gray-300 text-gray-700'
                                }`}>
                                  {post.isActive ? 'Hoạt động' : 'Đã xóa'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => handleDeleteRestorePost(post.id, post.isActive)}
                                  className={`p-1.5 rounded transition-colors ${
                                    post.isActive 
                                      ? 'text-gray-700 hover:bg-gray-200' 
                                      : 'text-gray-600 hover:bg-gray-100'
                                  }`}
                                  title={post.isActive ? 'Xóa' : 'Khôi phục'}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-300 flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Hiển thị {posts.length} / {totalElements}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                          disabled={currentPage === 0 || loading}
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Trước
                        </button>
                        <span className="px-3 py-1.5 text-sm text-gray-700">Trang {currentPage + 1} / {totalPages || 1}</span>
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                          disabled={currentPage >= totalPages - 1 || loading}
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Sau
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div>
              {loading ? (
                <div className="text-center py-8">Đang tải...</div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Không có bình luận nào</div>
              ) : (
                <>
                  <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Nội dung</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Bài viết</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Tác giả</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Thống kê</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Trạng thái</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Hành động</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-300">
                          {comments.map((comment) => (
                            <tr key={comment.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 border-r border-gray-300">
                                <p className="text-sm line-clamp-2">{truncateText(comment.content, 150)}</p>
                              </td>
                              <td className="px-4 py-3 border-r border-gray-300">
                                <p className="text-sm text-gray-600 line-clamp-1">{comment.postTitle}</p>
                              </td>
                              <td className="px-4 py-3 border-r border-gray-300">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-gray-400" />
                                  <div>
                                    <div className="text-sm font-medium">{comment.userFullname}</div>
                                    <div className="text-xs text-gray-500">@{comment.username}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 border-r border-gray-300">
                                <div className="flex gap-3 text-xs text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <ThumbsUp className="w-3 h-3" />
                                    {comment.likesCount || 0}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" />
                                    {comment.repliesCount || 0} trả lời
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center border-r border-gray-300">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  comment.isActive ? 'bg-gray-200 text-gray-800' : 'bg-gray-300 text-gray-700'
                                }`}>
                                  {comment.isActive ? 'Hoạt động' : 'Đã xóa'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => handleDeleteRestoreComment(comment.id, comment.isActive)}
                                  className={`p-1.5 rounded transition-colors ${
                                    comment.isActive 
                                      ? 'text-gray-700 hover:bg-gray-200' 
                                      : 'text-gray-600 hover:bg-gray-100'
                                  }`}
                                  title={comment.isActive ? 'Xóa' : 'Khôi phục'}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-300 flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Hiển thị {comments.length} / {totalElements}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                          disabled={currentPage === 0 || loading}
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Trước
                        </button>
                        <span className="px-3 py-1.5 text-sm text-gray-700">Trang {currentPage + 1} / {totalPages || 1}</span>
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                          disabled={currentPage >= totalPages - 1 || loading}
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Sau
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'statistics' && (
            <div>
              {loading ? (
                <div className="text-center py-8">Đang tải...</div>
              ) : statistics ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Posts Statistics */}
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-gray-700 rounded-lg">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">Bài viết</h3>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tổng số:</span>
                        <span className="font-bold text-gray-800">{statistics.totalPosts || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Hoạt động:</span>
                        <span className="font-bold text-gray-800">{statistics.totalActivePosts || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Đã xóa:</span>
                        <span className="font-bold text-gray-700">{statistics.totalDeletedPosts || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-1.5 border-t">
                        <span className="text-gray-600">Hôm nay:</span>
                        <span className="font-bold text-gray-800">{statistics.postsToday || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Comments Statistics */}
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-gray-700 rounded-lg">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">Bình luận</h3>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tổng số:</span>
                        <span className="font-bold text-gray-800">{statistics.totalComments || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Hoạt động:</span>
                        <span className="font-bold text-gray-800">{statistics.totalActiveComments || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Đã xóa:</span>
                        <span className="font-bold text-gray-700">{statistics.totalDeletedComments || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-1.5 border-t">
                        <span className="text-gray-600">Hôm nay:</span>
                        <span className="font-bold text-gray-800">{statistics.commentsToday || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Engagement Statistics */}
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-gray-700 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">Tương tác</h3>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Lượt thích:</span>
                        <span className="font-bold text-gray-800">{statistics.totalLikes || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Lượt xem:</span>
                        <span className="font-bold text-gray-800">{statistics.totalViews || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">TB xem/bài:</span>
                        <span className="font-bold text-gray-800">
                          {statistics.totalPosts > 0 
                            ? Math.round(statistics.totalViews / statistics.totalPosts) 
                            : 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm pt-1.5 border-t">
                        <span className="text-gray-600">TB comment/bài:</span>
                        <span className="font-bold text-gray-800">
                          {statistics.totalActivePosts > 0 
                            ? (statistics.totalComments / statistics.totalActivePosts).toFixed(1) 
                            : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">Không có dữ liệu thống kê</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Detail Modal */}
      {showDetailModal && selectedPost && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="border-b px-4 py-3 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">Chi tiết bài viết</h2>
              <button onClick={() => setShowDetailModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedPost.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{selectedPost.userFullname} (@{selectedPost.username})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(selectedPost.createdAt)}</span>
                  </div>
                </div>
              </div>

              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {selectedPost.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedPost.content}</p>
              </div>

              <div className="flex items-center justify-center gap-6 pt-3 border-t">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-500">Lượt xem</div>
                    <div className="text-sm font-bold text-gray-900">{selectedPost.viewCount || 0}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                  <ThumbsUp className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="text-xs text-gray-500">Lượt thích</div>
                    <div className="text-sm font-bold text-gray-800">{selectedPost.likesCount || 0}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="text-xs text-gray-500">Bình luận</div>
                    <div className="text-sm font-bold text-gray-800">{selectedPost.commentsCount || 0}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="text-xs text-gray-500">XP</div>
                    <div className="text-sm font-bold text-gray-800">{selectedPost.xpReward || 0}</div>
                  </div>
                </div>
              </div>

              {selectedPost.hasMedia && (
                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Bài viết có {selectedPost.mediaCount || 0} file đính kèm
                  </div>
                </div>
              )}
            </div>
            <div className="border-t px-4 py-3 flex justify-end gap-2 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  handleDeleteRestorePost(selectedPost.id, selectedPost.isActive);
                  setShowDetailModal(false);
                }}
                className={`px-4 py-2 rounded-lg ${
                  selectedPost.isActive
                    ? 'bg-gray-700 hover:bg-gray-800 text-white'
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                {selectedPost.isActive ? 'Xóa bài viết' : 'Khôi phục bài viết'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumManagement;
