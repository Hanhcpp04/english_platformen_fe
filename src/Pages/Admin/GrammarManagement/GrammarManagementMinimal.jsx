import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  BookOpen,
  Save
} from 'lucide-react';
import { toast } from 'react-toastify';
import * as adminService from '../../../service/adminService';
import AdminModal from '../../../components/OtherComponents/AdminModal';
import AdminModalFooter from '../../../components/OtherComponents/AdminModalFooter';

const GrammarManagementMinimal = () => {
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedTopic, setSelectedTopic] = useState(null);
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
    <AdminModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      title={modalMode === 'add' ? 'Thêm bài học ngữ pháp' : 'Chỉnh sửa bài học'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Content */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Tên bài học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent text-zinc-900"
              placeholder="VD: Present Tenses"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent text-zinc-900 resize-none"
              placeholder="Mô tả ngắn về bài học..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">XP thưởng</label>
              <input
                type="number"
                value={formData.xpReward}
                onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) || 100 })}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent text-zinc-900"
                min="1"
              />
            </div>

            <div className="flex items-end">
              <label className="inline-flex items-center gap-3 text-sm text-zinc-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-900"
                />
                <span className="font-medium">Kích hoạt ngay</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <AdminModalFooter
          onCancel={() => setShowModal(false)}
          submitText={modalMode === 'add' ? 'Thêm bài học' : 'Cập nhật'}
          submitIcon={<Save className="w-4 h-4" />}
        />
      </form>
    </AdminModal>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-900 mx-auto mb-4"></div>
          <p className="text-sm text-zinc-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Quản lý Ngữ pháp</h1>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm bài học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-900 text-zinc-900 placeholder-zinc-400"
          />
        </div>

        {/* Add Button */}
        <button
          onClick={handleAddTopic}
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-md text-sm hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          + Thêm bài học
        </button>
      </div>

      {/* Data Table - Strict Minimalist Design */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Tên Bài Học</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Cấp Độ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Trạng Thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Ngày Tạo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {filteredTopics.map((topic, index) => (
              <tr key={topic.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4 text-sm text-zinc-600">#{currentPage * pageSize + index + 1}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-zinc-900">{topic.name}</div>
                  <div className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{topic.description || '-'}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-700">
                    {topic.xpReward >= 150 ? 'Advanced' : 'Basic'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {topic.isActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">
                      Public
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-600">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-600">
                  {topic.createdAt ? new Date(topic.createdAt).toLocaleDateString('vi-VN') : '-'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditTopic(topic)}
                      className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTopic(topic.id, topic.isActive)}
                      className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredTopics.length === 0 && (
          <div className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
            <h3 className="text-base font-medium text-zinc-900 mb-1">Không tìm thấy bài học</h3>
            <p className="text-sm text-zinc-500">
              {searchTerm ? 'Thử từ khóa khác' : 'Thêm bài học ngữ pháp để bắt đầu'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!searchTerm && totalPages > 1 && (
        <div className="bg-white rounded-lg border border-zinc-200 px-6 py-4 flex justify-between items-center">
          <span className="text-sm text-zinc-600">
            Hiển thị {filteredTopics.length} / {totalElements} bài học
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0 || loading}
              className="px-4 py-2 border border-zinc-200 rounded-md text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Trước
            </button>
            <span className="px-4 py-2 text-sm text-zinc-700">
              Trang {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1 || loading}
              className="px-4 py-2 border border-zinc-200 rounded-md text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      <TopicModal />
    </div>
  );
};

export default GrammarManagementMinimal;
