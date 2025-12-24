import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, RefreshCw, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import * as adminService from '../../../service/adminService';

const GrammarExerciseQuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [types, setTypes] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    typeId: '',
    lessonId: '',
    question: '',
    options: '',
    correctAnswer: '',
    explanation: '',
    orderIndex: 0,
    isActive: true
  });

  useEffect(() => {
    fetchTypes();
    fetchLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchTypes = async () => {
    try {
      const response = await adminService.getAllGrammarExerciseTypes(0, 100);
      if (response.code === 1000 && response.result) {
        setTypes(response.result.content || []);
      }
    } catch (error) {
      console.error('Error fetching exercise types:', error);
    }
  };

  const fetchLessons = async () => {
    try {
      const response = await adminService.getAllLessons(0, 100);
      if (response.code === 1000 && response.result) {
        setLessons(response.result.content || []);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllGrammarExerciseQuestions(currentPage, 10);
      if (response.code === 1000 && response.result) {
        setQuestions(response.result.content || []);
        setTotalPages(response.result.totalPages || 0);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Không thể tải danh sách câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, question = null) => {
    setModalMode(mode);
    setSelectedQuestion(question);
    if (mode === 'edit' && question) {
      setFormData({
        typeId: question.typeId,
        lessonId: question.lessonId,
        question: question.question,
        options: JSON.stringify(question.options),
        correctAnswer: question.correctAnswer,
        explanation: question.explanation || '',
        orderIndex: question.orderIndex,
        isActive: question.isActive
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.typeId || !formData.lessonId || !formData.question) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // Parse options JSON
    let parsedOptions;
    try {
      parsedOptions = JSON.parse(formData.options);
    } catch (error) {
      toast.error('Định dạng JSON options không hợp lệ');
      return;
    }

    const payload = {
      ...formData,
      options: parsedOptions
    };

    try {
      if (modalMode === 'add') {
        const response = await adminService.createGrammarExerciseQuestion(payload);
        if (response.code === 1000) {
          toast.success('Tạo câu hỏi thành công');
          setShowModal(false);
          resetForm();
          fetchQuestions();
        }
      } else {
        const response = await adminService.updateGrammarExerciseQuestion(selectedQuestion.id, payload);
        if (response.code === 1000) {
          toast.success('Cập nhật câu hỏi thành công');
          setShowModal(false);
          resetForm();
          fetchQuestions();
        }
      }
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error('Không thể lưu câu hỏi');
    }
  };

  const handleDeleteRestore = async (questionId, isActive) => {
    const status = isActive ? 'delete' : 'restore';
    const confirmMsg = isActive 
      ? 'Bạn có chắc muốn xóa câu hỏi này?' 
      : 'Bạn có chắc muốn khôi phục câu hỏi này?';
    
    if (!window.confirm(confirmMsg)) return;

    try {
      const response = await adminService.deleteOrRestoreGrammarExerciseQuestion(questionId, status);
      if (response.code === 1000) {
        toast.success(isActive ? 'Đã xóa câu hỏi' : 'Đã khôi phục câu hỏi');
        fetchQuestions();
      }
    } catch (error) {
      console.error('Error deleting/restoring question:', error);
      toast.error('Không thể thực hiện thao tác');
    }
  };

  const resetForm = () => {
    setFormData({
      typeId: '',
      lessonId: '',
      question: '',
      options: '',
      correctAnswer: '',
      explanation: '',
      orderIndex: 0,
      isActive: true
    });
    setSelectedQuestion(null);
  };

  const filteredQuestions = questions.filter(q =>
    q.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.correctAnswer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Câu Hỏi Bài Tập Ngữ Pháp</h2>
        <div className="flex gap-3">
          <button
            onClick={fetchQuestions}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            <RefreshCw size={16} />
            Làm mới
          </button>
          <button
            onClick={() => handleOpenModal('add')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Plus size={16} />
            Thêm mới
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại BT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bài học</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Câu hỏi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đáp án</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thứ tự</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredQuestions.map((question) => (
                <tr key={question.id} className={!question.isActive ? 'bg-gray-100' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{question.id}</td>
                  <td className="px-6 py-4 text-sm">{question.typeName}</td>
                  <td className="px-6 py-4 text-sm">{question.lessonTitle}</td>
                  <td className="px-6 py-4 text-sm max-w-xs truncate">{question.question}</td>
                  <td className="px-6 py-4 text-sm">{question.correctAnswer}</td>
                  <td className="px-6 py-4 text-sm">{question.orderIndex}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${
                      question.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {question.isActive ? 'Hoạt động' : 'Đã xóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleOpenModal('edit', question)}
                      className="text-blue-600 hover:text-blue-900 mx-2"
                      title="Sửa"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteRestore(question.id, question.isActive)}
                      className={`${question.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'} mx-2`}
                      title={question.isActive ? 'Xóa' : 'Khôi phục'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredQuestions.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`px-3 py-1 rounded ${
                currentPage === index ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {modalMode === 'add' ? 'Thêm Câu Hỏi Mới' : 'Chỉnh Sửa Câu Hỏi'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Loại bài tập *</label>
                  <select
                    value={formData.typeId}
                    onChange={(e) => setFormData({...formData, typeId: e.target.value})}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Chọn loại bài tập</option>
                    {types.filter(t => t.isActive).map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bài học *</label>
                  <select
                    value={formData.lessonId}
                    onChange={(e) => setFormData({...formData, lessonId: e.target.value})}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Chọn bài học</option>
                    {lessons.filter(l => l.isActive).map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Câu hỏi *</label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Options (JSON) *
                  <span className="text-xs text-gray-500 ml-2">
                    Ví dụ: {`{"A": "Option 1", "B": "Option 2", "C": "Option 3", "D": "Option 4"}`}
                  </span>
                </label>
                <textarea
                  value={formData.options}
                  onChange={(e) => setFormData({...formData, options: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  rows="4"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Đáp án đúng *</label>
                  <input
                    type="text"
                    value={formData.correctAnswer}
                    onChange={(e) => setFormData({...formData, correctAnswer: e.target.value})}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Thứ tự</label>
                  <input
                    type="number"
                    value={formData.orderIndex}
                    onChange={(e) => setFormData({...formData, orderIndex: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Giải thích</label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({...formData, explanation: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm">Hoạt động</span>
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {modalMode === 'add' ? 'Thêm' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrammarExerciseQuestionManagement;
