import React from 'react';

// Component hiển thị các chữ cái sắp xếp
const WordScrambleLetters = ({
  selectedLetters,
  availableLetters,
  currentAnswer,
  onSelectLetter,
  onRemoveLetter,
  disabled
}) => {
  return (
    <div className="space-y-4">
      {/* Khu vực chữ đã chọn (Answer Area) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Từ của bạn:
        </label>
        <div
          className={`min-h-[80px] p-4 rounded-lg border-2 transition-all ${
            currentAnswer
              ? currentAnswer.isCorrect
                ? 'border-green-500 bg-green-50'
                : 'border-red-500 bg-red-50'
              : 'border-gray-300 bg-gray-50'
          }`}
        >
          <div className="flex flex-wrap gap-2">
            {selectedLetters.length === 0 ? (
              <span className="text-gray-400 italic">Chọn các chữ cái bên dưới...</span>
            ) : (
              selectedLetters.map((item, index) => (
                <button
                  key={index}
                  onClick={() => !disabled && onRemoveLetter(index)}
                  disabled={disabled}
                  className={`px-4 py-3 bg-white border-2 border-purple-300 rounded-lg font-bold text-lg text-gray-900 transition-all disabled:cursor-default ${
                    !disabled ? 'hover:bg-purple-50 cursor-pointer' : ''
                  }`}
                  type="button"
                >
                  {item.letter}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Khu vực chữ cái có sẵn (Available Letters) */}
      {!currentAnswer && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Các chữ cái có sẵn:
          </label>
          <div className="min-h-[80px] p-4 bg-white rounded-lg border-2 border-gray-200">
            <div className="flex flex-wrap gap-2">
              {availableLetters.length === 0 ? (
                <span className="text-gray-400 italic">Tất cả chữ cái đã được chọn</span>
              ) : (
                availableLetters.map((letter, index) => (
                  <button
                    key={index}
                    onClick={() => !disabled && onSelectLetter(letter, index)}
                    disabled={disabled}
                    className="px-4 py-3 bg-purple-50 border-2 border-purple-200 rounded-lg font-bold text-lg text-gray-900 hover:bg-purple-100 hover:border-purple-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                  >
                    {letter}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordScrambleLetters;
