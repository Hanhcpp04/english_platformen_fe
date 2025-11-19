import React from 'react';

const FillBlankExercise = ({ 
  userAnswer, 
  feedback, 
  onAnswerChange, 
  disabled 
}) => {
  return (
    <div>
      <input
        type="text"
        value={userAnswer || ''}
        onChange={(e) => onAnswerChange(e.target.value)}
        disabled={disabled}
        placeholder="Nhập câu trả lời của bạn..."
        className={`w-full px-4 py-3 border-2 rounded-lg text-lg focus:outline-none transition-all ${
          feedback
            ? feedback.isCorrect
              ? 'border-green-500 bg-green-50'
              : 'border-red-500 bg-red-50'
            : 'border-gray-200 focus:border-blue-500'
        } disabled:cursor-not-allowed`}
      />
    </div>
  );
};

export default FillBlankExercise;
