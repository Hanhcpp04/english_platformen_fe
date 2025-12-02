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
  List,
  Target,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const GrammarManagement = () => {
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
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
            name: 'Present Tenses',
            description: 'Các thì hiện tại trong tiếng Anh',
            is_active: true,
            total_lessons: 5,
            total_exercises: 15,
            created_at: '2024-01-15T10:00:00',
            lessons: [
              { id: 1, title: 'Present Simple', order: 1 },
              { id: 2, title: 'Present Continuous', order: 2 },
              { id: 3, title: 'Present Perfect', order: 3 }
            ]
          },
          {
            id: 2,
            name: 'Past Tenses',
            description: 'Các thì quá khứ trong tiếng Anh',
            is_active: true,
            total_lessons: 4,
            total_exercises: 12,
            created_at: '2024-01-20T14:30:00',
            lessons: [
              { id: 4, title: 'Past Simple', order: 1 },
              { id: 5, title: 'Past Continuous', order: 2 }
            ]
          },
          {
            id: 3,
            name: 'Conditionals',
            description: 'Câu điều kiện',
            is_active: true,
            total_lessons: 4,
            total_exercises: 10,
            created_at: '2024-02-01T09:15:00',
            lessons: []
          },
          {
            id: 4,
            name: 'Modal Verbs',
            description: 'Động từ khuyết thiếu',
            is_active: false,
            total_lessons: 3,
            total_exercises: 8,
            created_at: '2024-02-10T11:20:00',
            lessons: []
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
      is_active: topic.is_active
    });
    setShowModal(true);
  };

  const handleDeleteTopic = async (topicId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chủ đề này? Tất cả bài học và bài tập liên quan sẽ bị xóa.')) {
      try {
        console.log('Deleting topic:', topicId);
        setTopics(topics.filter(t => t.id !== topicId));
      } catch (error) {
        console.error('Error deleting topic:', error);
      }
    }
  };

  const handleToggleActive = async (topicId) => {
    try {
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
        const newTopic = {
          id: topics.length + 1,
          ...formData,
          total_lessons: 0,
          total_exercises: 0,
          lessons: [],
          created_at: new Date().toISOString()
        };
        setTopics([...topics, newTopic]);
      } else {
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

          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
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
                {topics.reduce((sum, t) => sum + t.total_lessons, 0)}
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
                {topics.reduce((sum, t) => sum + t.total_exercises, 0)}
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
                        topic.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {topic.is_active ? <><CheckCircle className="w-3 h-3" /> Hoạt động</> : <><XCircle className="w-3 h-3" /> Tạm dừng</>}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {topic.total_lessons} bài học
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {topic.total_exercises} bài tập
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(topic.id)}
                    className={`px-3 py-1 rounded-md text-xs ${
                      topic.is_active ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'
                    }`}
                  >
                    {topic.is_active ? 'Tạm dừng' : 'Kích hoạt'}
                  </button>
                  <button
                    onClick={() => handleEditTopic(topic)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTopic(topic.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
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

      {showModal && <TopicModal />}
    </div>
  );
};

export default GrammarManagement;
