import React, { useState, useEffect } from 'react';
import { Check, X, ChevronRight, RotateCw, Trophy, Lightbulb, Loader2, Eye, EyeOff, TrendingUp, Award, RotateCcw } from 'lucide-react';
import { submitExerciseAnswer, getExerciseHistory, getExerciseAccuracy, resetExerciseAnswers } from '../../../../service/vocabularyService';
import { toast } from 'react-toastify';
import CompletionScreen from './CompletionScreen';
import WordScrambleLetters from './WordScrambleLetters';
import QuestionNavigator from './QuestionNavigator';

const WordArrangementExercise = ({ questions, topicId, typeId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [availableLetters, setAvailableLetters] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState({}); // { questionId: { userAnswer, correctAnswer, isCorrect } }
  const [submitting, setSubmitting] = useState(false);
  const [accuracy, setAccuracy] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  const question = questions[currentQuestion];
  const currentAnswer = answeredQuestions[question.id];

  // Load exercise history and accuracy on mount
  useEffect(() => {
    const loadExerciseData = async () => {
      try {
        setLoading(true);
        const userStr = localStorage.getItem('user');
        let userId = null;

        if (userStr && userStr !== 'undefined' && userStr !== 'null') {
          try {
            const user = JSON.parse(userStr);
            userId = user?.id;
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
          }
        }

        if (!userId) {
          setLoading(false);
          return;
        }

        // Load history from API
        try {
          const historyResponse = await getExerciseHistory(userId, topicId, typeId);
          // API trả về result hoặc data
          const history = historyResponse.result || historyResponse.data;
          if ((historyResponse.code === 200 || historyResponse.code === 1000) && history) {
            if (history.answers && history.answers.length > 0) {
              const answersMap = {};
              history.answers.forEach(answer => {
                answersMap[answer.question_id] = {
                  userAnswer: answer.user_answer,
                  correctAnswer: answer.correct_answer,
                  isCorrect: answer.is_correct,
                };
              });
              setAnsweredQuestions(answersMap);
              
              // Tìm câu hỏi đầu tiên chưa trả lời hoặc câu cuối cùng đã làm
              const firstUnansweredIndex = questions.findIndex(q => !answersMap[q.id]);
              if (firstUnansweredIndex !== -1) {
                // Có câu chưa trả lời -> nhảy đến câu đó
                setCurrentQuestion(firstUnansweredIndex);
              } else if (history.answers.length > 0) {
                // Tất cả đã trả lời -> nhảy đến câu cuối cùng
                const lastAnsweredId = history.answers[history.answers.length - 1].question_id;
                const lastIndex = questions.findIndex(q => q.id === lastAnsweredId);
                if (lastIndex !== -1) {
                  setCurrentQuestion(lastIndex);
                }
              }
            }
          }
        } catch (historyError) {
          console.log('No previous history found');
        }

        // Load accuracy from API
        try {
          const accuracyResponse = await getExerciseAccuracy(userId, topicId, typeId);
          if ((accuracyResponse.code === 200 || accuracyResponse.code === 1000) && accuracyResponse.result) {
            setAccuracy(accuracyResponse.result);
          }
        } catch (accuracyError) {
          console.log('No accuracy data found');
        }
      } catch (error) {
        console.error('Error loading exercise data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExerciseData();
  }, [topicId, typeId, questions]);

  useEffect(() => {
    // Shuffle letters when question changes
    const shuffled = [...question.scrambledLetters].sort(() => Math.random() - 0.5);
    setAvailableLetters(shuffled);
    setSelectedLetters([]);
    setShowHint(false);

    // Nếu câu hỏi đã được trả lời, hiển thị kết quả
    if (currentAnswer) {
      const answeredLetters = currentAnswer.userAnswer.split('').map((letter, idx) => ({
        letter,
        originalIndex: idx
      }));
      setSelectedLetters(answeredLetters);
      setAvailableLetters([]);
    }
  }, [currentQuestion, question.scrambledLetters, question.id, currentAnswer]);

  const handleSelectLetter = (letter, index) => {
    if (currentAnswer) return; // Không cho chọn nếu đã trả lời
    setSelectedLetters([...selectedLetters, { letter, originalIndex: index }]);
    setAvailableLetters(availableLetters.filter((_, i) => i !== index));
  };

  const handleRemoveLetter = (index) => {
    if (currentAnswer) return; // Không cho xóa nếu đã trả lời
    const removedLetter = selectedLetters[index];
    setSelectedLetters(selectedLetters.filter((_, i) => i !== index));
    setAvailableLetters([...availableLetters, removedLetter.letter]);
  };

  const handleClear = () => {
    if (currentAnswer) return; // Không cho clear nếu đã trả lời
    setAvailableLetters([...question.scrambledLetters].sort(() => Math.random() - 0.5));
    setSelectedLetters([]);
  };

  // Submit answer to API
  const handleSubmit = async () => {
    if (selectedLetters.length === 0) return;
    if (currentAnswer) return; // Đã trả lời rồi

    try {
      setSubmitting(true);
      
      const userStr = localStorage.getItem('user');
      let userId = null;

      if (userStr && userStr !== 'undefined' && userStr !== 'null') {
        try {
          const user = JSON.parse(userStr);
          userId = user?.id;
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
        }
      }

      if (!userId) {
        toast.error('Vui lòng đăng nhập để làm bài tập');
        return;
      }

      // Build user answer from selected letters
      const userAnswer = selectedLetters.map((item) => item.letter).join('');

      // Submit answer to API
      const answerData = {
        userId,
        userAnswer: userAnswer,
        exerciseType: 'Sắp xếp từ (Word Scramble)',
        typeId,
        topicId,
      };

      const response = await submitExerciseAnswer(question.id, answerData);
      
      const result = response.result || response.data || response;
      const isCorrect = result.is_correct || result.isCorrect;
      const correctAnswer = result.correct_answer || result.correctAnswer || question.correctWord;

      // Lưu câu trả lời vào state
      setAnsweredQuestions(prev => ({
        ...prev,
        [question.id]: {
          userAnswer: userAnswer,
          correctAnswer: correctAnswer,
          isCorrect: isCorrect,
        }
      }));

      // Hiển thị thông báo
      if (isCorrect) {
        toast.success(`Chính xác! +${result.xp_earned || 5} XP`);
      } else {
        toast.error(`Chưa đúng! Đáp án đúng: ${correctAnswer}`);
      }

      // Reload accuracy
      try {
        const accuracyResponse = await getExerciseAccuracy(userId, topicId, typeId);
        if ((accuracyResponse.code === 200 || accuracyResponse.code === 1000) && accuracyResponse.result) {
          setAccuracy(accuracyResponse.result);
        }
      } catch (error) {
        console.log('Could not update accuracy');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Có lỗi xảy ra khi kiểm tra câu trả lời');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
    // Không chuyển sang màn hình completion nữa
  };

  // Handle reset exercise (delete all answers via API)
  const handleResetExercise = async () => {
    try {
      const userStr = localStorage.getItem('user');
      let userId = null;

      if (userStr && userStr !== 'undefined' && userStr !== 'null') {
        try {
          const user = JSON.parse(userStr);
          userId = user?.id;
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
        }
      }

      if (!userId) {
        toast.error('Vui lòng đăng nhập để reset bài tập');
        return;
      }

      await resetExerciseAnswers(userId, topicId, typeId);
      
      // Reset state
      setCurrentQuestion(0);
      setSelectedLetters([]);
      setAnsweredQuestions({});
      setShowResetConfirm(false);
      
      // Reload accuracy
      try {
        const accuracyResponse = await getExerciseAccuracy(userId, topicId, typeId);
        if ((accuracyResponse.code === 200 || accuracyResponse.code === 1000) && accuracyResponse.result) {
          setAccuracy(accuracyResponse.result);
        }
      } catch (error) {
        setAccuracy(null);
      }
      
      toast.success('Đã reset bài tập thành công!');
    } catch (error) {
      console.error('Error resetting exercise:', error);
      toast.error('Có lỗi xảy ra khi reset bài tập');
    }
  };

  // Check if all questions are answered
  const isCompleted = Object.keys(answeredQuestions).length === questions.length && questions.length > 0;

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
          <p className="text-gray-600 text-sm">Đang tải bài tập...</p>
        </div>
      </div>
    );
  }

  // Guard: no questions
  if (!questions || questions.length === 0) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-700">Chưa có câu hỏi cho dạng bài tập này.</p>
      </div>
    );
  }

  // Completion screen - use accuracy data from API (and not reviewing)
  if (isCompleted && accuracy && !isReviewing) {
    const score = {
      correctCount: accuracy.correct_answers || 0,
      total: accuracy.total_questions_available || questions.length,
      percentage: Math.round(accuracy.accuracy_rate || 0),
      totalXP: accuracy.total_xp_earned || 0,
    };
    
    return (
      <CompletionScreen
        score={score}
        onReset={handleResetExercise}
        onReview={() => {
          setIsReviewing(true);
          setCurrentQuestion(0);
        }}
        onBack={() => window.history.back()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Accuracy Stats Card - Luôn hiển thị */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Thống kê bài tập
          </h3>
          {accuracy && (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Làm lại từ đầu
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold">{accuracy ? accuracy.accuracy_rate.toFixed(1) : 0}%</div>
            <div className="text-sm opacity-90">Độ chính xác</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold">{accuracy ? `${accuracy.correct_answers}/${accuracy.total_attempts}` : '0/0'}</div>
            <div className="text-sm opacity-90">Câu đúng</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold">{accuracy ? accuracy.completion_rate.toFixed(0) : 0}%</div>
            <div className="text-sm opacity-90">Hoàn thành</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold flex items-center gap-1">
              <Award className="w-5 h-5" />
              {accuracy ? accuracy.accuracy_grade : '-'}
            </div>
            <div className="text-sm opacity-90">Xếp loại</div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận làm lại</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc muốn xóa toàn bộ kết quả và làm lại từ đầu? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleResetExercise}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Progress */}
      <div className="bg-white rounded-lg border-2 border-gray-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Câu {currentQuestion + 1} / {questions.length}
          </span>
          <span className="text-sm text-gray-500">
            {Object.keys(answeredQuestions).filter(id => answeredQuestions[id].isCorrect).length}/{Object.keys(answeredQuestions).length} đúng
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-300"
            style={{ width: `${(Object.keys(answeredQuestions).length / questions.length) * 100}%` }}
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

        {/* Letter Selection Area */}
        <WordScrambleLetters
          selectedLetters={selectedLetters}
          availableLetters={availableLetters}
          currentAnswer={currentAnswer}
          onSelectLetter={handleSelectLetter}
          onRemoveLetter={handleRemoveLetter}
          disabled={!!currentAnswer}
        />

        {/* Result Message */}
        {currentAnswer && (
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
            {!currentAnswer && (
              <button
                onClick={handleClear}
                disabled={selectedLetters.length === 0}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Xóa hết
              </button>
            )}
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
            {/* Show Summary Button when reviewing and completed */}
            {isReviewing && isCompleted && (
              <button
                onClick={() => setIsReviewing(false)}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
              >
                <Trophy className="w-5 h-5" />
                Xem tổng kết
              </button>
            )}
            
            {!currentAnswer ? (
              <button
                onClick={handleSubmit}
                disabled={selectedLetters.length === 0 || submitting}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                <Check className="w-5 h-5" />
                Kiểm tra
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentQuestion >= questions.length - 1}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                Câu tiếp theo
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            
          </div>
          
        </div>
        {/* Question Navigator */}
      <QuestionNavigator
        questions={questions}
        currentIndex={currentQuestion}
        answeredQuestions={answeredQuestions}
        onNavigate={(index) => setCurrentQuestion(index)}
      />
      </div>
    </div>
  );
};

export default WordArrangementExercise;
