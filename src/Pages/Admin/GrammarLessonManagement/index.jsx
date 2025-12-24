import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  BookOpen,
  CheckCircle,
  X,
  Save,
  ArrowLeft,
  RefreshCw,
  FileText,
  Eye
} from 'lucide-react';
import { toast } from 'react-toastify';
import * as adminService from '../../../service/adminService';

const GrammarLessonManagement = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [viewContentLesson, setViewContentLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState({
    topicId: '',
    title: '',
    content: '',
    xpReward: 100,
    isActive: true
  });

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      fetchLessons();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopic, currentPage]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllGrammarTopics(0, 100);
      if (response.code === 1000 && response.result) {
        setTopics(response.result.content || []);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Không thể tải danh sách chủ đề');
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await adminService.getLessonsByTopic(selectedTopic.id, currentPage, pageSize);
      if (response.code === 1000 && response.result) {
        setLessons(response.result.content || []);
        setTotalPages(response.result.totalPages || 0);
        setTotalElements(response.result.totalElements || 0);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error('Không thể tải danh sách bài học');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = async () => {
    if (!formData.title || !formData.content) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    try {
      const lessonData = {
        ...formData,
        topicId: selectedTopic.id
      };
      const response = await adminService.createGrammarLesson(lessonData);
      if (response.code === 1000) {
        toast.success('Tạo bài học thành công');
        setShowModal(false);
        resetForm();
        fetchLessons();
        fetchTopics();
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      toast.error('Không thể tạo bài học');
    }
  };

  const handleUpdateLesson = async () => {
    try {
      const response = await adminService.updateGrammarLesson(selectedLesson.id, formData);
      if (response.code === 1000) {
        toast.success('Cập nhật bài học thành công');
        setShowModal(false);
        resetForm();
        fetchLessons();
      }
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast.error('Không thể cập nhật bài học');
    }
  };

  const handleDeleteRestore = async (lessonId, isActive) => {
    const status = isActive ? 'delete' : 'restore';
    const confirmMsg = isActive ? 'Bạn có chắc muốn xóa bài học này?' : 'Bạn có chắc muốn khôi phục bài học này?';
    
    if (!window.confirm(confirmMsg)) return;
    
    try {
      const response = await adminService.deleteOrRestoreGrammarLesson(lessonId, status);
      if (response.code === 1000) {
        toast.success(isActive ? 'Đã xóa bài học' : 'Đã khôi phục bài học');
        fetchLessons();
      }
    } catch (error) {
      console.error('Error deleting/restoring lesson:', error);
      toast.error('Không thể thực hiện thao tác');
    }
  };

  const resetForm = () => {
    setFormData({
      topicId: selectedTopic?.id || '',
      title: '',
      content: '',
      xpReward: 100,
      isActive: true
    });
    setSelectedLesson(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalMode('add');
    setPreviewMode(false);
    setShowModal(true);
  };

  const openEditModal = (lesson) => {
    setSelectedLesson(lesson);
    setFormData({
      topicId: lesson.topicId,
      title: lesson.title,
      content: lesson.content,
      xpReward: lesson.xpReward || 100,
      isActive: lesson.isActive
    });
    setModalMode('edit');
    setPreviewMode(false);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      handleCreateLesson();
    } else {
      handleUpdateLesson();
    }
  };

  const filteredLessons = lessons.filter((lesson) =>
    lesson.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Topic selection view
  if (!selectedTopic) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Bài học Ngữ pháp</h1>
            <p className="text-sm text-gray-500 mt-1">Chọn chủ đề để quản lý bài học</p>
          </div>
          <button
            onClick={fetchTopics}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {topics.filter(t => t.isActive).map((topic) => (
            <div
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-gray-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{topic.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{topic.description}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {topic.totalLessons || 0} bài học
                    </span>
                    <span>{topic.xpReward} XP</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Lesson management view
  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedTopic(null);
              setCurrentPage(0);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedTopic.name}</h1>
            <p className="text-sm text-gray-500">{totalElements} bài học</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchLessons}
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
            Thêm bài học
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm bài học..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700"
        />
      </div>

      {/* Lessons Table (Excel style) */}
      <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Tiêu đề</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Nội dung</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">XP</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Câu hỏi</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Trạng thái</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {filteredLessons.map((lesson) => (
                <tr key={lesson.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-r border-gray-300">
                    <div className="font-medium text-gray-900 text-sm">{lesson.title}</div>
                  </td>
                  <td className="px-4 py-3 border-r border-gray-300">
                    <button
                      onClick={() => setViewContentLesson(lesson)}
                      className="text-gray-700 hover:text-gray-900 flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">Xem nội dung</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm border-r border-gray-300">{lesson.xpReward} XP</td>
                  <td className="px-4 py-3 text-sm border-r border-gray-300">{lesson.totalQuestions || 0}</td>
                  <td className="px-4 py-3 text-center border-r border-gray-300">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      lesson.isActive ? 'bg-gray-200 text-gray-800' : 'bg-gray-300 text-gray-700'
                    }`}>
                      {lesson.isActive ? 'Hoạt động' : 'Đã xóa'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(lesson)}
                        className="p-1.5 text-gray-700 hover:bg-gray-100 rounded"
                        title="Sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRestore(lesson.id, lesson.isActive)}
                        className={`p-1.5 rounded ${
                          lesson.isActive 
                            ? 'text-gray-700 hover:bg-gray-200' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title={lesson.isActive ? 'Xóa' : 'Khôi phục'}
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
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-300 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Hiển thị {filteredLessons.length} / {totalElements}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="border-b px-4 py-3 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">
                {modalMode === 'add' ? 'Thêm bài học mới' : 'Chỉnh sửa bài học'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tiêu đề bài học *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-700"
                  placeholder="VD: Present Simple Tense"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium">Nội dung bài học *</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewMode(false)}
                      className={`px-3 py-1 text-xs rounded ${
                        !previewMode 
                          ? 'bg-gray-800 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Edit HTML
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode(true)}
                      className={`px-3 py-1 text-xs rounded ${
                        previewMode 
                          ? 'bg-gray-800 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                </div>
                
                {!previewMode ? (
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-700 font-mono text-sm"
                    rows={12}
                    placeholder="Nhập nội dung HTML..."
                    required
                  />
                ) : (
                  <div className="w-full px-3 py-2 border rounded-lg bg-gray-50 min-h-[300px]">
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: formData.content }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">XP thưởng</label>
                <input
                  type="number"
                  value={formData.xpReward}
                  onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) || 100 })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-700"
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

      {/* Modal xem nội dung */}
      {viewContentLesson && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="border-b px-4 py-3 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">{viewContentLesson.title}</h2>
              <button onClick={() => setViewContentLesson(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: viewContentLesson.content }}
              />
            </div>
            <div className="border-t px-4 py-3 flex justify-end sticky bottom-0 bg-white">
              <button
                onClick={() => setViewContentLesson(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrammarLessonManagement;
