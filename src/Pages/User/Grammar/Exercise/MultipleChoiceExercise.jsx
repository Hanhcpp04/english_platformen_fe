import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, Loader2, ArrowRight, Zap, RotateCcw, TrendingUp, Award } from 'lucide-react';
import { toast } from 'react-toastify';
import MultipleChoiceQuestion from './components/MultipleChoiceExercise';
import ExerciseFeedback from './components/ExerciseFeedback';
import QuestionNavigator from './components/QuestionNavigator';
import CompletionScreen from './components/CompletionScreen';
import ExerciseHeader from './components/ExerciseHeader';
import { getExerciseQuestions, submitExerciseAnswer, getExerciseHistory, getExerciseTypes, resetExerciseAnswers, getExerciseAccuracy } from '../../../../service/grammarService';

const MultipleChoiceExercisePage = () => {
  // Lấy các tham số từ URL
  const { topicId } = useParams();
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get('lesson_id');
  const navigate = useNavigate();
  
  // State quản lý dữ liệu và trạng thái
  const [exercises, setExercises] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [typeId, setTypeId] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  // Hàm chuẩn hóa đáp án
  const normalizeAnswer = (a) => {
    if (a === undefined || a === null) return '';
    return String(a).trim();
  };

  // Hàm chuẩn hóa lựa chọn
  const normalizeOption = (opt) => {
    if (typeof opt === 'string') return opt.trim();
    if (!opt) return '';
    // thử các thuộc tính phổ biến
    return (opt.label || opt.value || opt.text || String(opt)).toString().trim();
  };

  // Tải dữ liệu bài tập khi component mount hoặc khi topicId/lessonId thay đổi
  useEffect(() => {
    // Hàm tải bài tập từ API
    const loadExercises = async () => {
      if (!lessonId) {
        toast.error('Lesson ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Lấy danh sách loại bài tập để lấy type_id phù hợp
        const types = await getExerciseTypes(topicId, lessonId);
        
        // Tìm loại bài tập trắc nghiệm
        const multipleChoiceType = types.find(t => 
          t.name.toLowerCase() === 'multiple choice' || 
          t.name.toLowerCase().includes('trắc nghiệm')
        );
        
        if (!multipleChoiceType) {
          // Không tìm thấy loại bài tập trắc nghiệm
          toast.error('Không tìm thấy bài tập trắc nghiệm cho bài học này');
          setExercises([]);
          setLoading(false);
          return;
        }
        
        const multipleChoiceTypeId = multipleChoiceType.id;
        setTypeId(multipleChoiceTypeId);
        
        // Lấy danh sách câu hỏi trắc nghiệm
        const data = await getExerciseQuestions(topicId, lessonId, multipleChoiceTypeId);
        
        if (data.questions && data.questions.length > 0) {
          // Chuyển đổi dữ liệu câu hỏi về định dạng component sử dụng
          const mappedExercises = data.questions.map(q => {
            // Xử lý options nếu là chuỗi
            let options = [];
            if (typeof q.options === 'string') {
              try {
                options = JSON.parse(q.options);
              } catch (e) {
                options = [];
              }
            } else if (Array.isArray(q.options)) {
              options = q.options;
            }
            
            // Chuẩn hóa options và đáp án đúng
            const normalizedOptions = options.map(normalizeOption);
            const normalizedCorrect = normalizeAnswer(q.correct_answer);
            
            return {
              id: q.id,
              lesson_id: lessonId,
              type: 'Multiple Choice',
              question: q.question,
              options: normalizedOptions,
              correct_answer: normalizedCorrect,
              explanation: q.explanation || 'Không có giải thích',
              xp_reward: q.xp_reward || 5,
            };
          });
          
          setExercises(mappedExercises);
          
          // Nếu người dùng đã làm bài, lấy lịch sử đáp án
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          if (user.id) {
            try {
              const history = await getExerciseHistory(user.id, topicId, lessonId, multipleChoiceTypeId);
              if (history.answers && history.answers.length > 0) {
                const previousAnswers = {};
                const previousFeedback = {};
                
                history.answers.forEach(answer => {
                  previousAnswers[answer.question_id] = normalizeAnswer(answer.user_answer);
                  // Chuẩn hóa kết quả đúng/sai
                  const isCorrect = !!(answer.is_correct === true || answer.is_correct === 1 || answer.is_correct === '1' || String(answer.is_correct) === 'true');
                  previousFeedback[answer.question_id] = {
                    isCorrect,
                    show: true,
                  };
                });
                
                setUserAnswers(previousAnswers);
                setShowFeedback(previousFeedback);
              }
            } catch (historyError) {
              // Không có lịch sử
            }
          }
          
          // Lấy thống kê độ chính xác
          await loadAccuracyData(user.id, lessonId, multipleChoiceTypeId);
        } else {
          setExercises([]);
        }
      } catch (error) {
        // Xử lý lỗi khi tải bài tập
        toast.error('Không thể tải bài tập');
        setExercises([]);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, [topicId, lessonId]);

  // Hàm lấy thống kê độ chính xác
  const loadAccuracyData = async (userId, lessonId, typeId) => {
    try {
      const accuracyData = await getExerciseAccuracy(userId, lessonId, typeId);
      setAccuracy(accuracyData);
    } catch (error) {
      // Không lấy được thống kê
    }
  };

  // Hàm xử lý reset bài tập
  const handleResetExercise = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        toast.error('Vui lòng đăng nhập để reset bài tập');
        return;
      }

      await resetExerciseAnswers(user.id, lessonId, typeId);
      
      // Reset lại state
      setUserAnswers({});
      setShowFeedback({});
      setCurrentQuestionIndex(0);
      setIsCompleted(false);
      setShowResetConfirm(false);
      
      // Tải lại thống kê
      await loadAccuracyData(user.id, lessonId, typeId);
      
      toast.success('Đã reset bài tập thành công!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi reset bài tập');
    }
  };

  // Lấy câu hỏi hiện tại
  const currentQuestion = exercises[currentQuestionIndex];

  // Xử lý khi chọn đáp án
  const handleAnswerSelect = async (answer) => {
    if (showFeedback[currentQuestion.id]) return;
    
    const normalizedAnswer = normalizeAnswer(answer);
    
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: normalizedAnswer,
    });

    // Gửi đáp án lên API ngay khi chọn
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        toast.error('Vui lòng đăng nhập để làm bài tập');
        return;
      }

      // Gửi đáp án lên server
      const result = await submitExerciseAnswer(
        user.id,
        currentQuestion.id,
        typeId,
        normalizedAnswer
      );

      // Chuẩn hóa kết quả đúng/sai
      const isCorrect = !!(result.is_correct === true || result.is_correct === 1 || result.is_correct === '1' || String(result.is_correct) === 'true');
      
      // Cập nhật đáp án đúng nếu có từ server
      if (result.correct_answer) {
        setExercises(prevExercises => 
          prevExercises.map(ex => 
            ex.id === currentQuestion.id 
              ? { ...ex, correct_answer: normalizeAnswer(result.correct_answer) }
              : ex
          )
        );
      }
      
      setShowFeedback({
        ...showFeedback,
        [currentQuestion.id]: {
          isCorrect,
          show: true,
        },
      });

      if (isCorrect) {
        toast.success(`${result.message || 'Chính xác!'} +${result.xp_earned || currentQuestion.xp_reward} XP`);
      } else {
        toast.error(result.message || 'Chưa đúng, hãy xem giải thích bên dưới');
      }
      
      // Tải lại thống kê sau khi trả lời
      if (user.id) {
        await loadAccuracyData(user.id, lessonId, typeId);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi kiểm tra câu trả lời');
    }
  };

  // Xử lý khi nhấn nút kiểm tra đáp án (nếu có)
  const handleCheckAnswer = async () => {
    const userAnswer = normalizeAnswer(userAnswers[currentQuestion.id]);
    if (!userAnswer) {
      toast.warning('Vui lòng chọn câu trả lời');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        toast.error('Vui lòng đăng nhập để làm bài tập');
        return;
      }

      // Gửi đáp án lên server
      const result = await submitExerciseAnswer(
        user.id,
        currentQuestion.id,
        typeId,
        userAnswer
      );

      // Chuẩn hóa kết quả đúng/sai
      const isCorrect = !!(result.is_correct === true || result.is_correct === 1 || result.is_correct === '1' || String(result.is_correct) === 'true');
      
      // Cập nhật đáp án đúng nếu có từ server
      if (result.correct_answer) {
        setExercises(prevExercises => 
          prevExercises.map(ex => 
            ex.id === currentQuestion.id 
              ? { ...ex, correct_answer: normalizeAnswer(result.correct_answer) }
              : ex
          )
        );
      }
      
      setShowFeedback({
        ...showFeedback,
        [currentQuestion.id]: {
          isCorrect,
          show: true,
        },
      });

      if (isCorrect) {
        toast.success(`${result.message || 'Chính xác!'} +${result.xp_earned || currentQuestion.xp_reward} XP`);
      } else {
        toast.error(result.message || 'Chưa đúng, hãy xem giải thích bên dưới');
      }
      
      // Tải lại thống kê sau khi trả lời
      if (user.id) {
        await loadAccuracyData(user.id, lessonId, typeId);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi kiểm tra câu trả lời');
    }
  };

  // Chuyển sang câu hỏi tiếp theo
  const handleNextQuestion = () => {
    if (currentQuestionIndex < exercises.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  // Quay lại câu hỏi trước
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Reset lại trạng thái làm bài (chỉ local, không gọi API)
  const handleReset = () => {
    setUserAnswers({});
    setShowFeedback({});
    setCurrentQuestionIndex(0);
    setIsCompleted(false);
  };

  // Tính điểm số và tổng kết
  const calculateScore = () => {
    const correctCount = Object.keys(showFeedback).filter(
      (key) => showFeedback[key].isCorrect
    ).length;
    const totalXP = exercises.reduce((sum, ex) => {
      if (showFeedback[ex.id]?.isCorrect) {
        return sum + ex.xp_reward;
      }
      return sum;
    }, 0);

    return {
      correctCount,
      total: exercises.length,
      percentage: Math.round((correctCount / exercises.length) * 100),
      totalXP,
    };
  };

  // Tính tiến độ làm bài
  const progress = ((currentQuestionIndex + 1) / exercises.length) * 100;
  const answeredCount = Object.keys(showFeedback).length;

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải bài tập...</p>
        </div>
      </div>
    );
  }

  // Hiển thị khi không có bài tập
  if (exercises.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có bài tập</h3>
          <p className="text-gray-600 mb-6">Chủ đề này chưa có bài tập trắc nghiệm.</p>
          <button
            onClick={() => navigate(`/grammar/${topicId}`)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // Hiển thị màn hình hoàn thành (không review)
  if (isCompleted && !isReviewing) {
    const score = calculateScore();
    return (
      <CompletionScreen
        score={score}
        onReset={handleReset}
        onReview={() => {
          setIsReviewing(true);
          setIsCompleted(false);
          setCurrentQuestionIndex(0);
        }}
        onBack={() => navigate(`/grammar/${topicId}`)}
      />
    );
  }

  // Giao diện chính của trang làm bài tập
  return (
    <div className="min-h-screen bg-gray-50">
      <ExerciseHeader
        topicId={topicId}
        currentIndex={currentQuestionIndex}
        totalQuestions={exercises.length}
        answeredCount={answeredCount}
        progress={progress}
      />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Thẻ thống kê độ chính xác */}
        {accuracy && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 mb-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Thống kê bài tập
              </h3>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Làm lại từ đầu
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold">{accuracy.accuracyRate.toFixed(1)}%</div>
                <div className="text-sm opacity-90">Độ chính xác</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold">{accuracy.correctAnswers}/{accuracy.totalAnswers}</div>
                <div className="text-sm opacity-90">Câu đúng</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold">{accuracy.completionRate.toFixed(0)}%</div>
                <div className="text-sm opacity-90">Hoàn thành</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold flex items-center gap-1">
                  <Award className="w-5 h-5" />
                  {accuracy.accuracyGrade}
                </div>
                <div className="text-sm opacity-90">Xếp loại</div>
              </div>
            </div>
          </div>
        )}

        {/* Modal xác nhận reset bài tập */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Xác nhận reset bài tập</h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa toàn bộ câu trả lời và làm lại từ đầu không? 
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleResetExercise}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Badge loại câu hỏi */}
          <div className="flex items-center justify-between mb-6">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              Trắc nghiệm
            </span>
            <span className="flex items-center gap-1 text-sm font-medium text-yellow-600">
              <Zap className="w-4 h-4 fill-yellow-500" />
              +{currentQuestion.xp_reward} XP
            </span>
          </div>

          {/* Hiển thị câu hỏi */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {currentQuestion.question}
            </h2>

            <MultipleChoiceQuestion
              question={currentQuestion.question}
              options={currentQuestion.options}
              correctAnswer={currentQuestion.correct_answer}
              userAnswer={userAnswers[currentQuestion.id]}
              feedback={showFeedback[currentQuestion.id]}
              onSelect={handleAnswerSelect}
              disabled={!!showFeedback[currentQuestion.id]}
            />
          </div>

          <ExerciseFeedback
            feedback={showFeedback[currentQuestion.id]}
            explanation={currentQuestion.explanation}
            correctAnswer={currentQuestion.correct_answer}
          />

          {/* Các nút điều hướng câu hỏi */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-5 h-5 inline mr-2 rotate-180" />
              Câu trước
            </button>

            {/* Show Summary Button when reviewing */}
            {isReviewing && Object.keys(showFeedback).length === exercises.length && (
              <button
                onClick={() => {
                  setIsReviewing(false);
                  setIsCompleted(true);
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
              >
                <Award className="w-5 h-5" />
                Xem tổng kết
              </button>
            )}

            {showFeedback[currentQuestion.id] && (
              <button
                onClick={handleNextQuestion}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                {currentQuestionIndex === exercises.length - 1 ? 'Hoàn thành' : 'Câu tiếp theo'}
                <ArrowRight className="w-5 h-5 inline ml-2" />
              </button>
            )}
          </div>
        </div>

        {/* Thanh điều hướng nhanh các câu hỏi */}
        <QuestionNavigator
          exercises={exercises}
          currentIndex={currentQuestionIndex}
          showFeedback={showFeedback}
          onNavigate={setCurrentQuestionIndex}
        />
      </div>
    </div>
  );
};

export default MultipleChoiceExercisePage;
