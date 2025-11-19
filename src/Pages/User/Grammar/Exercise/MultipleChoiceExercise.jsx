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
  const { topicId } = useParams();
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get('lesson_id');
  const navigate = useNavigate();
  
  const [exercises, setExercises] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [typeId, setTypeId] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Normalize helpers to ensure consistent types/format
  const normalizeAnswer = (a) => {
    if (a === undefined || a === null) return '';
    return String(a).trim();
  };

  const normalizeOption = (opt) => {
    if (typeof opt === 'string') return opt.trim();
    if (!opt) return '';
    // try common object shapes
    return (opt.label || opt.value || opt.text || String(opt)).toString().trim();
  };

  useEffect(() => {
    const loadExercises = async () => {
      if (!lessonId) {
        toast.error('Lesson ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch exercise types first to get the correct type_id
        const types = await getExerciseTypes(topicId, lessonId);
        console.log('Available exercise types:', types);
        
        // Find Multiple Choice type from API response
        const multipleChoiceType = types.find(t => 
          t.name.toLowerCase() === 'multiple choice' || 
          t.name.toLowerCase().includes('trắc nghiệm')
        );
        
        if (!multipleChoiceType) {
          console.error('Multiple Choice type not found for this lesson');
          toast.error('Không tìm thấy bài tập trắc nghiệm cho bài học này');
          setExercises([]);
          setLoading(false);
          return;
        }
        
        const multipleChoiceTypeId = multipleChoiceType.id;
        setTypeId(multipleChoiceTypeId);
        
        console.log('Loading exercises with params:', { topicId, lessonId, typeId: multipleChoiceTypeId });
        
        // Fetch questions
        const data = await getExerciseQuestions(topicId, lessonId, multipleChoiceTypeId);
        
        console.log('API Response data:', data);
        
        if (data.questions && data.questions.length > 0) {
          console.log('Found questions:', data.questions.length);
          // Map API response to component format
          const mappedExercises = data.questions.map(q => {
            // Parse options if it's a string
            let options = [];
            if (typeof q.options === 'string') {
              try {
                options = JSON.parse(q.options);
              } catch (e) {
                console.error('Error parsing options:', e);
                options = [];
              }
            } else if (Array.isArray(q.options)) {
              options = q.options;
            }
            
            // normalize options and correct_answer
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
          
          console.log('Mapped exercises:', mappedExercises);
          setExercises(mappedExercises);
          
          // Load user's previous answers if available
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          if (user.id) {
            try {
              const history = await getExerciseHistory(user.id, topicId, lessonId, multipleChoiceTypeId);
              if (history.answers && history.answers.length > 0) {
                const previousAnswers = {};
                const previousFeedback = {};
                
                history.answers.forEach(answer => {
                  previousAnswers[answer.question_id] = normalizeAnswer(answer.user_answer);
                  // Normalize is_correct to boolean (API may return 0/1/"1"/true)
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
              console.log('No previous history found');
            }
          }
          
          // Load accuracy data
          await loadAccuracyData(user.id, lessonId, multipleChoiceTypeId);
        } else {
          console.log('No questions found in response');
          setExercises([]);
        }
      } catch (error) {
        console.error('Error loading exercises:', error);
        console.error('Error details:', error.response?.data || error.message);
        toast.error('Không thể tải bài tập');
        setExercises([]);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, [topicId, lessonId]);

  const loadAccuracyData = async (userId, lessonId, typeId) => {
    try {
      const accuracyData = await getExerciseAccuracy(userId, lessonId, typeId);
      setAccuracy(accuracyData);
    } catch (error) {
      console.log('Could not load accuracy data');
    }
  };

  const handleResetExercise = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        toast.error('Vui lòng đăng nhập để reset bài tập');
        return;
      }

      await resetExerciseAnswers(user.id, lessonId, typeId);
      
      // Reset local state
      setUserAnswers({});
      setShowFeedback({});
      setCurrentQuestionIndex(0);
      setIsCompleted(false);
      setShowResetConfirm(false);
      
      // Reload accuracy data
      await loadAccuracyData(user.id, lessonId, typeId);
      
      toast.success('Đã reset bài tập thành công!');
    } catch (error) {
      console.error('Error resetting exercise:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi reset bài tập');
    }
  };

  const currentQuestion = exercises[currentQuestionIndex];

  const handleAnswerSelect = (answer) => {
    if (showFeedback[currentQuestion.id]) return;
    
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: normalizeAnswer(answer),
    });
  };

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

      // Submit answer to API
      const result = await submitExerciseAnswer(
        user.id,
        currentQuestion.id,
        typeId,
        userAnswer
      );

      // Normalize is_correct from API into boolean
      const isCorrect = !!(result.is_correct === true || result.is_correct === 1 || result.is_correct === '1' || String(result.is_correct) === 'true');
      
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
      
      // Reload accuracy data after submitting
      if (user.id) {
        await loadAccuracyData(user.id, lessonId, typeId);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Có lỗi xảy ra khi kiểm tra câu trả lời');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < exercises.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setShowFeedback({});
    setCurrentQuestionIndex(0);
    setIsCompleted(false);
  };

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

  const progress = ((currentQuestionIndex + 1) / exercises.length) * 100;
  const answeredCount = Object.keys(showFeedback).length;

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

  if (isCompleted) {
    const score = calculateScore();
    return (
      <CompletionScreen
        score={score}
        onReset={handleReset}
        onBack={() => navigate(`/grammar/${topicId}`)}
      />
    );
  }

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
        {/* Accuracy Stats Card */}
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

        {/* Reset Confirmation Modal */}
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
          {/* Question Type Badge */}
          <div className="flex items-center justify-between mb-6">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              Trắc nghiệm
            </span>
            <span className="flex items-center gap-1 text-sm font-medium text-yellow-600">
              <Zap className="w-4 h-4 fill-yellow-500" />
              +{currentQuestion.xp_reward} XP
            </span>
          </div>

          {/* Question */}
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

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-5 h-5 inline mr-2 rotate-180" />
              Câu trước
            </button>

            {!showFeedback[currentQuestion.id] ? (
              <button
                onClick={handleCheckAnswer}
                disabled={!userAnswers[currentQuestion.id]}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Kiểm tra
              </button>
            ) : (
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
