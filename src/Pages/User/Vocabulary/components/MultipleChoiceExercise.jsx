import React, { useState } from 'react';
import { Check, X, ChevronRight, RotateCw, Trophy } from 'lucide-react';

const MultipleChoiceExercise = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const question = questions[currentQuestion];

  const handleSelectAnswer = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    setShowResult(true);
    const isCorrect = selectedAnswer === question.correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
    }

    setAnsweredQuestions([
      ...answeredQuestions,
      {
        questionId: question.id,
        isCorrect,
        selectedAnswer,
      },
    ]);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
    setIsCompleted(false);
  };

  if (isCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-2xl mx-auto">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Hoàn thành!</h3>
            <p className="text-gray-500 text-sm">Chúc mừng bạn đã hoàn thành bài tập</p>
          </div>
          <div className="flex items-center justify-center gap-8 py-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {score}/{questions.length}
              </div>
              <div className="text-xs text-gray-500">Câu đúng</div>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{percentage}%</div>
              <div className="text-xs text-gray-500">Chính xác</div>
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow-md text-sm font-medium"
          >
            <RotateCw className="w-4 h-4" />
            Làm lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Compact Progress Header */}
      <div className="flex items-center gap-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Câu {currentQuestion + 1}/{questions.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {score} điểm
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
        {/* Question */}
        <div className="pb-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {question.question}
          </h3>
          <p className="text-sm text-gray-500">{question.questionVi}</p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctAnswer;
            const showCorrect = showResult && isCorrect;
            const showWrong = showResult && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={showResult}
                className={`relative p-4 rounded-lg border-2 text-left transition-all duration-200 group ${
                  showCorrect
                    ? 'border-green-500 bg-green-50'
                    : showWrong
                    ? 'border-red-500 bg-red-50'
                    : isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white'
                } ${showResult ? 'cursor-default' : 'cursor-pointer hover:scale-[1.02]'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    showCorrect
                      ? 'bg-green-500 border-green-500'
                      : showWrong
                      ? 'bg-red-500 border-red-500'
                      : isSelected
                      ? 'border-primary bg-primary'
                      : 'border-gray-300 group-hover:border-gray-400'
                  }`}>
                    {showCorrect && <Check className="w-4 h-4 text-white" />}
                    {showWrong && <X className="w-4 h-4 text-white" />}
                    {!showResult && isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    showCorrect || showWrong ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {option}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-3">
          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md text-sm font-medium"
            >
              <Check className="w-4 h-4" />
              Kiểm tra
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow-md text-sm font-medium"
            >
              {currentQuestion < questions.length - 1 ? 'Tiếp theo' : 'Hoàn thành'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultipleChoiceExercise;
