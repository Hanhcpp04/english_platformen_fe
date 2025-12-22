import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  BookOpen,
  CheckCircle,
  ArrowLeft,
  X,
  Save,
  RefreshCw,
  Download,
  Upload,
  FileSpreadsheet
} from 'lucide-react';
import { toast } from 'react-toastify';
import * as adminService from '../../../service/adminService';

const WORD_TYPES = ['Noun', 'Verb', 'Adjective', 'Adverb', 'Pronoun', 'Preposition', 'Conjunction', 'Interjection'];

const VocabManagement = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [words, setWords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedWord, setSelectedWord] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    englishWord: '',
    vietnameseMeaning: '',
    pronunciation: '',
    exampleSentence: '',
    exampleTranslation: '',
    wordType: 'Noun',
    xpReward: 5
  });

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      fetchWords();
    }
  }, [selectedTopic, currentPage]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllVocabTopics(0, 100);
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

  const fetchWords = async () => {
    try {
      setLoading(true);
      const response = await adminService.getWordsByTopic(selectedTopic.id, currentPage, pageSize);
      if (response.code === 1000 && response.result) {
        setWords(response.result.content || []);
        setTotalPages(response.result.totalPages || 0);
        setTotalElements(response.result.totalElements || 0);
      }
    } catch (error) {
      console.error('Error fetching words:', error);
      toast.error('Không thể tải danh sách từ vựng');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWord = async () => {
    if (!formData.englishWord || !formData.vietnameseMeaning) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    try {
      const wordData = {
        ...formData,
        topicId: selectedTopic.id
      };
      const response = await adminService.createVocabWord(wordData);
      if (response.code === 1000) {
        toast.success('Tạo từ vựng thành công');
        setShowModal(false);
        resetForm();
        fetchWords();
        fetchTopics();
      }
    } catch (error) {
      console.error('Error creating word:', error);
      toast.error('Không thể tạo từ vựng');
    }
  };

  const handleUpdateWord = async () => {
    try {
      const response = await adminService.updateVocabWord(selectedWord.id, formData);
      if (response.code === 1000) {
        toast.success('Cập nhật từ vựng thành công');
        setShowModal(false);
        resetForm();
        fetchWords();
      }
    } catch (error) {
      console.error('Error updating word:', error);
      toast.error('Không thể cập nhật từ vựng');
    }
  };

  const handleDeleteRestore = async (wordId, isActive) => {
    const status = isActive ? 'delete' : 'restore';
    const confirmMsg = isActive ? 'Bạn có chắc muốn xóa từ vựng này?' : 'Bạn có chắc muốn khôi phục từ vựng này?';
    
    if (!window.confirm(confirmMsg)) return;
    
    try {
      const response = await adminService.deleteOrRestoreVocabWord(wordId, status);
      if (response.code === 1000) {
        toast.success(isActive ? 'Đã xóa từ vựng' : 'Đã khôi phục từ vựng');
        fetchWords();
      }
    } catch (error) {
      console.error('Error deleting/restoring word:', error);
      toast.error('Không thể thực hiện thao tác');
    }
  };

  const resetForm = () => {
    setFormData({
      englishWord: '',
      vietnameseMeaning: '',
      pronunciation: '',
      exampleSentence: '',
      exampleTranslation: '',
      wordType: 'Noun',
      xpReward: 5
    });
    setSelectedWord(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalMode('add');
    setShowModal(true);
  };

  const openEditModal = (word) => {
    setSelectedWord(word);
    setFormData({
      englishWord: word.englishWord,
      vietnameseMeaning: word.vietnameseMeaning,
      pronunciation: word.pronunciation || '',
      exampleSentence: word.exampleSentence || '',
      exampleTranslation: word.exampleTranslation || '',
      wordType: word.wordType || 'Noun',
      xpReward: word.xpReward || 5
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      handleCreateWord();
    } else {
      handleUpdateWord();
    }
  };

  const filteredWords = words.filter((word) =>
    word.englishWord?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    word.vietnameseMeaning?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Excel import/export functions
  const handleDownloadTemplate = async () => {
    try {
      const blob = await adminService.downloadVocabTemplate();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Mau_Nhap_Tu_Vung_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Đã tải xuống mẫu Excel');
    } catch (error) {
      console.error('Error downloading template:', error);
      toast.error('Không thể tải mẫu Excel');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      toast.error('Vui lòng chọn file Excel (.xlsx)');
      return;
    }

    handleImportExcel(file);
  };

  const handleImportExcel = async (file) => {
    if (!selectedTopic) {
      toast.error('Vui lòng chọn chủ đề trước');
      return;
    }

    try {
      setImporting(true);
      const response = await adminService.importVocabFromExcel(selectedTopic.id, file);
      
      if (response.code === 1000 && response.result) {
        const result = response.result;
        
        if (result.successCount > 0) {
          toast.success(
            `Import thành công: ${result.successCount}/${result.totalRows} từ`,
            { autoClose: 5000 }
          );
          
          if (result.errors && result.errors.length > 0) {
            console.warn('Import errors:', result.errors);
            toast.warning(
              `Có ${result.failedCount} lỗi. Xem console để biết chi tiết.`,
              { autoClose: 5000 }
            );
          }
          
          fetchWords();
          fetchTopics();
        } else {
          toast.error(result.message || 'Import thất bại');
          if (result.errors && result.errors.length > 0) {
            console.error('Import errors:', result.errors);
          }
        }
      } else {
        toast.error(response.message || 'Import thất bại');
      }
    } catch (error) {
      console.error('Error importing Excel:', error);
      toast.error('Không thể import file Excel');
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    if (!selectedTopic) {
      toast.error('Vui lòng chọn chủ đề trước');
      return;
    }
    fileInputRef.current?.click();
  };

  // Topic selection view
  if (!selectedTopic) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý từ vựng</h1>
            <p className="text-sm text-gray-500 mt-1">Chọn chủ đề để quản lý từ vựng</p>
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
          {topics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="text-4xl">{topic.iconUrl || '📚'}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{topic.englishName}</h3>
                  <p className="text-sm text-gray-600">{topic.name}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full">
                      <BookOpen className="w-3 h-3" />
                      {topic.totalWords || 0}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full">
                      {topic.xpReward} XP
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${
                      topic.isActive ? 'bg-gray-200 text-gray-800' : 'bg-gray-300 text-gray-700'
                    }`}>
                      {topic.isActive ? 'Hoạt động' : 'Đã xóa'}
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

  // Word management view
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
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedTopic.iconUrl || '📚'}</span>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{selectedTopic.englishName}</h1>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">{selectedTopic.name}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">{totalElements} từ</span>
                    <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded">{selectedTopic.xpReward} XP</span>
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchWords}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
          <button
            onClick={handleDownloadTemplate}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Tải mẫu Excel
          </button>
          <button
            onClick={handleUploadClick}
            disabled={importing}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2 disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {importing ? 'Đang import...' : 'Nhập từ Excel'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm từ
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm từ vựng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700"
        />
      </div>

      {/* Words Table (Excel style) */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  STT
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Từ tiếng Anh
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Nghĩa tiếng Việt
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Phát âm
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Loại từ
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Câu ví dụ
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Dịch câu ví dụ
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  XP
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Trạng thái
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider sticky right-0 bg-gray-50">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWords.map((word, index) => (
                <tr key={word.id} className="hover:bg-gray-50">
                  <td className="px-2 py-3 text-sm text-gray-900 border-r border-gray-200">
                    {currentPage * pageSize + index + 1}
                  </td>
                  <td className="px-2 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                    {word.englishWord}
                  </td>
                  <td className="px-2 py-3 text-sm text-gray-700 border-r border-gray-200">
                    {word.vietnameseMeaning}
                  </td>
                  <td className="px-2 py-3 text-sm text-gray-500 border-r border-gray-200">
                    {word.pronunciation || '-'}
                  </td>
                  <td className="px-2 py-3 text-sm text-gray-600 border-r border-gray-200">
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                      {word.wordType}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-sm text-gray-600 border-r border-gray-200 max-w-xs">
                    <div className="line-clamp-2" title={word.exampleSentence}>
                      {word.exampleSentence || '-'}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-sm text-gray-600 border-r border-gray-200 max-w-xs">
                    <div className="line-clamp-2" title={word.exampleTranslation}>
                      {word.exampleTranslation || '-'}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-sm text-center border-r border-gray-200">
                    <span className="inline-flex px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
                      {word.xpReward}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-sm text-center border-r border-gray-200">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      word.isActive 
                        ? 'bg-gray-200 text-gray-800' 
                        : 'bg-gray-300 text-gray-700'
                    }`}>
                      {word.isActive ? 'Hoạt động' : 'Đã xóa'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-center sticky right-0 bg-white">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(word)}
                        className="p-1.5 text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRestore(word.id, word.isActive)}
                        className={`p-1.5 rounded transition-colors ${
                          word.isActive 
                            ? 'text-gray-700 hover:bg-gray-200' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title={word.isActive ? 'Xóa' : 'Khôi phục'}
                      >
                        {word.isActive ? (
                          <Trash2 className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Hiển thị {filteredWords.length} / {totalElements} từ
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0 || loading}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Trước
            </button>
            <span className="px-3 py-1.5 text-sm text-gray-700">
              Trang {currentPage + 1} / {totalPages || 1}
            </span>
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
                {modalMode === 'add' ? 'Thêm từ vựng mới' : 'Chỉnh sửa từ vựng'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Từ tiếng Anh *</label>
                  <input
                    type="text"
                    value={formData.englishWord}
                    onChange={(e) => setFormData({ ...formData, englishWord: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-700"
                    placeholder="VD: Hello, Computer..."
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Nghĩa tiếng Việt *</label>
                  <input
                    type="text"
                    value={formData.vietnameseMeaning}
                    onChange={(e) => setFormData({ ...formData, vietnameseMeaning: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-700"
                    placeholder="VD: Xin chào, Máy tính..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phát âm</label>
                  <input
                    type="text"
                    value={formData.pronunciation}
                    onChange={(e) => setFormData({ ...formData, pronunciation: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-700"
                    placeholder="VD: /həˈloʊ/"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Loại từ</label>
                  <select
                    value={formData.wordType}
                    onChange={(e) => setFormData({ ...formData, wordType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-700"
                  >
                    {WORD_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Câu ví dụ</label>
                  <textarea
                    value={formData.exampleSentence}
                    onChange={(e) => setFormData({ ...formData, exampleSentence: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-700"
                    rows={2}
                    placeholder="VD: Hello, how are you?"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Dịch câu ví dụ</label>
                  <textarea
                    value={formData.exampleTranslation}
                    onChange={(e) => setFormData({ ...formData, exampleTranslation: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-700"
                    rows={2}
                    placeholder="VD: Xin chào, bạn khỏe không?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">XP thưởng</label>
                  <input
                    type="number"
                    value={formData.xpReward}
                    onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-700"
                    min="1"
                  />
                </div>
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

export default VocabManagement;


