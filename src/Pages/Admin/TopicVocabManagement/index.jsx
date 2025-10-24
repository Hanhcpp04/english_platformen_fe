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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md"> {/* smaller modal */}
        {/* Modal Header */}
        <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {modalMode === 'add' ? 'Thêm chủ đề mới' : 'Chỉnh sửa chủ đề'}
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            aria-label="Đóng"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên chủ đề <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Nhập tên chủ đề..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Nhập mô tả..."
              rows={3}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 border rounded-md flex items-center justify-center text-xl bg-gray-50">
              {formData.icon_url || '📚'}
            </div>
            <input
              type="text"
              value={formData.icon_url}
              onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Emoji hoặc URL icon..."
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-sm text-gray-700 mb-1">XP thưởng</label>
              <input
                type="number"
                value={formData.xp_reward}
                onChange={(e) => setFormData({ ...formData, xp_reward: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                min="0"
              />
            </div>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              Kích hoạt
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 mt-2">
            <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 rounded-md border text-sm">Hủy</button>
            <button type="submit" className="px-3 py-1.5 rounded-md bg-primary text-white text-sm flex items-center gap-2">
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Compact Header + Toolbar */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Quản lý chủ đề từ vựng</h1>
            <p className="text-sm text-gray-500">Quản lý các chủ đề và cài đặt nhanh</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm chủ đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md w-56 focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              onClick={handleAddTopic}
              className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-md text-sm"
              title="Thêm chủ đề"
            >
              <Plus className="w-4 h-4" />
              Thêm
            </button>
          </div>
        </div>

        {/* Topics Grid (compact cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((topic) => (
            <div key={topic.id} className="bg-white rounded-lg border border-gray-100 hover:shadow-md transition-colors">
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{topic.icon_url || '📚'}</div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{topic.name}</h3>
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                        topic.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {topic.is_active ? <><CheckCircle className="w-3 h-3" /> Hoạt động</> : <><XCircle className="w-3 h-3" /> Tạm dừng</>}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mt-2 line-clamp-2 min-h-[38px]">{topic.description}</p>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  <div>
                    <div className="text-xxs text-gray-500">Số từ</div>
                    <div className="font-semibold text-sm text-gray-900">{topic.total_words}</div>
                  </div>
                  <div>
                    <div className="text-xxs text-gray-500">XP</div>
                    <div className="font-semibold text-sm text-primary">{topic.xp_reward}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => handleToggleActive(topic.id)}
                    className={`flex-1 px-2 py-1 rounded-md text-sm font-medium ${
                      topic.is_active ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    {topic.is_active ? 'Tạm dừng' : 'Kích hoạt'}
                  </button>
                  <button onClick={() => handleEditTopic(topic)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md" title="Chỉnh sửa">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteTopic(topic.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md" title="Xóa">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTopics.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-100 p-6 text-center mt-6">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Không tìm thấy chủ đề</h3>
            <p className="text-xs text-gray-600 mb-4">{searchTerm ? 'Thử từ khóa khác' : 'Thêm chủ đề để bắt đầu'}</p>
            {!searchTerm && (
              <button onClick={handleAddTopic} className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-md text-sm">
                <Plus className="w-4 h-4" /> Thêm chủ đề
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
