import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

// Component hiển thị các lựa chọn trắc nghiệm
const MultipleChoiceExercise = ({ 
  question, 
  options, 
  correctAnswer, 
  userAnswer, 
  feedback, 
  onSelect, 
  disabled 
}) => {
  // Hàm chuẩn hóa giá trị để so sánh
  const normalize = (value) => {
    if (value === undefined || value === null) return '';
    return String(value).trim().toLowerCase();
  };

  return (
    <div className="space-y-3">
      {/* Lặp qua từng lựa chọn */}
      {options.map((option, index) => {
        const normalizedOption = normalize(option);
        const normalizedUserAnswer = normalize(userAnswer);
        const normalizedCorrectAnswer = normalize(correctAnswer);
        
        // Kiểm tra lựa chọn này có được chọn không
        const isSelected = normalizedUserAnswer === normalizedOption;
        
        // Xác định lựa chọn này có đúng không
        let isCorrect;
        if (normalizedCorrectAnswer) {
          // So sánh với đáp án đúng nếu có
          isCorrect = normalizedOption === normalizedCorrectAnswer;
        } else if (feedback && feedback.isCorrect) {
          // Nếu backend trả về đúng và lựa chọn này được chọn
          isCorrect = isSelected;
        } else {
          isCorrect = false;
        }
        
        // Xác định class cho button theo trạng thái
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
              {/* Hiển thị icon đúng/sai nếu đã có feedback */}
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
