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
  RefreshCw,
  Globe,
  Smile,
  Star,
  Heart,
  Music,
  Briefcase,
  Home,
  Utensils,
  Plane,
  ShoppingCart
} from 'lucide-react';
import { toast } from 'react-toastify';
import * as adminService from '../../../service/adminService';

// Danh sách icon gợi ý
const ICON_OPTIONS = [
  { name: '📚', label: 'Sách', emoji: '📚' },
  { name: '🌍', label: 'Du lịch', emoji: '🌍' },
  { name: '🍕', label: 'Ẩm thực', emoji: '🍕' },
  { name: '💼', label: 'Công việc', emoji: '💼' },
  { name: '🏠', label: 'Gia đình', emoji: '🏠' },
  { name: '🎵', label: 'Âm nhạc', emoji: '🎵' },
  { name: '⚽', label: 'Thể thao', emoji: '⚽' },
  { name: '💻', label: 'Công nghệ', emoji: '💻' },
  { name: '🎨', label: 'Nghệ thuật', emoji: '🎨' },
  { name: '🌟', label: 'Khác', emoji: '🌟' },
];

const TopicVocabManagement = () => {
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
  const [pageSize] = useState(12);
  const [formData, setFormData] = useState({
    englishName: '',
    name: '',
    description: '',
    icon: '📚',
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
      const response = await adminService.getAllVocabTopics(currentPage, pageSize);
      if (response.code === 1000 && response.result) {
        setTopics(response.result.content || []);
        setTotalPages(response.result.totalPages || 0);
        setTotalElements(response.result.totalElements || 0);
        setFilteredTopics(response.result.content || []);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Không thể tải danh sách chủ đề');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async () => {
    if (!formData.englishName || !formData.name) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    try {
      const response = await adminService.createVocabTopic(formData);
      if (response.code === 1000) {
        toast.success('Tạo chủ đề thành công');
        setShowModal(false);
        resetForm();
        fetchTopics();
      }
    } catch (error) {
      console.error('Error creating topic:', error);
      toast.error('Không thể tạo chủ đề');
    }
  };

  const handleUpdateTopic = async () => {
    try {
      const response = await adminService.updateVocabTopic(selectedTopic.id, formData);
      if (response.code === 1000) {
        toast.success('Cập nhật chủ đề thành công');
        setShowModal(false);
        resetForm();
        fetchTopics();
      }
    } catch (error) {
      console.error('Error updating topic:', error);
      toast.error('Không thể cập nhật chủ đề');
    }
  };

  const handleDeleteRestore = async (topicId, isActive) => {
    const status = isActive ? 'delete' : 'restore';
    const confirmMsg = isActive ? 'Bạn có chắc muốn xóa chủ đề này?' : 'Bạn có chắc muốn khôi phục chủ đề này?';
    
    if (!window.confirm(confirmMsg)) return;
    
    try {
      const response = await adminService.deleteOrRestoreVocabTopic(topicId, status);
      if (response.code === 1000) {
        toast.success(isActive ? 'Đã xóa chủ đề' : 'Đã khôi phục chủ đề');
        fetchTopics();
      }
    } catch (error) {
      console.error('Error deleting/restoring topic:', error);
      toast.error('Không thể thực hiện thao tác');
    }
  };

  const resetForm = () => {
    setFormData({
      englishName: '',
      name: '',
      description: '',
      icon: '📚',
      xpReward: 100
    });
    setSelectedTopic(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalMode('add');
    setShowModal(true);
  };

  const openEditModal = (topic) => {
    setSelectedTopic(topic);
    setFormData({
      englishName: topic.englishName,
      name: topic.name,
      description: topic.description,
      icon: topic.iconUrl || '📚',
      xpReward: topic.xpReward
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const filterTopics = () => {
    if (searchTerm) {
      const filtered = topics.filter(topic =>
        topic.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.englishName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTopics(filtered);
    } else {
      setFilteredTopics(topics);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      handleCreateTopic();
    } else {
      handleUpdateTopic();
    }
  };

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý chủ đề từ vựng</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng số: {totalElements} chủ đề</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchTopics}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm chủ đề
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm chủ đề..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700"
        />
      </div>

      {/* Topics Table (Excel style) */}
      <div className="bg-white rounded-md border border-gray-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-300 w-12">STT</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 min-w-[80px]">Icon</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 min-w-[160px]">Tên tiếng Anh</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 min-w-[140px]">Tên tiếng Việt</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300">Mô tả</th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-300 w-24">Số từ</th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-300 w-20">XP</th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-300 w-28">Trạng thái</th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-300 w-28">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredTopics.map((topic, index) => (
                <tr key={topic.id} className="hover:bg-gray-100">
                  <td className="px-2 py-1 text-center text-xs text-gray-700 border border-gray-300">{currentPage * pageSize + index + 1}</td>
                  <td className="px-3 py-1 text-left border border-gray-300">{topic.iconUrl || '📚'}</td>
                  <td className="px-3 py-1 text-sm text-gray-900 border border-gray-300">{topic.englishName}</td>
                  <td className="px-3 py-1 text-sm text-gray-700 border border-gray-300">{topic.name}</td>
                  <td className="px-3 py-1 text-xs text-gray-600 border border-gray-300 max-w-xl truncate">{topic.description}</td>
                  <td className="px-3 py-1 text-center text-xs border border-gray-300">{topic.totalWords || 0}</td>
                  <td className="px-3 py-1 text-center text-xs border border-gray-300">{topic.xpReward} XP</td>
                  <td className="px-3 py-1 text-center border border-gray-300">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs ${topic.isActive ? 'bg-gray-200 text-gray-800' : 'bg-gray-300 text-gray-700'}`}>{topic.isActive ? 'Hoạt động' : 'Đã xóa'}</span>
                  </td>
                  <td className="px-3 py-1 text-center border border-gray-300">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEditModal(topic)} className="p-1 text-gray-700 hover:bg-gray-100 rounded" title="Sửa"><Edit2 className="w-4 h-4"/></button>
                      <button onClick={() => handleDeleteRestore(topic.id, topic.isActive)} className={`p-1 rounded ${topic.isActive ? 'text-gray-700 hover:bg-gray-200' : 'text-gray-600 hover:bg-gray-100'}`} title={topic.isActive ? 'Xóa' : 'Khôi phục'}>{topic.isActive ? <Trash2 className="w-4 h-4"/> : <CheckCircle className="w-4 h-4"/>}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-2 border-t flex items-center justify-between text-sm">
          <div className="text-gray-600">Hiển thị <span className="font-medium text-gray-900">{filteredTopics.length}</span> / <span className="font-medium">{totalElements}</span></div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0 || loading} className="px-2 py-1 text-sm border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50">Trước</button>
            <span className="px-3 py-1 text-sm">Trang {currentPage + 1} / {totalPages || 1}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage >= totalPages - 1 || loading} className="px-2 py-1 text-sm border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50">Tiếp</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="border-b px-4 py-3 flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {modalMode === 'add' ? 'Thêm chủ đề mới' : 'Chỉnh sửa chủ đề'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên tiếng Anh *</label>
                <input
                  type="text"
                  value={formData.englishName}
                  onChange={(e) => setFormData({ ...formData, englishName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-700"
                  placeholder="VD: Food, Travel, Technology..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tên tiếng Việt *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-700"
                  placeholder="VD: Ẩm thực, Du lịch, Công nghệ..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-700"
                  rows={3}
                  placeholder="Mô tả ngắn gọn về chủ đề..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Chọn icon *</label>
                <div className="grid grid-cols-5 gap-2">
                  {ICON_OPTIONS.map((iconOpt) => (
                    <button
                      key={iconOpt.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: iconOpt.emoji })}
                      className={`p-3 text-2xl border-2 rounded-lg hover:border-gray-700 transition-colors ${
                        formData.icon === iconOpt.emoji ? 'border-gray-700 bg-gray-100' : 'border-gray-200'
                      }`}
                      title={iconOpt.label}
                    >
                      {iconOpt.emoji}
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-center">
                  <span className="text-sm text-gray-500">Icon đã chọn: </span>
                  <span className="text-3xl ml-2">{formData.icon}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">XP thưởng</label>
                <input
                  type="number"
                  value={formData.xpReward}
                  onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-700"
                  min="0"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {modalMode === 'add' ? 'Thêm' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicVocabManagement;
