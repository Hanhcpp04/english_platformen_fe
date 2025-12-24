import React from 'react';
import VocabExerciseTypeManagement from './VocabExerciseTypeManagement';
import VocabExerciseQuestionManagement from './VocabExerciseQuestionManagement';

const VocabExerciseManagement = () => {
  const [activeTab, setActiveTab] = React.useState('types');

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Quản Lý Bài Tập Từ Vựng</h1>
      
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('types')}
          className={`pb-3 px-4 ${
            activeTab === 'types'
              ? 'border-b-2 border-blue-500 text-blue-600 font-semibold'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          Loại Bài Tập
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`pb-3 px-4 ${
            activeTab === 'questions'
              ? 'border-b-2 border-blue-500 text-blue-600 font-semibold'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          Câu Hỏi
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'types' && <VocabExerciseTypeManagement />}
        {activeTab === 'questions' && <VocabExerciseQuestionManagement />}
      </div>
    </div>
  );
};

export default VocabExerciseManagement;
