import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Clock,
  Zap,
  AlertTriangle,
  Check,
  X,
  Trophy,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';

const GrammarLessonPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [lessonProgress, setLessonProgress] = useState(75);

  // Mock data
  const lesson = {
    topic: 'Thì hiện tại',
    topicEn: 'present-tenses',
    lessonId: 1,
    title: 'Present Simple - Thì hiện tại đơn',
    estimatedTime: '15 phút',
    xpReward: 20,
  };

  const quizQuestions = [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'She _____ to school every day.',
      options: ['go', 'goes', 'going', 'gone'],
      correctAnswer: 1,
      explanation: 'Với chủ ngữ số ít ngôi thứ 3 (she), động từ cần thêm "s/es"',
    },
    {
      id: 2,
      type: 'multiple-choice',
      question: 'They _____ not like coffee.',
      options: ['does', 'do', 'doing', 'done'],
      correctAnswer: 1,
      explanation: 'Với chủ ngữ số nhiều (they), dùng "do" trong câu phủ định',
    },
    {
      id: 3,
      type: 'fill-blank',
      question: 'I _____ (play) tennis on weekends.',
      correctAnswer: 'play',
      explanation: 'Với chủ ngữ "I", động từ giữ nguyên dạng nguyên thể',
    },
    {
      id: 4,
      type: 'multiple-choice',
      question: '_____ he work in a bank?',
      options: ['Do', 'Does', 'Is', 'Are'],
      correctAnswer: 1,
      explanation: 'Câu nghi vấn với "he" cần dùng "Does"',
    },
    {
      id: 5,
      type: 'identify-error',
      question: 'She go to the gym every morning.',
      error: 'go',
      correction: 'goes',
      explanation: 'Động từ "go" cần thêm "es" với chủ ngữ "she"',
    },
  ];

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answer });
  };

  const handleCheckAnswer = (questionId) => {
    const question = quizQuestions.find((q) => q.id === questionId);
    const userAnswer = selectedAnswers[questionId];
    let isCorrect = false;

    if (question.type === 'multiple-choice') {
      isCorrect = userAnswer === question.correctAnswer;
    } else if (question.type === 'fill-blank') {
      isCorrect = userAnswer?.toLowerCase().trim() === question.correctAnswer.toLowerCase();
    }

    setShowFeedback({ ...showFeedback, [questionId]: { isCorrect, show: true } });

    // Update progress
    const answeredCount = Object.keys(showFeedback).length + 1;
    const progress = 75 + Math.round((answeredCount / quizQuestions.length) * 25);
    setLessonProgress(progress);
  };

  const handleCompleteLesson = () => {
    setQuizCompleted(true);
  };

  const answeredQuestions = Object.keys(showFeedback).length;
  const correctAnswers = Object.values(showFeedback).filter((f) => f.isCorrect).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* PROGRESS BAR TOP */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="h-2 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-secondary to-secondary/70 transition-all duration-500"
            style={{ width: `${lessonProgress}%` }}
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* BREADCRUMB */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link to="/grammar" className="hover:text-primary transition-colors">
              Ngữ pháp
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              to={`/grammar/${lesson.topicEn}`}
              className="hover:text-primary transition-colors"
            >
              {lesson.topic}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{lesson.title}</span>
          </div>

          {/* LESSON HEADER */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{lesson.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {lesson.estimatedTime}
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-sm font-semibold">
                <Zap className="w-4 h-4" />
                +{lesson.xpReward} XP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LESSON CONTENT */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 1. EXPLANATION */}
          <section className="bg-white rounded-lg border-2 border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-secondary" />
              Khái niệm
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Thì hiện tại đơn (Present Simple) được sử dụng để diễn tả một sự thật hiển nhiên, 
              một thói quen, hoặc một hành động xảy ra thường xuyên ở hiện tại.
            </p>

            {/* Formula Box */}
            <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg border-2 border-secondary/20 p-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase mb-3">Công thức:</h3>
              <div className="space-y-2 font-mono">
                <div className="bg-white rounded px-3 py-2 text-gray-900 font-semibold">
                  (+) S + V(s/es) + O
                </div>
                <div className="bg-white rounded px-3 py-2 text-gray-900 font-semibold">
                  (-) S + do/does + not + V(nguyên thể) + O
                </div>
                <div className="bg-white rounded px-3 py-2 text-gray-900 font-semibold">
                  (?) Do/Does + S + V(nguyên thể) + O?
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-900">
                <strong>Lưu ý:</strong> Với chủ ngữ ngôi thứ 3 số ít (he, she, it), động từ thêm "s" hoặc "es"
              </p>
            </div>
          </section>

          {/* 2. USAGE */}
          <section className="bg-white rounded-lg border-2 border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Cách sử dụng</h2>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-secondary font-bold flex-shrink-0">1.</span>
                <div>
                  <strong className="text-gray-900">Thói quen, hành động lặp đi lặp lại:</strong>
                  <p className="text-gray-700 mt-1">
                    I <span className="bg-yellow-100 px-1 rounded">brush</span> my teeth twice a day.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-secondary font-bold flex-shrink-0">2.</span>
                <div>
                  <strong className="text-gray-900">Sự thật hiển nhiên:</strong>
                  <p className="text-gray-700 mt-1">
                    The sun <span className="bg-yellow-100 px-1 rounded">rises</span> in the East.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-secondary font-bold flex-shrink-0">3.</span>
                <div>
                  <strong className="text-gray-900">Lịch trình, thời gian biểu:</strong>
                  <p className="text-gray-700 mt-1">
                    The train <span className="bg-yellow-100 px-1 rounded">leaves</span> at 8:00 AM.
                  </p>
                </div>
              </li>
            </ul>
          </section>

          {/* 3. EXAMPLES */}
          <section className="bg-white rounded-lg border-2 border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Ví dụ</h2>
            <div className="grid gap-4">
              <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
                <div className="text-xs font-semibold text-green-700 uppercase mb-2">
                  Câu khẳng định
                </div>
                <p className="text-gray-900">She <strong>works</strong> at a hospital.</p>
                <p className="text-sm text-gray-600 mt-1 italic">
                  (Cô ấy làm việc ở bệnh viện.)
                </p>
              </div>

              <div className="border-2 border-red-200 bg-red-50 rounded-lg p-4">
                <div className="text-xs font-semibold text-red-700 uppercase mb-2">
                  Câu phủ định
                </div>
                <p className="text-gray-900">They <strong>don't play</strong> football on Mondays.</p>
                <p className="text-sm text-gray-600 mt-1 italic">
                  (Họ không chơi bóng đá vào thứ Hai.)
                </p>
              </div>

              <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4">
                <div className="text-xs font-semibold text-blue-700 uppercase mb-2">
                  Câu nghi vấn
                </div>
                <p className="text-gray-900"><strong>Does</strong> he <strong>speak</strong> English?</p>
                <p className="text-sm text-gray-600 mt-1 italic">
                  (Anh ấy có nói tiếng Anh không?)
                </p>
              </div>
            </div>
          </section>

          {/* 4. COMMON MISTAKES */}
          <section className="bg-white rounded-lg border-2 border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
              Lỗi thường gặp
            </h2>
            <div className="space-y-3">
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">She go to school every day.</p>
                    <p className="text-sm text-gray-600 mt-1">
                      → Thiếu "es" sau động từ với chủ ngữ ngôi thứ 3 số ít
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">She goes to school every day.</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">He don't like coffee.</p>
                    <p className="text-sm text-gray-600 mt-1">
                      → Dùng sai "don't" với chủ ngữ ngôi thứ 3 số ít
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">He doesn't like coffee.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. PRACTICE QUIZ */}
          <section className="bg-white rounded-lg border-2 border-gray-100 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Bài tập thực hành</h2>
              <div className="text-sm font-semibold text-gray-600">
                {answeredQuestions}/{quizQuestions.length} câu
              </div>
            </div>

            <div className="space-y-6">
              {quizQuestions.map((question, index) => {
                const userAnswer = selectedAnswers[question.id];
                const feedback = showFeedback[question.id];

                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      feedback?.show
                        ? feedback.isCorrect
                          ? 'border-green-300 bg-green-50'
                          : 'border-red-300 bg-red-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="mb-3">
                      <span className="text-sm font-semibold text-gray-500">
                        Câu {index + 1}
                      </span>
                      <p className="text-lg font-medium text-gray-900 mt-1">
                        {question.question}
                      </p>
                    </div>

                    {/* Multiple Choice */}
                    {question.type === 'multiple-choice' && (
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <button
                            key={optIndex}
                            onClick={() => handleAnswerSelect(question.id, optIndex)}
                            disabled={feedback?.show}
                            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                              userAnswer === optIndex
                                ? feedback?.show
                                  ? optIndex === question.correctAnswer
                                    ? 'border-green-500 bg-green-100'
                                    : 'border-red-500 bg-red-100'
                                  : 'border-secondary bg-secondary/10'
                                : feedback?.show && optIndex === question.correctAnswer
                                ? 'border-green-500 bg-green-100'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {feedback?.show && optIndex === question.correctAnswer && (
                                <Check className="w-5 h-5 text-green-600" />
                              )}
                              {feedback?.show &&
                                userAnswer === optIndex &&
                                optIndex !== question.correctAnswer && (
                                  <X className="w-5 h-5 text-red-600" />
                                )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Fill in the Blank */}
                    {question.type === 'fill-blank' && (
                      <input
                        type="text"
                        value={userAnswer || ''}
                        onChange={(e) => handleAnswerSelect(question.id, e.target.value)}
                        disabled={feedback?.show}
                        placeholder="Nhập câu trả lời..."
                        className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${
                          feedback?.show
                            ? feedback.isCorrect
                              ? 'border-green-500 bg-green-50'
                              : 'border-red-500 bg-red-50'
                            : 'border-gray-200 focus:border-secondary'
                        }`}
                      />
                    )}

                    {/* Check Answer Button */}
                    {!feedback?.show && userAnswer !== undefined && (
                      <button
                        onClick={() => handleCheckAnswer(question.id)}
                        className="mt-3 px-4 py-2 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-colors"
                      >
                        Kiểm tra
                      </button>
                    )}

                    {/* Feedback */}
                    {feedback?.show && (
                      <div
                        className={`mt-3 p-3 rounded-lg ${
                          feedback.isCorrect ? 'bg-green-100' : 'bg-red-100'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {feedback.isCorrect ? (
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p
                              className={`font-semibold ${
                                feedback.isCorrect ? 'text-green-800' : 'text-red-800'
                              }`}
                            >
                              {feedback.isCorrect ? 'Chính xác!' : 'Chưa đúng'}
                            </p>
                            <p
                              className={`text-sm mt-1 ${
                                feedback.isCorrect ? 'text-green-700' : 'text-red-700'
                              }`}
                            >
                              {question.explanation}
                            </p>
                            {!feedback.isCorrect && question.correctAnswer && (
                              <p className="text-sm mt-1 font-medium text-gray-900">
                                Đáp án đúng:{' '}
                                {question.type === 'multiple-choice'
                                  ? question.options[question.correctAnswer]
                                  : question.correctAnswer}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* COMPLETION */}
          {quizCompleted && (
            <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg border-2 border-secondary/20 p-8 text-center space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
              <Trophy className="w-16 h-16 text-secondary mx-auto" />
              <h3 className="text-3xl font-bold text-gray-900">Hoàn thành bài học! 🎉</h3>
              <p className="text-lg text-gray-700">
                Điểm số: <span className="font-bold text-secondary">{correctAnswers}/{quizQuestions.length}</span>
              </p>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-full text-lg font-bold animate-bounce">
                <Zap className="w-5 h-5" />
                +{lesson.xpReward} XP
              </div>
              <Link
                to={`/grammar/${lesson.topicEn}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-secondary border-2 border-secondary rounded-lg font-semibold hover:bg-secondary hover:text-white transition-all duration-200 mt-4"
              >
                Quay lại chủ đề
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}

          {/* BOTTOM ACTIONS */}
          {!quizCompleted && (
            <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 p-4 rounded-lg shadow-lg">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                <div className="text-sm font-medium text-gray-600">
                  Tiến độ: {answeredQuestions}/{quizQuestions.length} câu hỏi
                </div>
                <button
                  onClick={handleCompleteLesson}
                  disabled={answeredQuestions < quizQuestions.length}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                    answeredQuestions < quizQuestions.length
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-secondary text-white hover:bg-secondary/90 hover:scale-105 active:scale-95'
                  }`}
                >
                  Hoàn thành
                  <Check className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrammarLessonPage;
