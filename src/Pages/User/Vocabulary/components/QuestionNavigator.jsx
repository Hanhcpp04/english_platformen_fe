import React from 'react';

const QuestionNavigator = ({ questions, currentIndex, answeredQuestions, onNavigate }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-gray-600">Câu hỏi</h3>
        <span className="text-xs text-gray-500">{currentIndex + 1}/{questions.length}</span>
      </div>
      <div className="grid grid-cols-10 md:grid-cols-15 lg:grid-cols-20 gap-1.5">
        {questions.map((question, index) => {
          const isAnswered = answeredQuestions[question.id];
          const isCurrent = index === currentIndex;
          
          return (
            <button
              key={question.id}
              onClick={() => onNavigate(index)}
              className={`aspect-square rounded text-xs font-medium transition-all ${
                isCurrent
                  ? 'bg-primary text-white ring-1 ring-primary/50 scale-110'
                  : isAnswered
                  ? isAnswered.isCorrect
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionNavigator;
