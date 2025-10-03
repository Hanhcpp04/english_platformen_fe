import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, PenTool, Trophy, Star, ChevronRight, Home } from 'lucide-react';
import FlashcardSection from './components/FlashcardSection';
import ExerciseSection from './components/ExerciseSection';

const VocabularyDetail = () => {
  const { topicId } = useParams();
  const [activeTab, setActiveTab] = useState('flashcard'); // 'flashcard' or 'exercise'

  // Mock data - thay thế bằng API call
  const topicData = {
    id: 1,
    emoji: '🏃',
    title: 'Daily Activities',
    titleVi: 'Hoạt động hàng ngày',
    description: 'Từ vựng về các hoạt động thường ngày',
    totalWords: 50,
    learnedWords: 45,
    vocabularies: [
      {
        id: 1,
        word: 'wake up',
        pronunciation: '/weɪk ʌp/',
        meaning: 'thức dậy',
        example: 'I wake up at 6 AM every day.',
        exampleVi: 'Tôi thức dậy lúc 6 giờ sáng mỗi ngày.',
        image: null,
      },
      {
        id: 2,
        word: 'breakfast',
        pronunciation: '/ˈbrek.fəst/',
        meaning: 'bữa sáng',
        example: 'I have breakfast with my family.',
        exampleVi: 'Tôi ăn sáng cùng gia đình.',
        image: null,
      },
     
    ],
    exercises: {
      multipleChoice: [
        {
          id: 1,
          question: 'What does "wake up" mean?',
          questionVi: '"Wake up" có nghĩa là gì?',
          options: ['thức dậy', 'ngủ', 'ăn sáng', 'đi làm'],
          correctAnswer: 0,
        },
        {
          id: 2,
          question: 'Choose the correct word: I have ___ at 7 AM.',
          questionVi: 'Chọn từ đúng: Tôi ___ lúc 7 giờ sáng.',
          options: ['lunch', 'breakfast', 'dinner', 'snack'],
          correctAnswer: 1,
        },
        // Thêm nhiều câu hỏi khác...
      ],
      wordArrangement: [
        {
          id: 1,
          question: 'Arrange the letters to form the correct word',
          questionVi: 'Sắp xếp các chữ cái để tạo thành từ đúng',
          hint: 'thức dậy',
          correctWord: 'wake up',
          scrambledLetters: ['u', 'p', 'w', 'a', 'k', 'e', ' '],
        },
        {
          id: 2,
          question: 'Arrange the letters to form the correct word',
          questionVi: 'Sắp xếp các chữ cái để tạo thành từ đúng',
          hint: 'bữa sáng',
          correctWord: 'breakfast',
          scrambledLetters: ['b', 'r', 'e', 'a', 'k', 'f', 'a', 's', 't'],
        },
        // Thêm nhiều câu hỏi khác...
      ],
    },
  };

  const tabs = [
    {
      id: 'flashcard',
      label: 'Flashcard',
      icon: BookOpen,
      color: 'text-primary',
      bgColor: 'bg-primary',
    },
    {
      id: 'exercise',
      label: 'Bài tập',
      icon: PenTool,
      color: 'text-primary',
      bgColor: 'bg-primary',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-2">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/dashboard" className="flex items-center gap-1 hover:text-primary transition-colors">
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/vocabulary" className="hover:text-primary transition-colors">
            Từ vựng
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{topicData.titleVi}</span>
        </div>

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{topicData.emoji}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {topicData.titleVi}
                </h1>
                <p className="text-gray-500 text-sm">{topicData.title}</p>
              </div>
            </div>
            
            {/* Progress Stats - Di chuyển lên cùng hàng */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 rounded-lg border border-yellow-200">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">
                  {topicData.learnedWords}/{topicData.totalWords}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-gray-700">+100 XP</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm">{topicData.description}</p>
        </div>

        {/* TABS */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1.5 inline-flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? `${tab.bgColor} text-white shadow-sm`
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div>
          {activeTab === 'flashcard' && (
            <FlashcardSection vocabularies={topicData.vocabularies} />
          )}
          {activeTab === 'exercise' && (
            <ExerciseSection exercises={topicData.exercises} />
          )}
        </div>
      </div>
    </div>
  );
};

export default VocabularyDetail;
