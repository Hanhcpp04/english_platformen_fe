import React, { useState } from 'react';
import { Check, X, ChevronRight, RotateCw, Trophy, Loader2 } from 'lucide-react';
import { submitExerciseAnswer } from '../../../../service/vocabularyService';
import { toast } from 'react-toastify';

const MultipleChoiceExercise = ({ questions, topicId, typeId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const question = questions[currentQuestion];

  // Kiểm tra câu hỏi hiện tại đã được trả lời chưa
  const isQuestionAnswered = answeredQuestions.some(
    (aq) => aq.questionId === question.id
  );

  const handleSelectAnswer = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  // Kiểm tra nếu câu hỏi đã hoàn thành khi load
  React.useEffect(() => {
    // Reset state khi chuyển câu
    setSelectedAnswer(null);
    setShowResult(false);
    setResult(null);

    // Kiểm tra nếu câu hỏi đã hoàn thành từ backend
    if (question.isCompleted) {
      setShowResult(true);
      setResult({
        isCorrect: true,
        correctAnswer: question.correctAnswer,
        isAlreadyCompleted: true,
        explanation: 'Bạn đã hoàn thành câu hỏi này rồi!'
      });
    }

    // Kiểm tra nếu câu hỏi đã được trả lời trong session này
    const answered = answeredQuestions.find((aq) => aq.questionId === question.id);
    if (answered) {
      setShowResult(true);
      setSelectedAnswer(answered.selectedAnswer);
      setResult(answered.result);
    }
  }, [currentQuestion, question.isCompleted, question.correctAnswer, question.id, answeredQuestions]);

  // 💚 Step 3: Submit answer to API
  const handleSubmit = async () => {
    if (selectedAnswer === null || submitting) return;

    // Ngăn submit nếu câu hỏi đã được trả lời
    if (isQuestionAnswered) {
      toast.warning('Bạn đã trả lời câu hỏi này rồi! Hãy chuyển sang câu tiếp theo.');
      return;
    }

    try {
      setSubmitting(true);

      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id;

      if (!userId) {
        toast.error('Vui lòng đăng nhập');
        return;
      }

      // Get user's answer text from options
      const userAnswer = question.options[selectedAnswer];

      const answerData = {
        userId,
        userAnswer,
        exerciseType: 'Trắc nghiệm (Multiple Choice)',
        typeId,
        topicId
      };

      // Debug logging
      console.log('📝 Submitting answer:', {
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        answerData
      });

      const response = await submitExerciseAnswer(question.id, answerData);

      // Debug response
      console.log('📨 API Response:', response);

      if (response.code === 1000 && response.result) {
        const apiResult = response.result;
        
        // Kiểm tra nếu câu hỏi đã được hoàn thành trước đó
        if (apiResult.isAlreadyCompleted) {
          toast.info('Bạn đã hoàn thành câu hỏi này rồi!');
          setResult(apiResult);
          setShowResult(true);
          
          // Lưu vào answeredQuestions để không cho làm lại
          setAnsweredQuestions([
            ...answeredQuestions,
            {
              questionId: question.id,
              isCorrect: apiResult.isCorrect,
              selectedAnswer,
              result: apiResult,
              isAlreadyCompleted: true
            },
          ]);
          return;
        }
        
        setResult(apiResult);
        setShowResult(true);

        // Update score if correct (chỉ cộng điểm nếu chưa hoàn thành)
        if (apiResult.isCorrect && !apiResult.isAlreadyCompleted) {
          setScore(score + 1);
          toast.success(`Chính xác! +${apiResult.xpEarned} XP`);
        } else if (!apiResult.isCorrect) {
          toast.error(`Chưa đúng! Đáp án đúng: ${apiResult.correctAnswer}`);
        }

        // Track answered questions
        setAnsweredQuestions([
          ...answeredQuestions,
          {
            questionId: question.id,
            isCorrect: apiResult.isCorrect,
            selectedAnswer,
            result: apiResult,
            isAlreadyCompleted: false
          },
        ]);
      } else {
        throw new Error(response.message || 'Không thể gửi câu trả lời');
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      toast.error(err.message || 'Có lỗi xảy ra khi gửi câu trả lời');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setResult(null);
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
    setResult(null);
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
            {result?.totalXp && (
              <>
                <div className="w-px h-12 bg-gray-200" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{result.totalXp}</div>
                  <div className="text-xs text-gray-500">Tổng XP</div>
                </div>
              </>
            )}
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
          {question.questionVi && (
            <p className="text-sm text-gray-500">{question.questionVi}</p>
          )}
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options && question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = showResult && result && option === result.correctAnswer;
            const showWrong = showResult && isSelected && !result?.isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={showResult}
                className={`relative p-4 rounded-lg border-2 text-left transition-all duration-200 group ${
                  isCorrect
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
                    isCorrect
                      ? 'bg-green-500 border-green-500'
                      : showWrong
                      ? 'bg-red-500 border-red-500'
                      : isSelected
                      ? 'border-primary bg-primary'
                      : 'border-gray-300 group-hover:border-gray-400'
                  }`}>
                    {isCorrect && <Check className="w-4 h-4 text-white" />}
                    {showWrong && <X className="w-4 h-4 text-white" />}
                    {!showResult && isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
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

        {/* Explanation (if available after submit) */}
        {showResult && result?.explanation && (
          <div className={`p-4 rounded-lg ${
            result.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <p className={`text-sm ${result.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {result.explanation}
              </p>
              {result.isAlreadyCompleted && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2 whitespace-nowrap">
                  Đã hoàn thành
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between pt-3">
          {/* Previous Button */}
          <button
            onClick={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1);
              }
            }}
            disabled={currentQuestion === 0}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md text-sm font-medium"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Câu trước
          </button>

          {/* Submit or Next Button */}
          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null || submitting || isQuestionAnswered}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md text-sm font-medium"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang kiểm tra...
                </>
              ) : isQuestionAnswered ? (
                <>
                  <Check className="w-4 h-4" />
                  Đã trả lời
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Kiểm tra
                </>
              )}
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
