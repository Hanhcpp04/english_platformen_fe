import React, { useState, useEffect } from 'react';
import { Check, X, ChevronRight, RotateCw, Trophy, Lightbulb } from 'lucide-react';

const WordArrangementExercise = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [availableLetters, setAvailableLetters] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const question = questions[currentQuestion];

  useEffect(() => {
    // Shuffle letters when question changes
    const shuffled = [...question.scrambledLetters].sort(() => Math.random() - 0.5);
    setAvailableLetters(shuffled);
    setSelectedLetters([]);
    setShowResult(false);
    setIsCorrect(false);
  }, [currentQuestion]);

  const handleSelectLetter = (letter, index) => {
    setSelectedLetters([...selectedLetters, { letter, originalIndex: index }]);
    setAvailableLetters(availableLetters.filter((_, i) => i !== index));
  };

  const handleRemoveLetter = (index) => {
    const removedLetter = selectedLetters[index];
    setSelectedLetters(selectedLetters.filter((_, i) => i !== index));
    setAvailableLetters([...availableLetters, removedLetter.letter]);
  };

  const handleClear = () => {
    setAvailableLetters([...question.scrambledLetters].sort(() => Math.random() - 0.5));
    setSelectedLetters([]);
    setShowResult(false);
  };

  const handleSubmit = () => {
    const userAnswer = selectedLetters.map((item) => item.letter).join('');
    const correct = userAnswer.toLowerCase() === question.correctWord.toLowerCase();
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setScore(0);
    setIsCompleted(false);
    setSelectedLetters([]);
    setShowResult(false);
  };

  if (isCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white rounded-lg border-2 border-gray-100 p-8">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-10 h-10 text-purple-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Hoàn thành bài tập!
            </h3>
            <p className="text-gray-600">Chúc mừng bạn đã hoàn thành bài tập sắp xếp chữ</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Số câu đúng:</span>
              <span className="text-2xl font-bold text-purple-600">
                {score}/{questions.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Độ chính xác:</span>
              <span className="text-2xl font-bold text-purple-600">{percentage}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-4">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all mx-auto shadow-md hover:shadow-lg"
          >
            <RotateCw className="w-5 h-5" />
            Làm lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="bg-white rounded-lg border-2 border-gray-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Câu {currentQuestion + 1} / {questions.length}
          </span>
          <span className="text-sm text-gray-500">
            Điểm: {score}/{questions.length}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg border-2 border-gray-100 p-8 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {question.question}
          </h3>
          <p className="text-gray-600 mb-4">{question.questionVi}</p>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg inline-flex">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-purple-700">
              <strong>Gợi ý:</strong> {question.hint}
            </span>
          </div>
        </div>

        {/* Answer Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Từ của bạn:
          </label>
          <div
            className={`min-h-[80px] p-4 rounded-lg border-2 transition-all ${
              showResult
                ? isCorrect
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
                    onClick={() => !showResult && handleRemoveLetter(index)}
                    disabled={showResult}
                    className="px-4 py-3 bg-white border-2 border-purple-300 rounded-lg font-bold text-lg text-gray-900 hover:bg-purple-50 transition-all disabled:cursor-default"
                  >
                    {item.letter}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Available Letters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Các chữ cái có sẵn:
          </label>
          <div className="min-h-[80px] p-4 bg-white rounded-lg border-2 border-gray-200">
            <div className="flex flex-wrap gap-2">
              {availableLetters.map((letter, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && handleSelectLetter(letter, index)}
                  disabled={showResult}
                  className="px-4 py-3 bg-purple-50 border-2 border-purple-200 rounded-lg font-bold text-lg text-gray-900 hover:bg-purple-100 hover:border-purple-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result Message */}
        {showResult && (
          <div
            className={`p-4 rounded-lg flex items-center gap-3 ${
              isCorrect
                ? 'bg-green-50 border-2 border-green-200'
                : 'bg-red-50 border-2 border-red-200'
            }`}
          >
            {isCorrect ? (
              <>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-green-800">Chính xác!</p>
                  <p className="text-sm text-green-700">
                    Từ đúng là: <strong>{question.correctWord}</strong>
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <X className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-red-800">Chưa đúng!</p>
                  <p className="text-sm text-red-700">
                    Từ đúng là: <strong>{question.correctWord}</strong>
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-4">
          <button
            onClick={handleClear}
            disabled={showResult || selectedLetters.length === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Xóa hết
          </button>
          <div className="flex gap-3">
            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={selectedLetters.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                <Check className="w-5 h-5" />
                Kiểm tra
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                {currentQuestion < questions.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành'}
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordArrangementExercise;
