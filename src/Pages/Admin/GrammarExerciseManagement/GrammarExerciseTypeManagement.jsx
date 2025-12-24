import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, RefreshCw, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import * as adminService from '../../../service/adminService';

const GrammarExerciseTypeManagement = () => {
  const [types, setTypes] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedType, setSelectedType] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    topicId: '',
    name: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    fetchTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchTopics = async () => {
    try {
      const response = await adminService.getAllGrammarTopics(0, 100);
      if (response.code === 1000 && response.result) {
        setTopics(response.result.content || []);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllGrammarExerciseTypes(currentPage, 10);
      if (response.code === 1000 && response.result) {
        setTypes(response.result.content || []);
        setTotalPages(response.result.totalPages || 0);
      }
    } catch (error) {
      console.error('Error fetching exercise types:', error);
      toast.error('Không thể tải danh sách loại bài tập');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, type = null) => {
    setModalMode(mode);
    setSelectedType(type);
    if (mode === 'edit' && type) {
      setFormData({
        topicId: type.topicId,
        name: type.name,
        description: type.description,
        isActive: type.isActive
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.topicId || !formData.name) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      if (modalMode === 'add') {
        const response = await adminService.createGrammarExerciseType(formData);
        if (response.code === 1000) {
          toast.success('Tạo loại bài tập thành công');
          setShowModal(false);
          resetForm();
          fetchTypes();
        }
      } else {
        const response = await adminService.updateGrammarExerciseType(selectedType.id, formData);
        if (response.code === 1000) {
          toast.success('Cập nhật loại bài tập thành công');
          setShowModal(false);
          resetForm();
          fetchTypes();
        }
      }
    } catch (error) {
      console.error('Error saving exercise type:', error);
      toast.error('Không thể lưu loại bài tập');
    }
  };

  const handleDeleteRestore = async (typeId, isActive) => {
    const status = isActive ? 'delete' : 'restore';
    const confirmMsg = isActive 
      ? 'Bạn có chắc muốn xóa loại bài tập này?' 
      : 'Bạn có chắc muốn khôi phục loại bài tập này?';
    
    if (!window.confirm(confirmMsg)) return;

    try {
      const response = await adminService.deleteOrRestoreGrammarExerciseType(typeId, status);
      if (response.code === 1000) {
        toast.success(isActive ? 'Đã xóa loại bài tập' : 'Đã khôi phục loại bài tập');
        fetchTypes();
      }
    } catch (error) {
      console.error('Error deleting/restoring exercise type:', error);
      toast.error('Không thể thực hiện thao tác');
    }
  };

  const resetForm = () => {
    setFormData({
      topicId: '',
      name: '',
      description: '',
      isActive: true
    });
    setSelectedType(null);
  };

  const filteredTypes = types.filter(type =>
    type.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Loại Bài Tập Ngữ Pháp</h2>
        <div className="flex gap-3">
          <button
            onClick={fetchTypes}
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
            placeholder="Tìm kiếm loại bài tập..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chủ đề</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số câu hỏi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTypes.map((type) => (
                <tr key={type.id} className={!type.isActive ? 'bg-gray-100' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{type.id}</td>
                  <td className="px-6 py-4 text-sm">{type.topicName}</td>
                  <td className="px-6 py-4 text-sm font-medium">{type.name}</td>
                  <td className="px-6 py-4 text-sm">{type.description || '-'}</td>
                  <td className="px-6 py-4 text-sm">{type.totalQuestions || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${
                      type.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {type.isActive ? 'Hoạt động' : 'Đã xóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleOpenModal('edit', type)}
                      className="text-blue-600 hover:text-blue-900 mx-2"
                      title="Sửa"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteRestore(type.id, type.isActive)}
                      className={`${type.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'} mx-2`}
                      title={type.isActive ? 'Xóa' : 'Khôi phục'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTypes.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {modalMode === 'add' ? 'Thêm Loại Bài Tập Mới' : 'Chỉnh Sửa Loại Bài Tập'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Chủ đề *</label>
                <select
                  value={formData.topicId}
                  onChange={(e) => setFormData({...formData, topicId: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Chọn chủ đề</option>
                  {topics.filter(t => t.isActive).map((topic) => (
                    <option key={topic.id} value={topic.id}>{topic.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Tên loại bài tập *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
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

export default GrammarExerciseTypeManagement;
