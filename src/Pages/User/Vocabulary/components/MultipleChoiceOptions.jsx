import React from 'react';
import { Check, X } from 'lucide-react';

// Component hiển thị các lựa chọn trắc nghiệm
const MultipleChoiceOptions = ({ 
  options,
  currentAnswer,
  onSelect,
  disabled 
}) => {
  // Hàm chuẩn hóa giá trị để so sánh
  const normalize = (value) => {
    if (value === undefined || value === null) return '';
    return String(value).trim().toLowerCase();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Lặp qua từng lựa chọn */}
      {options.map((option, index) => {
        const normalizedOption = normalize(option);
        const normalizedUserAnswer = currentAnswer ? normalize(currentAnswer.userAnswer) : '';
        const normalizedCorrectAnswer = currentAnswer ? normalize(currentAnswer.correctAnswer) : '';
        
        // Kiểm tra lựa chọn này có được chọn không
        const isSelected = normalizedUserAnswer === normalizedOption;
        
        // Xác định lựa chọn này có đúng không
        const isCorrect = normalizedOption === normalizedCorrectAnswer;
        
        // Hiển thị sai nếu được chọn nhưng không đúng
        const showWrong = currentAnswer && isSelected && !currentAnswer.isCorrect;
        
        // Xác định class cho button theo trạng thái
        let buttonClass = 'border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white';
        
        if (isCorrect) {
          buttonClass = 'border-green-500 bg-green-50';
        } else if (showWrong) {
          buttonClass = 'border-red-500 bg-red-50';
        } else if (isSelected) {
          buttonClass = 'border-primary bg-primary/5 shadow-sm';
        }

        // Xác định class cho radio circle
        let circleClass = 'border-gray-300 group-hover:border-gray-400';
        
        if (isCorrect) {
          circleClass = 'bg-green-500 border-green-500';
        } else if (showWrong) {
          circleClass = 'bg-red-500 border-red-500';
        } else if (isSelected) {
          circleClass = 'border-primary bg-primary';
        }

        return (
          <button
            key={index}
            onClick={() => onSelect(index)}
            disabled={disabled}
            className={`relative p-4 rounded-lg border-2 text-left transition-all duration-200 group ${buttonClass} ${
              currentAnswer ? 'cursor-default' : 'cursor-pointer hover:scale-[1.02]'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <div className="flex items-center gap-3">
              {/* Radio Circle với icon */}
              <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${circleClass}`}>
                {isCorrect && <Check className="w-4 h-4 text-white" />}
                {showWrong && <X className="w-4 h-4 text-white" />}
              </div>
              
              {/* Text lựa chọn */}
              <span className={`text-sm font-medium ${
                isCorrect || showWrong ? 'text-gray-900' : 'text-gray-700'
              }`}>
                {option}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default MultipleChoiceOptions;
