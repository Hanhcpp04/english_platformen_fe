import React from 'react';

const QuestionNavigator = ({ exercises, currentIndex, showFeedback, onNavigate }) => {
  return (
    <div className="mt-6 bg-white rounded-xl shadow-lg p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Các câu hỏi:</h3>
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
        {exercises.map((ex, index) => {
          const isAnswered = showFeedback[ex.id];
          const isCurrent = index === currentIndex;
          
          return (
            <button
              key={ex.id}
              onClick={() => onNavigate(index)}
              className={`aspect-square rounded-lg font-medium text-sm transition-all ${
                isCurrent
                  ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                  : isAnswered
                  ? isAnswered.isCorrect
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
