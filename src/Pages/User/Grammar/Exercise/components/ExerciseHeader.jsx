import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, Brain } from 'lucide-react';

const ExerciseHeader = ({ 
  topicId, 
  currentIndex, 
  totalQuestions, 
  answeredCount, 
  progress 
}) => {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="h-2 bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="container mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link to="/dashboard" className="hover:text-blue-600">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/grammar" className="hover:text-blue-600">
            Ngữ pháp
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/grammar/${topicId}`} className="hover:text-blue-600">
            Chi tiết
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Bài tập</span>
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Bài tập ôn tập</h1>
              <p className="text-sm text-gray-600">
                Câu {currentIndex + 1}/{totalQuestions}
              </p>
            </div>
          </div>
          
          <div className="text-sm font-medium text-gray-600">
            Đã trả lời: {answeredCount}/{totalQuestions}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseHeader;
