import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const MultipleChoiceExercise = ({ 
  question, 
  options, 
  correctAnswer, 
  userAnswer, 
  feedback, 
  onSelect, 
  disabled 
}) => {
  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const isSelected = userAnswer === option;
        const isCorrect = option === correctAnswer;
        
        let buttonClass = 'border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50';
        
        if (isSelected && !feedback) {
          buttonClass = 'border-2 border-blue-500 bg-blue-50';
        } else if (feedback) {
          if (isCorrect) {
            buttonClass = 'border-2 border-green-500 bg-green-50';
          } else if (isSelected && !isCorrect) {
            buttonClass = 'border-2 border-red-500 bg-red-50';
          } else {
            buttonClass = 'border-2 border-gray-200';
          }
        }

        return (
          <button
            key={index}
            onClick={() => onSelect(option)}
            disabled={disabled}
            className={`w-full text-left p-4 rounded-lg transition-all ${buttonClass} disabled:cursor-not-allowed`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">{option}</span>
              {feedback && isCorrect && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              {feedback && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default MultipleChoiceExercise;
