import React, { useState } from 'react';
import { Check, X, ChevronRight, RotateCw, Trophy, Loader2 } from 'lucide-react';
import { submitExerciseAnswer } from '../../../../service/vocabularyService';
import { toast } from 'react-toastify';

const MultipleChoiceExercise = ({ questions, topicId, typeId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]); // Lưu tất cả câu trả lời trong phiên
  const [isCompleted, setIsCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const question = questions[currentQuestion];

  // Kiểm tra câu hỏi hiện tại đã được trả lời trong phiên chưa
  const currentAnswer = answeredQuestions.find((aq) => aq.questionId === question.id);

  const handleSelectAnswer = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  // Kiểm tra nếu câu hỏi đã hoàn thành khi load hoặc đã trả lời trong phiên
  React.useEffect(() => {
    // Reset state khi chuyển câu
    const answered = answeredQuestions.find((aq) => aq.questionId === question.id);
    
    if (answered) {
      // Câu hỏi đã được trả lời trong phiên này
      setSelectedAnswer(answered.selectedAnswerIndex);
      setShowResult(true);
    } else {
      // Câu hỏi mới chưa trả lời
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [currentQuestion, question.id, answeredQuestions]);

  // 💚 Kiểm tra câu trả lời (KHÔNG submit API ngay)
  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    // Ngăn submit nếu câu hỏi đã được trả lời trong phiên
    if (currentAnswer) {
      toast.warning('Bạn đã trả lời câu hỏi này rồi! Hãy chuyển sang câu tiếp theo.');
      return;
    }

    // Lấy đáp án người dùng chọn
    const userAnswer = question.options[selectedAnswer];
    const isCorrect = userAnswer === question.correctAnswer;

    // Lưu câu trả lời vào phiên làm bài
    const answerRecord = {
      questionId: question.id,
      question: question.question,
      selectedAnswerIndex: selectedAnswer,
      userAnswer: userAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect: isCorrect,
    };

    setAnsweredQuestions([...answeredQuestions, answerRecord]);
    setShowResult(true);

    // Hiển thị thông báo ngay lập tức
    if (isCorrect) {
      toast.success('Chính xác!');
    } else {
      toast.error(`Chưa đúng! Đáp án đúng: ${question.correctAnswer}`);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Hoàn thành tất cả câu hỏi → submit tổng kết
      setIsCompleted(true);
      submitSessionResults();
    }
  };

  // 📤 Submit tổng kết phiên làm bài lên API
  const submitSessionResults = async () => {
    try {
      setSubmitting(true);

      // Lấy thông tin user từ localStorage với xử lý lỗi
      const userStr = localStorage.getItem('user');
      let user = null;
      let userId = null;

      if (userStr && userStr !== 'undefined' && userStr !== 'null') {
        try {
          user = JSON.parse(userStr);
          userId = user?.id;
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
        }
      }

      if (!userId) {
        console.warn('User not logged in, skipping API submission');
        return;
      }

      // Tính toán thống kê
      const correctCount = answeredQuestions.filter((aq) => aq.isCorrect).length;
      const totalQuestions = questions.length;

      console.log('📊 Session completed:', {
        userId,
        topicId,
        typeId,
        totalQuestions,
        correctCount,
        answeredQuestions,
      });

      // Gửi từng câu trả lời lên API
      for (const answer of answeredQuestions) {
        const answerData = {
          userId,
          userAnswer: answer.userAnswer,
          exerciseType: 'Trắc nghiệm (Multiple Choice)',
          typeId,
          topicId,
        };

        try {
          await submitExerciseAnswer(answer.questionId, answerData);
        } catch (err) {
          console.error(`Failed to submit answer for question ${answer.questionId}:`, err);
        }
      }

      toast.success('Đã lưu kết quả bài tập!');
    } catch (err) {
      console.error('Error submitting session results:', err);
      toast.error('Không thể lưu kết quả bài tập');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnsweredQuestions([]);
    setIsCompleted(false);
    setSubmitting(false);
  };

  // 📊 Tính toán kết quả phiên làm bài
  const calculateSessionStats = () => {
    const correctCount = answeredQuestions.filter((aq) => aq.isCorrect).length;
    const totalAnswered = answeredQuestions.length;
    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    return {
      correctCount,
      totalAnswered,
      totalQuestions,
      percentage,
    };
  };

  if (isCompleted) {
    const stats = calculateSessionStats();
    
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
                {stats.correctCount}/{stats.totalQuestions}
              </div>
              <div className="text-xs text-gray-500">Câu đúng</div>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{stats.percentage}%</div>
              <div className="text-xs text-gray-500">Chính xác</div>
            </div>
          </div>
          
          {/* Chi tiết các câu trả lời */}
          <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Chi tiết bài làm:</h4>
            <div className="space-y-2">
              {answeredQuestions.map((answer, index) => (
                <div
                  key={answer.questionId}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    answer.isCorrect ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    answer.isCorrect ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {answer.isCorrect ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <X className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900">
                      Câu {index + 1}: {answer.question}
                    </p>
                    {!answer.isCorrect && (
                      <p className="text-xs text-red-700 mt-1">
                        Bạn chọn: {answer.userAnswer} → Đúng: {answer.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-500"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
          <button
            onClick={handleReset}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow-md text-sm font-medium disabled:opacity-50"
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
              {answeredQuestions.filter(aq => aq.isCorrect).length}/{answeredQuestions.length} đúng
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-300"
              style={{ width: `${(answeredQuestions.length / questions.length) * 100}%` }}
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
            const isCorrect = showResult && currentAnswer && option === currentAnswer.correctAnswer;
            const showWrong = showResult && isSelected && !currentAnswer?.isCorrect;

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
        {showResult && currentAnswer && (
          <div className={`p-4 rounded-lg ${
            currentAnswer.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${currentAnswer.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
              {currentAnswer.isCorrect 
                ? '✅ Chính xác!' 
                : `❌ Chưa đúng! Đáp án đúng là: ${currentAnswer.correctAnswer}`
              }
            </p>
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
              disabled={selectedAnswer === null || currentAnswer}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md text-sm font-medium"
            >
              {currentAnswer ? (
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
