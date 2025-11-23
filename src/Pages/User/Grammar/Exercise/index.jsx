import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, Loader2, ArrowRight, Zap } from 'lucide-react';
import { toast } from 'react-toastify';
import MultipleChoiceExercise from './components/MultipleChoiceExercise';
import FillBlankExercise from './components/FillBlankExercise';
import ExerciseFeedback from './components/ExerciseFeedback';
import QuestionNavigator from './components/QuestionNavigator';
import CompletionScreen from './components/CompletionScreen';
import ExerciseHeader from './components/ExerciseHeader';
import { getExerciseQuestions, submitExerciseAnswer } from '../../../../service/grammarService';

const ExercisePage = () => {
  const { topicId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get parameters from URL
  const lessonId = searchParams.get('lesson_id');
  const typeId = searchParams.get('type_id');
  const typeName = searchParams.get('type_name') || 'Exercise';
  
  const [exercises, setExercises] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id;

  // Load exercises from API
  useEffect(() => {
    const loadExercises = async () => {
      if (!topicId || !lessonId || !typeId) {
        setError('Thiếu thông tin bài tập. Vui lòng thử lại.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await getExerciseQuestions(topicId, lessonId, typeId);
        
        if ((response.code === 1000 || response.code === 200) && response.result) {
          const { questions } = response.result;
          
          // Transform API data to match component format
          const transformedExercises = questions.map(q => {
            const baseExercise = {
              id: q.id,
              question: q.question,
              xp_reward: q.xp_reward || 5,
              type_id: q.type_id,
            };

            // Parse options if it's a Multiple Choice question
            if (q.options) {
              try {
                const options = typeof q.options === 'string' 
                  ? JSON.parse(q.options) 
                  : q.options;
                return {
                  ...baseExercise,
                  type: 'Multiple Choice',
                  options: options,
                };
              } catch (e) {
                console.error('Error parsing options:', e);
                return baseExercise;
              }
            }

            // Fill in the Blank question
            return {
              ...baseExercise,
              type: 'Fill in the Blank',
            };
          });
          
          setExercises(transformedExercises);
        } else {
          setError('Không thể tải bài tập. Vui lòng thử lại.');
        }
      } catch (error) {
        console.error('Error loading exercises:', error);
        setError('Đã xảy ra lỗi khi tải bài tập.');
        toast.error('Không thể tải bài tập');
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, [topicId, lessonId, typeId]);

  const currentQuestion = exercises[currentQuestionIndex];

  const handleAnswerSelect = (answer) => {
    if (showFeedback[currentQuestion.id]) return; // Already answered
    
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: answer,
    });
  };

  const handleCheckAnswer = async () => {
    const userAnswer = userAnswers[currentQuestion.id];
    if (!userAnswer || userAnswer.trim() === '') {
      toast.warning('Vui lòng chọn hoặc nhập câu trả lời');
      return;
    }

    if (!userId) {
      toast.error('Vui lòng đăng nhập để làm bài tập');
      return;
    }

    try {
      // Submit answer to backend
      const response = await submitExerciseAnswer(
        userId, 
        currentQuestion.id, 
        userAnswer, 
        currentQuestion.type_id
      );

      if ((response.code === 1000 || response.code === 200) && response.result) {
        const { is_correct, correct_answer, explanation } = response.result;
        
        setShowFeedback({
          ...showFeedback,
          [currentQuestion.id]: {
            isCorrect: is_correct,
            show: true,
            correctAnswer: correct_answer,
            explanation: explanation,
          },
        });

        if (is_correct) {
          toast.success(`Chính xác! +${currentQuestion.xp_reward} XP`);
        } else {
          toast.error('Chưa đúng, hãy xem giải thích bên dưới');
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Không thể gửi câu trả lời. Vui lòng thử lại.');
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

  const progress = exercises.length > 0 ? ((currentQuestionIndex + 1) / exercises.length) * 100 : 0;
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

  if (error || exercises.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {error ? 'Có lỗi xảy ra' : 'Chưa có bài tập'}
          </h3>
          <p className="text-gray-600 mb-6">
            {error || 'Chủ đề này chưa có bài tập nào.'}
          </p>
          <button
            onClick={() => navigate(`/user/grammar`)}
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
      {/* Header */}
      <ExerciseHeader
        topicId={topicId}
        currentIndex={currentQuestionIndex}
        totalQuestions={exercises.length}
        answeredCount={answeredCount}
        progress={progress}
      />

      {/* Exercise Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Question Type Badge */}
          <div className="flex items-center justify-between mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentQuestion.type === 'Multiple Choice' 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {typeName}
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

            {/* Exercise Type */}
            {currentQuestion.type === 'Multiple Choice' && currentQuestion.options && (
              <MultipleChoiceExercise
                question={currentQuestion.question}
                options={currentQuestion.options}
                correctAnswer={currentQuestion.correct_answer}
                userAnswer={userAnswers[currentQuestion.id]}
                feedback={showFeedback[currentQuestion.id]}
                onSelect={handleAnswerSelect}
                disabled={!!showFeedback[currentQuestion.id]}
              />
            )}

            {currentQuestion.type === 'Fill in the Blank' && (
              <FillBlankExercise
                userAnswer={userAnswers[currentQuestion.id]}
                feedback={showFeedback[currentQuestion.id]}
                onAnswerChange={handleAnswerSelect}
                disabled={!!showFeedback[currentQuestion.id]}
              />
            )}
          </div>

          {/* Feedback */}
          <ExerciseFeedback
            feedback={showFeedback[currentQuestion.id]}
            explanation={showFeedback[currentQuestion.id]?.explanation}
            correctAnswer={showFeedback[currentQuestion.id]?.correctAnswer}
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

        {/* Question Navigator */}
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

export default ExercisePage;
