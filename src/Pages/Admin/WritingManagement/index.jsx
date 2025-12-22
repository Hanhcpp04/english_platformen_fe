import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  BookOpen,
  X,
  Save,
  ArrowLeft,
  RefreshCw,
  FileText,
  Eye,
  Settings,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import * as adminService from '../../../service/adminService';

const WritingManagement = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [viewQuestion, setViewQuestion] = useState(null);
  
  const [formData, setFormData] = useState({
    topicId: '',
    question: '',
    writingTips: '',
    xpReward: 50,
    isActive: true
  });

  const [gradingData, setGradingData] = useState({
    grammarWeight: 30,
    vocabularyWeight: 30,
    coherenceWeight: 40,
    minWordCount: 100,
    maxWordCount: 500,
    customInstructions: ''
  });

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      fetchTasks();
    }
  }, [selectedTopic, currentPage]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllWritingTopics(0, 100);
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

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await adminService.getTasksByTopic(selectedTopic.id, currentPage, pageSize);
      if (response.code === 1000 && response.result) {
        setTasks(response.result.content || []);
        setTotalPages(response.result.totalPages || 0);
        setTotalElements(response.result.totalElements || 0);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Không thể tải danh sách bài tập');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!formData.question) {
      toast.error('Vui lòng nhập câu hỏi');
      return;
    }
    
    try {
      const taskData = {
        ...formData,
        topicId: selectedTopic.id
      };
      const response = await adminService.createWritingTask(taskData);
      if (response.code === 1000) {
        toast.success('Tạo bài tập thành công');
        setShowModal(false);
        resetForm();
        fetchTasks();
        fetchTopics();
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Không thể tạo bài tập');
    }
  };

  const handleUpdateTask = async () => {
    try {
      const response = await adminService.updateWritingTask(selectedTask.id, formData);
      if (response.code === 1000) {
        toast.success('Cập nhật bài tập thành công');
        setShowModal(false);
        resetForm();
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Không thể cập nhật bài tập');
    }
  };

  const handleDeleteRestore = async (taskId, isActive) => {
    const status = isActive ? 'delete' : 'restore';
    const confirmMsg = isActive ? 'Bạn có chắc muốn xóa bài tập này?' : 'Bạn có chắc muốn khôi phục bài tập này?';
    
    if (!window.confirm(confirmMsg)) return;
    
    try {
      const response = await adminService.deleteOrRestoreWritingTask(taskId, status);
      if (response.code === 1000) {
        toast.success(isActive ? 'Đã xóa bài tập' : 'Đã khôi phục bài tập');
        fetchTasks();
      }
    } catch (error) {
      console.error('Error deleting/restoring task:', error);
      toast.error('Không thể thực hiện thao tác');
    }
  };

  const handleUpdateGradingCriteria = async () => {
    const totalWeight = gradingData.grammarWeight + gradingData.vocabularyWeight + gradingData.coherenceWeight;
    if (totalWeight !== 100) {
      toast.error(`Tổng tỷ trọng phải = 100%. Hiện tại: ${totalWeight}%`);
      return;
    }

    try {
      const response = await adminService.updateGradingCriteria(selectedTask.id, gradingData);
      if (response.code === 1000) {
        toast.success('Cập nhật tiêu chí chấm điểm thành công');
        setShowGradingModal(false);
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating grading criteria:', error);
      toast.error(error.message || 'Không thể cập nhật tiêu chí chấm điểm');
    }
  };

  const resetForm = () => {
    setFormData({
      topicId: selectedTopic?.id || '',
      question: '',
      writingTips: '',
      xpReward: 50,
      isActive: true
    });
    setSelectedTask(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalMode('add');
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setFormData({
      topicId: task.topicId,
      question: task.question,
      writingTips: task.writingTips || '',
      xpReward: task.xpReward || 50,
      isActive: task.isActive
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const openGradingModal = (task) => {
    setSelectedTask(task);
    if (task.gradingCriteria) {
      setGradingData({
        grammarWeight: task.gradingCriteria.grammarWeight || 30,
        vocabularyWeight: task.gradingCriteria.vocabularyWeight || 30,
        coherenceWeight: task.gradingCriteria.coherenceWeight || 40,
        minWordCount: task.gradingCriteria.minWordCount || 100,
        maxWordCount: task.gradingCriteria.maxWordCount || 500,
        customInstructions: task.gradingCriteria.customInstructions || ''
      });
    } else {
      setGradingData({
        grammarWeight: 30,
        vocabularyWeight: 30,
        coherenceWeight: 40,
        minWordCount: 100,
        maxWordCount: 500,
        customInstructions: ''
      });
    }
    setShowGradingModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      handleCreateTask();
    } else {
      handleUpdateTask();
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.writingTips?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Topic selection view
  if (!selectedTopic) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Bài viết (Writing)</h1>
            <p className="text-sm text-gray-500 mt-1">Chọn chủ đề để quản lý bài tập</p>
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
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {topic.totalTasks || 0} bài tập
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Task management view
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
            <p className="text-sm text-gray-500">{totalElements} bài tập</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchTasks}
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
            Thêm bài tập
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm bài tập..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700"
        />
      </div>

      {/* Tasks Table (Excel style) */}
      <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Câu hỏi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">XP</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Bài nộp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Tiêu chí</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Trạng thái</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-r border-gray-300">
                    <button
                      onClick={() => setViewQuestion(task)}
                      className="text-gray-700 hover:text-gray-900 flex items-center gap-2 text-left"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="line-clamp-2 text-sm">{task.question}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm border-r border-gray-300">{task.xpReward} XP</td>
                  <td className="px-4 py-3 text-sm border-r border-gray-300">{task.totalSubmissions || 0}</td>
                  <td className="px-4 py-3 border-r border-gray-300">
                    <button
                      onClick={() => openGradingModal(task)}
                      className="text-gray-700 hover:text-gray-900 flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      {task.gradingCriteria ? (
                        <span className="text-xs">
                          G:{task.gradingCriteria.grammarWeight}% 
                          V:{task.gradingCriteria.vocabularyWeight}% 
                          C:{task.gradingCriteria.coherenceWeight}%
                        </span>
                      ) : (
                        <span className="text-xs">Chỉnh sửa</span>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center border-r border-gray-300">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      task.isActive ? 'bg-gray-200 text-gray-800' : 'bg-gray-300 text-gray-700'
                    }`}>
                      {task.isActive ? 'Hoạt động' : 'Đã xóa'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(task)}
                        className="p-1.5 text-gray-700 hover:bg-gray-100 rounded"
                        title="Sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRestore(task.id, task.isActive)}
                        className={`p-1.5 rounded ${
                          task.isActive 
                            ? 'text-gray-700 hover:bg-gray-200' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title={task.isActive ? 'Xóa' : 'Khôi phục'}
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
            Hiển thị {filteredTasks.length} / {totalElements}
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

      {/* Modal Add/Edit Task */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="border-b px-4 py-3 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">
                {modalMode === 'add' ? 'Thêm bài tập mới' : 'Chỉnh sửa bài tập'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Câu hỏi *</label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-700"
                  rows={5}
                  placeholder="Nhập câu hỏi cho bài viết..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gợi ý viết</label>
                <textarea
                  value={formData.writingTips}
                  onChange={(e) => setFormData({ ...formData, writingTips: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-700"
                  rows={4}
                  placeholder="Nhập gợi ý để học viên viết tốt hơn..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">XP thưởng</label>
                <input
                  type="number"
                  value={formData.xpReward}
                  onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) || 50 })}
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

      {/* Modal Grading Criteria */}
      {showGradingModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="border-b px-4 py-3 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Tiêu chí chấm điểm
              </h2>
              <button onClick={() => setShowGradingModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-800">
                  <strong>Lưu ý:</strong> Tổng tỷ trọng của Grammar + Vocabulary + Coherence phải = 100%
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Grammar (%)</label>
                  <input
                    type="number"
                    value={gradingData.grammarWeight}
                    onChange={(e) => setGradingData({ ...gradingData, grammarWeight: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-700"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Vocabulary (%)</label>
                  <input
                    type="number"
                    value={gradingData.vocabularyWeight}
                    onChange={(e) => setGradingData({ ...gradingData, vocabularyWeight: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-700"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Coherence (%)</label>
                  <input
                    type="number"
                    value={gradingData.coherenceWeight}
                    onChange={(e) => setGradingData({ ...gradingData, coherenceWeight: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-700"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="text-sm text-center">
                Tổng: <strong className={`text-lg ${
                  (gradingData.grammarWeight + gradingData.vocabularyWeight + gradingData.coherenceWeight) === 100
                    ? 'text-gray-800'
                    : 'text-gray-700'
                }`}>
                  {gradingData.grammarWeight + gradingData.vocabularyWeight + gradingData.coherenceWeight}%
                </strong>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Số từ tối thiểu</label>
                  <input
                    type="number"
                    value={gradingData.minWordCount}
                    onChange={(e) => setGradingData({ ...gradingData, minWordCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-700"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số từ tối đa</label>
                  <input
                    type="number"
                    value={gradingData.maxWordCount}
                    onChange={(e) => setGradingData({ ...gradingData, maxWordCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-700"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Hướng dẫn chấm điểm cho AI</label>
                <textarea
                  value={gradingData.customInstructions}
                  onChange={(e) => setGradingData({ ...gradingData, customInstructions: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-700"
                  rows={4}
                  placeholder="Nhập hướng dẫn đặc biệt cho AI khi chấm bài..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  onClick={() => setShowGradingModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdateGradingCriteria}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Lưu tiêu chí
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal View Question */}
      {viewQuestion && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="border-b px-4 py-3 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">Chi tiết câu hỏi</h2>
              <button onClick={() => setViewQuestion(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Câu hỏi:</h3>
                <p className="text-gray-900 whitespace-pre-wrap">{viewQuestion.question}</p>
              </div>
              {viewQuestion.writingTips && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Gợi ý viết:</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{viewQuestion.writingTips}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <span className="text-sm text-gray-500">XP thưởng:</span>
                  <p className="font-medium">{viewQuestion.xpReward} XP</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Số bài nộp:</span>
                  <p className="font-medium">{viewQuestion.totalSubmissions || 0}</p>
                </div>
              </div>
            </div>
            <div className="border-t px-4 py-3 flex justify-end sticky bottom-0 bg-white">
              <button
                onClick={() => setViewQuestion(null)}
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

export default WritingManagement;
