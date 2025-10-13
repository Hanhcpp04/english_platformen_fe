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
  Image as ImageIcon
} from 'lucide-react';

const TopicVocabManagement = () => {
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon_url: '',
    xp_reward: 100,
    is_active: true
  });

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    filterTopics();
  }, [searchTerm, topics]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      // Mock data - Replace with actual API call
      setTimeout(() => {
        const mockTopics = [
          {
            id: 1,
            name: 'Business English',
            description: 'Từ vựng tiếng Anh trong kinh doanh và công việc',
            icon_url: '📊',
            is_active: true,
            xp_reward: 100,
            total_words: 145,
            created_at: '2024-01-15T10:00:00'
          },
          {
            id: 2,
            name: 'Travel & Tourism',
            description: 'Từ vựng về du lịch và khám phá',
            icon_url: '✈️',
            is_active: true,
            xp_reward: 100,
            total_words: 98,
            created_at: '2024-01-20T14:30:00'
          },
          {
            id: 3,
            name: 'Daily Conversation',
            description: 'Từ vựng giao tiếp hàng ngày',
            icon_url: '💬',
            is_active: true,
            xp_reward: 100,
            total_words: 230,
            created_at: '2024-02-01T09:15:00'
          },
          {
            id: 4,
            name: 'Food & Cooking',
            description: 'Từ vựng về ẩm thực và nấu ăn',
            icon_url: '🍳',
            is_active: true,
            xp_reward: 100,
            total_words: 87,
            created_at: '2024-02-10T11:20:00'
          },
          {
            id: 5,
            name: 'Technology',
            description: 'Từ vựng công nghệ thông tin',
            icon_url: '💻',
            is_active: false,
            xp_reward: 150,
            total_words: 120,
            created_at: '2024-03-05T16:45:00'
          }
        ];
        setTopics(mockTopics);
        setFilteredTopics(mockTopics);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching topics:', error);
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
      icon_url: '',
      xp_reward: 100,
      is_active: true
    });
    setShowModal(true);
  };

  const handleEditTopic = (topic) => {
    setModalMode('edit');
    setSelectedTopic(topic);
    setFormData({
      name: topic.name,
      description: topic.description,
      icon_url: topic.icon_url,
      xp_reward: topic.xp_reward,
      is_active: topic.is_active
    });
    setShowModal(true);
  };

  const handleDeleteTopic = async (topicId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chủ đề này?')) {
      try {
        // API call to delete topic
        console.log('Deleting topic:', topicId);
        // After successful deletion, refresh the list
        setTopics(topics.filter(t => t.id !== topicId));
      } catch (error) {
        console.error('Error deleting topic:', error);
      }
    }
  };

  const handleToggleActive = async (topicId) => {
    try {
      // API call to toggle active status
      setTopics(topics.map(t => 
        t.id === topicId ? { ...t, is_active: !t.is_active } : t
      ));
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        // API call to add new topic
        const newTopic = {
          id: topics.length + 1,
          ...formData,
          total_words: 0,
          created_at: new Date().toISOString()
        };
        setTopics([...topics, newTopic]);
      } else {
        // API call to update topic
        setTopics(topics.map(t => 
          t.id === selectedTopic.id ? { ...t, ...formData } : t
        ));
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving topic:', error);
    }
  };

  const TopicModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        {/* Modal Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {modalMode === 'add' ? 'Thêm chủ đề mới' : 'Chỉnh sửa chủ đề'}
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên chủ đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Nhập tên chủ đề..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Nhập mô tả chủ đề..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Icon (emoji hoặc URL)
            </label>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl bg-gray-50">
                {formData.icon_url || '📚'}
              </div>
              <input
                type="text"
                value={formData.icon_url}
                onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Nhập emoji hoặc URL icon..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              XP thưởng
            </label>
            <input
              type="number"
              value={formData.xp_reward}
              onChange={(e) => setFormData({ ...formData, xp_reward: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              min="0"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Kích hoạt chủ đề này
            </label>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {modalMode === 'add' ? 'Thêm mới' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý chủ đề từ vựng</h1>
            <p className="text-gray-600">Quản lý các chủ đề từ vựng trong hệ thống</p>
          </div>
          <button
            onClick={handleAddTopic}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Thêm chủ đề mới
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm chủ đề..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <div className="p-6">
                {/* Topic Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{topic.icon_url || '📚'}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{topic.name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        topic.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {topic.is_active ? (
                          <><CheckCircle className="w-3 h-3" /> Hoạt động</>
                        ) : (
                          <><XCircle className="w-3 h-3" /> Tạm dừng</>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
                  {topic.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Số từ vựng</p>
                    <p className="text-lg font-bold text-gray-900">{topic.total_words}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">XP thưởng</p>
                    <p className="text-lg font-bold text-primary">{topic.xp_reward}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleToggleActive(topic.id)}
                    className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                      topic.is_active
                        ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    {topic.is_active ? 'Tạm dừng' : 'Kích hoạt'}
                  </button>
                  <button
                    onClick={() => handleEditTopic(topic)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTopic(topic.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTopics.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy chủ đề nào
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Hãy thêm chủ đề mới để bắt đầu'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddTopic}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Thêm chủ đề mới
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && <TopicModal />}
    </div>
  );
};

export default TopicVocabManagement;
