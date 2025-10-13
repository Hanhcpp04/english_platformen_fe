import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen,
  Volume2,
  Eye,
  Filter,
  Download,
  Image as ImageIcon,
  CheckCircle
} from 'lucide-react';

const VocabManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');

  // make vocabularyWords stateful so we can add/update/delete
  const [vocabularyWords, setVocabularyWords] = useState([
    {
      id: 1,
      topicId: 1,
      topicName: 'Tiếng Anh Thương mại',
      englishWord: 'Meeting',
      vietnameseMeaning: 'Cuộc họp, gặp gỡ',
      pronunciation: '/ˈmiːtɪŋ/',
      wordType: 'Danh từ',
      exampleSentence: 'We have a meeting at 10 AM.',
      exampleTranslation: 'Chúng tôi có một cuộc họp lúc 10 giờ sáng.',
      xpReward: 3,
      isActive: true,
      hasAudio: true,
      hasImage: true,
    },
    {
      id: 2,
      topicId: 1,
      topicName: 'Tiếng Anh Thương mại',
      englishWord: 'Presentation',
      vietnameseMeaning: 'Bài thuyết trình',
      pronunciation: '/ˌprezənˈteɪʃn/',
      wordType: 'Danh từ',
      exampleSentence: 'I will give a presentation tomorrow.',
      exampleTranslation: 'Tôi sẽ thuyết trình vào ngày mai.',
      xpReward: 3,
      isActive: true,
      hasAudio: true,
      hasImage: false,
    },
    {
      id: 3,
      topicId: 2,
      topicName: 'Du lịch & Khách sạn',
      englishWord: 'Airport',
      vietnameseMeaning: 'Sân bay',
      pronunciation: '/ˈeəpɔːt/',
      wordType: 'Danh từ',
      exampleSentence: 'The airport is very crowded today.',
      exampleTranslation: 'Sân bay hôm nay rất đông.',
      xpReward: 3,
      isActive: true,
      hasAudio: true,
      hasImage: true,
    },
    {
      id: 4,
      topicId: 3,
      topicName: 'Công nghệ',
      englishWord: 'Software',
      vietnameseMeaning: 'Phần mềm',
      pronunciation: '/ˈsɒftweə(r)/',
      wordType: 'Danh từ',
      exampleSentence: 'This software is very useful.',
      exampleTranslation: 'Phần mềm này rất hữu ích.',
      xpReward: 3,
      isActive: false,
      hasAudio: true,
      hasImage: false,
    },
  ]);

  const topics = [
    { id: 1, name: 'Tiếng Anh Thương mại' },
    { id: 2, name: 'Du lịch & Khách sạn' },
    { id: 3, name: 'Công nghệ' },
    { id: 4, name: 'Ẩm thực' },
  ];

  // Modal & form state for add/edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWordId, setEditingWordId] = useState(null);
  const [formWord, setFormWord] = useState({
    topicId: '1',
    englishWord: '',
    vietnameseMeaning: '',
    pronunciation: '',
    wordType: '',
    exampleSentence: '',
    exampleTranslation: '',
    xpReward: 3,
    isActive: true,
    hasAudio: false,
    hasImage: false,
  });

  const openAddWord = () => {
    setEditingWordId(null);
    setFormWord({
      topicId: '1',
      englishWord: '',
      vietnameseMeaning: '',
      pronunciation: '',
      wordType: '',
      exampleSentence: '',
      exampleTranslation: '',
      xpReward: 3,
      isActive: true,
      hasAudio: false,
      hasImage: false,
    });
    setIsModalOpen(true);
  };

  const openEditWord = (word) => {
    setEditingWordId(word.id);
    setFormWord({
      topicId: word.topicId.toString(),
      englishWord: word.englishWord,
      vietnameseMeaning: word.vietnameseMeaning,
      pronunciation: word.pronunciation || '',
      wordType: word.wordType || '',
      exampleSentence: word.exampleSentence || '',
      exampleTranslation: word.exampleTranslation || '',
      xpReward: word.xpReward || 0,
      isActive: !!word.isActive,
      hasAudio: !!word.hasAudio,
      hasImage: !!word.hasImage,
    });
    setIsModalOpen(true);
  };

  const handleSaveWord = () => {
    const topic = topics.find(t => t.id.toString() === formWord.topicId);
    if (editingWordId == null) {
      // add new
      const newWord = {
        id: Date.now(),
        topicId: Number(formWord.topicId),
        topicName: topic ? topic.name : 'Chung',
        englishWord: formWord.englishWord || 'New Word',
        vietnameseMeaning: formWord.vietnameseMeaning || '',
        pronunciation: formWord.pronunciation || '',
        wordType: formWord.wordType || '',
        exampleSentence: formWord.exampleSentence || '',
        exampleTranslation: formWord.exampleTranslation || '',
        xpReward: Number(formWord.xpReward) || 0,
        isActive: !!formWord.isActive,
        hasAudio: !!formWord.hasAudio,
        hasImage: !!formWord.hasImage,
      };
      setVocabularyWords(prev => [newWord, ...prev]);
    } else {
      // update
      setVocabularyWords(prev => prev.map(w => w.id === editingWordId ? {
        ...w,
        topicId: Number(formWord.topicId),
        topicName: topic ? topic.name : w.topicName,
        englishWord: formWord.englishWord,
        vietnameseMeaning: formWord.vietnameseMeaning,
        pronunciation: formWord.pronunciation,
        wordType: formWord.wordType,
        exampleSentence: formWord.exampleSentence,
        exampleTranslation: formWord.exampleTranslation,
        xpReward: Number(formWord.xpReward),
        isActive: !!formWord.isActive,
        hasAudio: !!formWord.hasAudio,
        hasImage: !!formWord.hasImage,
      } : w));
    }
    setIsModalOpen(false);
  };

  const handleToggleActive = (wordId) => {
    setVocabularyWords(prev => prev.map(w => w.id === wordId ? { ...w, isActive: !w.isActive } : w));
  };

  const handleDeleteWord = (wordId) => {
    if (!window.confirm('Bạn có chắc muốn xóa từ này?')) return;
    setVocabularyWords(prev => prev.filter(w => w.id !== wordId));
  };

  const filteredWords = vocabularyWords.filter((word) => {
    const matchesSearch = word.englishWord.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         word.vietnameseMeaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === 'all' || word.topicId.toString() === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  const stats = [
    { label: 'Tổng số từ', value: vocabularyWords.length, icon: BookOpen, color: 'blue' },
    { label: 'Từ đang hoạt động', value: vocabularyWords.filter(w => w.isActive).length, icon: CheckCircle, color: 'green' },
    { label: 'Có âm thanh', value: vocabularyWords.filter(w => w.hasAudio).length, icon: Volume2, color: 'purple' },
    { label: 'Có hình ảnh', value: vocabularyWords.filter(w => w.hasImage).length, icon: ImageIcon, color: 'yellow' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý từ vựng</h1>
          <p className="text-gray-600 mt-1">Quản lý tất cả từ vựng trong hệ thống</p>
        </div>
        <button
          onClick={openAddWord}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm từ mới
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`bg-${stat.color}-50 p-3 rounded-lg`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo từ tiếng Anh hoặc nghĩa tiếng Việt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Topic Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả chủ đề</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id.toString()}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Xuất
          </button>
        </div>
      </div>

      {/* Vocabulary Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Từ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nghĩa (VN)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chủ đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại từ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Media
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWords.map((word) => (
                <tr key={word.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{word.englishWord}</div>
                      <div className="text-xs text-gray-500">{word.pronunciation}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">{word.vietnameseMeaning}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {word.topicName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{word.wordType}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {word.hasAudio && (
                        <span className="inline-flex items-center p-1 bg-purple-50 text-purple-600 rounded" title="Có âm thanh">
                          <Volume2 className="w-3 h-3" />
                        </span>
                      )}
                      {word.hasImage && (
                        <span className="inline-flex items-center p-1 bg-green-50 text-green-600 rounded" title="Có hình ảnh">
                          <ImageIcon className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        word.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {word.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-900 transition-colors" title="Xem">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditWord(word)}
                        className="text-gray-600 hover:text-gray-900 transition-colors" title="Sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(word.id)}
                        className={`px-2 py-1 text-xs rounded ${word.isActive ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}
                        title={word.isActive ? 'Tắt' : 'Bật'}
                      >
                        {word.isActive ? 'Tắt' : 'Bật'}
                      </button>
                      <button
                        onClick={() => handleDeleteWord(word.id)}
                        className="text-red-600 hover:text-red-900 transition-colors" title="Xóa"
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
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">{filteredWords.length}</span> trên tổng số{' '}
              <span className="font-medium">{vocabularyWords.length}</span> từ
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                Trước
              </button>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                1
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                2
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                Tiếp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add / Edit Word */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white rounded-lg p-6 z-10 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">{editingWordId ? 'Cập nhật từ' : 'Thêm từ mới'}</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                <input
                  value={formWord.englishWord}
                  onChange={(e) => setFormWord({ ...formWord, englishWord: e.target.value })}
                  placeholder="Từ tiếng Anh"
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  value={formWord.vietnameseMeaning}
                  onChange={(e) => setFormWord({ ...formWord, vietnameseMeaning: e.target.value })}
                  placeholder="Nghĩa tiếng Việt"
                  className="w-full px-3 py-2 border rounded"
                />
                <div className="flex gap-2">
                  <input
                    value={formWord.pronunciation}
                    onChange={(e) => setFormWord({ ...formWord, pronunciation: e.target.value })}
                    placeholder="Phiên âm"
                    className="flex-1 px-3 py-2 border rounded"
                  />
                  <input
                    value={formWord.wordType}
                    onChange={(e) => setFormWord({ ...formWord, wordType: e.target.value })}
                    placeholder="Loại từ"
                    className="w-40 px-3 py-2 border rounded"
                  />
                </div>
                <textarea
                  value={formWord.exampleSentence}
                  onChange={(e) => setFormWord({ ...formWord, exampleSentence: e.target.value })}
                  placeholder="Câu ví dụ (EN)"
                  className="w-full px-3 py-2 border rounded"
                />
                <textarea
                  value={formWord.exampleTranslation}
                  onChange={(e) => setFormWord({ ...formWord, exampleTranslation: e.target.value })}
                  placeholder="Dịch câu ví dụ (VN)"
                  className="w-full px-3 py-2 border rounded"
                />
                <div className="flex gap-2 items-center">
                  <select
                    value={formWord.topicId}
                    onChange={(e) => setFormWord({ ...formWord, topicId: e.target.value })}
                    className="px-3 py-2 border rounded"
                  >
                    {topics.map(t => <option key={t.id} value={t.id.toString()}>{t.name}</option>)}
                  </select>
                  <input
                    type="number"
                    value={formWord.xpReward}
                    onChange={(e) => setFormWord({ ...formWord, xpReward: Number(e.target.value) })}
                    className="w-28 px-3 py-2 border rounded"
                    placeholder="XP"
                  />
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={formWord.hasAudio} onChange={e => setFormWord({ ...formWord, hasAudio: e.target.checked })} />
                    <span className="text-sm">Có âm thanh</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={formWord.hasImage} onChange={e => setFormWord({ ...formWord, hasImage: e.target.checked })} />
                    <span className="text-sm">Có hình ảnh</span>
                  </label>
                </div>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={formWord.isActive} onChange={e => setFormWord({ ...formWord, isActive: e.target.checked })} />
                  <span className="text-sm">Đang hoạt động</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded border">Hủy</button>
                <button onClick={handleSaveWord} className="px-4 py-2 bg-blue-600 text-white rounded">Lưu</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabManagement;
