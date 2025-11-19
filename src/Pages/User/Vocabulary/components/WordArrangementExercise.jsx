import React, { useState, useEffect } from 'react';
import { Check, X, ChevronRight, RotateCw, Trophy, Lightbulb, Loader2, Eye, EyeOff } from 'lucide-react';
import { submitExerciseAnswer } from '../../../../service/vocabularyService';
import { toast } from 'react-toastify';

const WordArrangementExercise = ({ questions, topicId, typeId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [availableLetters, setAvailableLetters] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]); // Lưu tất cả câu trả lời trong phiên

  // New: control hint visibility
  const [showHint, setShowHint] = useState(false);

  const question = questions[currentQuestion];
  
  // Kiểm tra câu hỏi hiện tại đã được trả lời trong phiên chưa
  const currentAnswer = answeredQuestions.find((aq) => aq.questionId === question.id);

  useEffect(() => {
    // Shuffle letters when question changes
    const shuffled = [...question.scrambledLetters].sort(() => Math.random() - 0.5);
    setAvailableLetters(shuffled);
    setSelectedLetters([]);
    setShowHint(false);

    // Kiểm tra nếu câu hỏi đã được trả lời trong phiên này
    const answered = answeredQuestions.find((aq) => aq.questionId === question.id);
    if (answered) {
      setShowResult(true);
      // Hiển thị từ đã trả lời
      const answeredLetters = answered.userAnswer.split('').map((letter, idx) => ({
        letter,
        originalIndex: idx
      }));
      setSelectedLetters(answeredLetters);
      setAvailableLetters([]);
    } else {
      setShowResult(false);
    }
  }, [currentQuestion, question.scrambledLetters, question.id, answeredQuestions]);

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

  // 💚 Kiểm tra câu trả lời (KHÔNG submit API ngay)
  const handleSubmit = () => {
    if (selectedLetters.length === 0) return;

    // Ngăn submit nếu câu hỏi đã được trả lời trong phiên
    if (currentAnswer) {
      toast.warning('Bạn đã trả lời câu hỏi này rồi! Hãy chuyển sang câu tiếp theo.');
      return;
    }

    // Build user answer from selected letters
    const userAnswer = selectedLetters.map((item) => item.letter).join('');
    const isCorrect = userAnswer.toLowerCase() === question.correctWord.toLowerCase();

    // Lưu câu trả lời vào phiên làm bài
    const answerRecord = {
      questionId: question.id,
      question: question.question,
      userAnswer: userAnswer,
      correctAnswer: question.correctWord,
      isCorrect: isCorrect,
    };

    setAnsweredQuestions([...answeredQuestions, answerRecord]);
    setShowResult(true);

    // Hiển thị thông báo ngay lập tức
    if (isCorrect) {
      toast.success('Chính xác!');
    } else {
      toast.error(`Chưa đúng! Đáp án đúng: ${question.correctWord}`);
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
          exerciseType: 'Sắp xếp từ (Word Scramble)',
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
    setSelectedLetters([]);
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
                {stats.correctCount}/{stats.totalQuestions}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Độ chính xác:</span>
              <span className="text-2xl font-bold text-purple-600">{stats.percentage}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-4">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500"
                style={{ width: `${stats.percentage}%` }}
              />
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

          <button
            onClick={handleReset}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all mx-auto shadow-md hover:shadow-lg disabled:opacity-50"
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
            {answeredQuestions.filter(aq => aq.isCorrect).length}/{answeredQuestions.length} đúng
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-300"
            style={{ width: `${(answeredQuestions.length / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg border-2 border-gray-100 p-8 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {question.question}
          </h3>
          {question.questionVi && (
            <p className="text-gray-600 mb-4">{question.questionVi}</p>
          )}
          {question.hint && (
            <div className="w-full bg-purple-50 rounded-lg p-2 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <div className="text-sm text-purple-700 font-medium">Gợi ý:</div>
                  <div className="mt-1 text-sm text-purple-700">
                    {showHint ? (
                      <span>{question.hint}</span>
                    ) : (
                      <span className="italic text-gray-500">Gợi ý bị ẩn. Nhấn biểu tượng mắt để xem.</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowHint((s) => !s)}
                aria-label={showHint ? 'Ẩn gợi ý' : 'Hiện gợi ý'}
                className="ml-4 p-2 rounded-md hover:bg-purple-100 transition-colors"
              >
                {showHint ? (
                  <EyeOff className="w-5 h-5 text-purple-600" />
                ) : (
                  <Eye className="w-5 h-5 text-purple-600" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Answer Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Từ của bạn:
          </label>
          <div
            className={`min-h-[80px] p-4 rounded-lg border-2 transition-all ${
              showResult
                ? currentAnswer?.isCorrect
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
        {showResult && currentAnswer && (
          <div
            className={`p-4 rounded-lg flex items-start gap-3 ${
              currentAnswer.isCorrect
                ? 'bg-green-50 border-2 border-green-200'
                : 'bg-red-50 border-2 border-red-200'
            }`}
          >
            {currentAnswer.isCorrect ? (
              <>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-green-800">Chính xác!</p>
                  <p className="text-sm text-green-700">
                    Từ đúng là: <strong>{currentAnswer.correctAnswer}</strong>
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <X className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-red-800">Chưa đúng!</p>
                  <p className="text-sm text-red-700">
                    Từ đúng là: <strong>{currentAnswer.correctAnswer}</strong>
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-4">
          {/* Left side: Clear and Previous buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClear}
              disabled={showResult || selectedLetters.length === 0}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Xóa hết
            </button>
            <button
              onClick={() => {
                if (currentQuestion > 0) {
                  setCurrentQuestion(currentQuestion - 1);
                }
              }}
              disabled={currentQuestion === 0}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
              Câu trước
            </button>
          </div>

          {/* Right side: Submit or Next button */}
          <div className="flex gap-3">
            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={selectedLetters.length === 0 || currentAnswer}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {currentAnswer ? (
                  <>
                    <Check className="w-5 h-5" />
                    Đã trả lời
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Kiểm tra
                  </>
                )}
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