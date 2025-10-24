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

  // Dummy vocabulary data
  const vocabularyWords = [
    {
      id: 1,
      topicId: 1,
      topicName: 'Business English',
      englishWord: 'Meeting',
      vietnameseMeaning: 'Cuộc họp, gặp gỡ',
      pronunciation: '/ˈmiːtɪŋ/',
      wordType: 'Noun',
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
      topicName: 'Business English',
      englishWord: 'Presentation',
      vietnameseMeaning: 'Bài thuyết trình',
      pronunciation: '/ˌprezənˈteɪʃn/',
      wordType: 'Noun',
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
      topicName: 'Travel & Tourism',
      englishWord: 'Airport',
      vietnameseMeaning: 'Sân bay',
      pronunciation: '/ˈeəpɔːt/',
      wordType: 'Noun',
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
      topicName: 'Technology',
      englishWord: 'Software',
      vietnameseMeaning: 'Phần mềm',
      pronunciation: '/ˈsɒftweə(r)/',
      wordType: 'Noun',
      exampleSentence: 'This software is very useful.',
      exampleTranslation: 'Phần mềm này rất hữu ích.',
      xpReward: 3,
      isActive: false,
      hasAudio: true,
      hasImage: false,
    },
  ];

  const topics = [
    { id: 1, name: 'Business English' },
    { id: 2, name: 'Travel & Tourism' },
    { id: 3, name: 'Technology' },
    { id: 4, name: 'Food & Dining' },
  ];

  const filteredWords = vocabularyWords.filter((word) => {
    const matchesSearch = word.englishWord.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         word.vietnameseMeaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === 'all' || word.topicId.toString() === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  const stats = [
    { label: 'Total Words', value: vocabularyWords.length, icon: BookOpen, color: 'blue' },
    { label: 'Active Words', value: vocabularyWords.filter(w => w.isActive).length, icon: CheckCircle, color: 'green' },
    { label: 'With Audio', value: vocabularyWords.filter(w => w.hasAudio).length, icon: Volume2, color: 'purple' },
    { label: 'With Images', value: vocabularyWords.filter(w => w.hasImage).length, icon: ImageIcon, color: 'yellow' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vocabulary Management</h1>
          <p className="text-gray-600 mt-1">Manage all vocabulary words in the system</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add New Word
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
                placeholder="Search by English word or Vietnamese meaning..."
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
              <option value="all">All Topics</option>
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
            Export
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
                  Word
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vietnamese
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Topic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Media
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
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
                        <span className="inline-flex items-center p-1 bg-purple-50 text-purple-600 rounded">
                          <Volume2 className="w-3 h-3" />
                        </span>
                      )}
                      {word.hasImage && (
                        <span className="inline-flex items-center p-1 bg-green-50 text-green-600 rounded">
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
                      {word.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-900 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 transition-colors">
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
              Showing <span className="font-medium">{filteredWords.length}</span> of{' '}
              <span className="font-medium">{vocabularyWords.length}</span> words
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                1
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                2
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabManagement;
