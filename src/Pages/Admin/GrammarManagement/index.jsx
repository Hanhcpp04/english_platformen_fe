import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  BookOpen,
  CheckCircle,
  XCircle,
  X,
  Save,
  FileText,
  Target,
  ChevronDown,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';
import * as adminService from '../../../service/adminService';

const GrammarManagement = () => {
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    xpReward: 100
  });

  useEffect(() => {
    fetchTopics();
  }, [currentPage]);

  useEffect(() => {
    filterTopics();
  }, [searchTerm, topics]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllGrammarTopics(currentPage, pageSize);
      if (response.code === 1000 && response.result) {
        setTopics(response.result.content || []);
        setFilteredTopics(response.result.content || []);
        setTotalPages(response.result.totalPages || 0);
        setTotalElements(response.result.totalElements || 0);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Không thể tải danh sách chủ đề');
    } finally {
      setLoading(false);
    }
  };

  const filterTopics = () => {
    if (searchTerm) {
      const filtered = topics.filter(topic =>
        topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTopics(filtered);
    } else {
      setFilteredTopics(topics);
    }
  };

  const toggleTopicExpansion = (topicId) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const handleAddTopic = () => {
    setModalMode('add');
    setFormData({
      name: '',
      description: '',
      isActive: true,
      xpReward: 100
    });
    setShowModal(true);
  };

  const handleEditTopic = (topic) => {
    setModalMode('edit');
    setSelectedTopic(topic);
    setFormData({
      name: topic.name,
      description: topic.description,
      isActive: topic.isActive,
      xpReward: topic.xpReward
    });
    setShowModal(true);
  };

  const handleDeleteTopic = async (topicId, isActive) => {
    const status = isActive ? 'delete' : 'restore';
    const confirmMsg = isActive 
      ? 'Bạn có chắc muốn xóa chủ đề này?' 
      : 'Bạn có chắc muốn khôi phục chủ đề này?';
    
    if (!window.confirm(confirmMsg)) return;
    
    try {
      const response = await adminService.deleteOrRestoreGrammarTopic(topicId, status);
      if (response.code === 1000) {
        toast.success(isActive ? 'Đã xóa chủ đề' : 'Đã khôi phục chủ đề');
        fetchTopics();
      }
    } catch (error) {
      console.error('Error deleting/restoring topic:', error);
      toast.error('Không thể thực hiện thao tác');
    }
  };

  const handleToggleActive = async (topicId, currentStatus) => {
    const status = currentStatus ? 'delete' : 'restore';
    try {
      const response = await adminService.deleteOrRestoreGrammarTopic(topicId, status);
      if (response.code === 1000) {
        toast.success(currentStatus ? 'Đã tạm dừng chủ đề' : 'Đã kích hoạt chủ đề');
        fetchTopics();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
      toast.error('Không thể thay đổi trạng thái');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Vui lòng nhập tên chủ đề');
      return;
    }
    
    try {
      if (modalMode === 'add') {
        const response = await adminService.createGrammarTopic(formData);
        if (response.code === 1000) {
          toast.success('Tạo chủ đề thành công');
          setShowModal(false);
          fetchTopics();
        }
      } else {
        const response = await adminService.updateGrammarTopic(selectedTopic.id, formData);
        if (response.code === 1000) {
          toast.success('Cập nhật chủ đề thành công');
          setShowModal(false);
          fetchTopics();
        }
      }
    } catch (error) {
      console.error('Error saving topic:', error);
      toast.error('Không thể lưu chủ đề');
    }
  };

  const TopicModal = () => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {modalMode === 'add' ? 'Thêm chủ đề ngữ pháp' : 'Chỉnh sửa chủ đề'}
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên chủ đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="VD: Present Tenses"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Mô tả ngắn về chủ đề..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">XP thưởng</label>
            <input
              type="number"
              value={formData.xpReward}
              onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) || 100 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              min="1"
            />
          </div>

          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4"
            />
            Kích hoạt
          </label>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-3 py-1.5 rounded-md border text-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {modalMode === 'add' ? 'Thêm' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-56 bg-gray-50">
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Quản lý Ngữ pháp</h1>
          <p className="text-sm text-gray-500 mt-0.5">Quản lý chủ đề, bài học và bài tập ngữ pháp</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm chủ đề..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md w-56 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={fetchTopics}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>

          <button
            onClick={handleAddTopic}
            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Thêm chủ đề
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Tổng chủ đề</div>
              <div className="text-xl font-semibold text-gray-900">{topics.length}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Tổng bài học</div>
              <div className="text-xl font-semibold text-gray-900">
                {topics.reduce((sum, t) => sum + (t.totalLessons || 0), 0)}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Tổng bài tập</div>
              <div className="text-xl font-semibold text-gray-900">
                {topics.reduce((sum, t) => sum + (t.totalExercises || 0), 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-3">
        {filteredTopics.map((topic) => (
          <div key={topic.id} className="bg-white rounded-lg border border-gray-200">
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleTopicExpansion(topic.id)}
                    className="mt-1 p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedTopics[topic.id] ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-900">{topic.name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                        topic.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {topic.isActive ? <><CheckCircle className="w-3 h-3" /> Hoạt động</> : <><XCircle className="w-3 h-3" /> Tạm dừng</>}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {topic.totalLessons || 0} bài học
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {topic.totalExercises || 0} bài tập
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {topic.xpReward} XP
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(topic.id, topic.isActive)}
                    className={`px-3 py-1 rounded-md text-xs ${
                      topic.isActive ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'
                    }`}
                  >
                    {topic.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                  </button>
                  <button
                    onClick={() => handleEditTopic(topic)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTopic(topic.id, topic.isActive)}
                    className={`p-2 rounded-md ${
                      topic.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={topic.isActive ? 'Xóa' : 'Khôi phục'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Lessons */}
              {expandedTopics[topic.id] && topic.lessons && topic.lessons.length > 0 && (
                <div className="mt-3 pl-9 border-t border-gray-100 pt-3">
                  <div className="text-xs font-medium text-gray-700 mb-2">Bài học:</div>
                  <div className="space-y-2">
                    {topic.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500">#{lesson.order}</span>
                          <span className="text-sm text-gray-900">{lesson.title}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-2 text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    <Plus className="w-3 h-3" />
                    Thêm bài học
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTopics.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900 mb-1">Không tìm thấy chủ đề</h3>
          <p className="text-sm text-gray-600 mb-4">
            {searchTerm ? 'Thử từ khóa khác' : 'Thêm chủ đề ngữ pháp để bắt đầu'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleAddTopic}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
            >
              <Plus className="w-4 h-4" />
              Thêm chủ đề
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {!searchTerm && totalPages > 1 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Hiển thị {filteredTopics.length} / {totalElements} chủ đề
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0 || loading}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
            >
              Trước
            </button>
            <span className="px-3 py-1">Trang {currentPage + 1} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1 || loading}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {showModal && <TopicModal />}
    </div>
  );
};

export default GrammarManagement;
