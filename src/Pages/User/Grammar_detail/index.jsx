import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Target,
  CheckCircle2,
  Circle,
  Lock,
  ChevronDown,
  ChevronUp,
  Clock,
  Zap,
  BookOpen,
  TrendingUp,
  ArrowRight,
  PlayCircle,
  Home,
} from 'lucide-react';

const GrammarDetailPage = () => {
  const [expandedLesson, setExpandedLesson] = useState(null);

  // Mock data
  const topic = {
    title: 'Thì hiện tại',
    titleEn: 'Present Tenses',
    description: 'Học các thì hiện tại trong tiếng Anh: Simple, Continuous, Perfect và Perfect Continuous',
    totalLessons: 5,
    completedLessons: 2,
    timeSpent: '45 phút',
    xpEarned: 40,
  };

  const lessons = [
    {
      id: 1,
      number: 1,
      title: 'Present Simple',
      titleVi: 'Thì hiện tại đơn',
      description: 'Học cách sử dụng thì hiện tại đơn để diễn tả thói quen, sự thật hiển nhiên và lịch trình.',
      duration: '15 phút',
      xp: 20,
      status: 'completed',
      progress: 100,
      topics: ['Cấu trúc câu khẳng định', 'Câu phủ định', 'Câu nghi vấn', 'Trạng từ tần suất'],
    },
    {
      id: 2,
      number: 2,
      title: 'Present Continuous',
      titleVi: 'Thì hiện tại tiếp diễn',
      description: 'Học cách sử dụng thì hiện tại tiếp diễn để diễn tả hành động đang diễn ra và kế hoạch tương lai.',
      duration: '12 phút',
      xp: 20,
      status: 'completed',
      progress: 100,
      topics: ['Cấu trúc to be + V-ing', 'Động từ không chia tiếp diễn', 'So sánh với Present Simple'],
    },
    {
      id: 3,
      number: 3,
      title: 'Present Perfect',
      titleVi: 'Thì hiện tại hoàn thành',
      description: 'Học cách sử dụng thì hiện tại hoàn thành để diễn tả hành động đã xảy ra trong quá khứ nhưng liên quan đến hiện tại.',
      duration: '18 phút',
      xp: 25,
      status: 'in-progress',
      progress: 45,
      topics: ['Cấu trúc Have/Has + V3', 'Since và For', 'Already, Yet, Just', 'Ever và Never'],
    },
    {
      id: 4,
      number: 4,
      title: 'Present Perfect Continuous',
      titleVi: 'Thì hiện tại hoàn thành tiếp diễn',
      description: 'Học cách kết hợp Present Perfect và Continuous để nhấn mạnh tính liên tục của hành động.',
      duration: '15 phút',
      xp: 25,
      status: 'new',
      progress: 0,
      topics: ['Cấu trúc Have/Has been V-ing', 'Phân biệt với Present Perfect', 'Cách dùng thực tế'],
    },
    {
      id: 5,
      number: 5,
      title: 'Review & Practice',
      titleVi: 'Ôn tập & Thực hành',
      description: 'Tổng hợp kiến thức và làm bài tập tổng hợp về các thì hiện tại.',
      duration: '20 phút',
      xp: 30,
      status: 'locked',
      progress: 0,
      requiredLesson: 4,
      topics: ['Bài tập tổng hợp', 'Quiz', 'Phân biệt các thì', 'Ứng dụng thực tế'],
    },
  ];

  const toggleLesson = (lessonId) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />;
      case 'in-progress':
        return <Circle className="w-6 h-6 text-primary fill-primary/30 flex-shrink-0" />;
      case 'new':
        return <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />;
      case 'locked':
        return <Lock className="w-6 h-6 text-gray-400 flex-shrink-0" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50/50';
      case 'in-progress':
        return 'border-primary/20 bg-primary/5';
      case 'new':
        return 'border-gray-200 bg-white';
      case 'locked':
        return 'border-gray-200 bg-gray-50 opacity-60';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const completionPercentage = Math.round((topic.completedLessons / topic.totalLessons) * 100);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            {/* BREADCRUMB */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link to="/dashboard" className="flex items-center gap-1 hover:text-primary transition-colors">
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/grammar" className="hover:text-primary transition-colors">
                Ngữ pháp
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">{topic.title}</span>
            </div>

            {/* TOPIC OVERVIEW CARD */}
            <div className="bg-white rounded-lg border-2 border-gray-100 shadow-sm p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-7 h-7 text-secondary" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    {topic.title}
                  </h1>
                  <p className="text-gray-600 mb-2">{topic.titleEn}</p>
                  <p className="text-gray-700">{topic.description}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <BookOpen className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {topic.completedLessons}/{topic.totalLessons}
                  </div>
                  <div className="text-xs text-gray-600">Bài học</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{topic.timeSpent}</div>
                  <div className="text-xs text-gray-600">Thời gian</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Zap className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{topic.xpEarned}</div>
                  <div className="text-xs text-gray-600">XP kiếm được</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">Tiến độ hoàn thành</span>
                  <span className="text-secondary font-semibold">{completionPercentage}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-secondary to-secondary/70 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* LESSONS LIST */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Danh sách bài học</h2>
              <div className="space-y-3">
                {lessons.map((lesson) => {
                  const isExpanded = expandedLesson === lesson.id;
                  const isLocked = lesson.status === 'locked';

                  return (
                    <div
                      key={lesson.id}
                      className={`rounded-lg border-2 overflow-hidden transition-all duration-300 ${getStatusColor(
                        lesson.status
                      )} ${!isLocked && 'hover:shadow-md'}`}
                    >
                      {/* TRIGGER */}
                      <button
                        onClick={() => !isLocked && toggleLesson(lesson.id)}
                        disabled={isLocked}
                        className={`w-full p-4 flex items-center gap-4 text-left ${
                          isLocked ? 'cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        {/* Status Icon */}
                        {getStatusIcon(lesson.status)}

                        {/* Lesson Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-500">
                              Bài {lesson.number}
                            </span>
                            <span className="text-gray-300">•</span>
                            <h3 className="text-lg font-bold text-gray-900 truncate">
                              {lesson.titleVi}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600">{lesson.title}</p>
                        </div>

                        {/* Badges & Chevron */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {lesson.duration}
                            </span>
                            <span className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded-full font-semibold flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              +{lesson.xp}
                            </span>
                          </div>
                          {!isLocked && (
                            <div>
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          )}
                        </div>
                      </button>

                      {/* CONTENT (EXPANDED) */}
                      {isExpanded && !isLocked && (
                        <div className="px-4 pb-4 pt-2 border-t border-gray-200 space-y-4 animate-in slide-in-from-top duration-200">
                          {/* Description */}
                          <p className="text-gray-700">{lesson.description}</p>

                          {/* Topics covered */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">
                              Nội dung bài học:
                            </h4>
                            <ul className="space-y-1">
                              {lesson.topics.map((topic, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-600 flex items-start gap-2"
                                >
                                  <span className="text-primary mt-1">•</span>
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Progress Bar (if in-progress) */}
                          {lesson.status === 'in-progress' && (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-gray-700">Tiến độ</span>
                                <span className="text-primary font-semibold">
                                  {lesson.progress}%
                                </span>
                              </div>
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full transition-all duration-500"
                                  style={{ width: `${lesson.progress}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Action Button */}
                          <Link
                            to={`/grammar/${topic.titleEn.toLowerCase().replace(/\s+/g, '-')}/lesson/${lesson.id}`}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
                              lesson.status === 'completed'
                                ? 'border-2 border-secondary text-secondary hover:bg-secondary hover:text-white'
                                : 'bg-secondary text-white hover:bg-secondary/90'
                            }`}
                          >
                            {lesson.status === 'completed' ? (
                              <>
                                <BookOpen className="w-5 h-5" />
                                Ôn tập lại
                              </>
                            ) : lesson.status === 'in-progress' ? (
                              <>
                                <PlayCircle className="w-5 h-5" />
                                Tiếp tục học
                              </>
                            ) : (
                              <>
                                <ArrowRight className="w-5 h-5" />
                                Bắt đầu học
                              </>
                            )}
                          </Link>
                        </div>
                      )}

                      {/* LOCKED MESSAGE */}
                      {isExpanded && isLocked && (
                        <div className="px-4 pb-4 pt-2 border-t border-gray-200 text-center">
                          <p className="text-sm text-gray-500">
                            Hoàn thành bài {lesson.requiredLesson} để mở khóa bài học này
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* Progress Summary */}
            <div className="bg-white rounded-lg border-2 border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-gray-900">Tổng quan tiến độ</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hoàn thành</span>
                  <span className="text-sm font-bold text-green-600">
                    {lessons.filter((l) => l.status === 'completed').length} bài
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Đang học</span>
                  <span className="text-sm font-bold text-primary">
                    {lessons.filter((l) => l.status === 'in-progress').length} bài
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Chưa học</span>
                  <span className="text-sm font-bold text-gray-600">
                    {lessons.filter((l) => l.status === 'new' || l.status === 'locked').length} bài
                  </span>
                </div>
              </div>
            </div>

            {/* Next Lesson Recommendation */}
            <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg border-2 border-secondary/20 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <PlayCircle className="w-5 h-5 text-secondary" />
                <h3 className="text-lg font-bold text-gray-900">Bài học tiếp theo</h3>
              </div>

              {(() => {
                const nextLesson = lessons.find(
                  (l) => l.status === 'in-progress' || l.status === 'new'
                );
                if (nextLesson) {
                  return (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Bài {nextLesson.number}</p>
                        <h4 className="font-bold text-gray-900">{nextLesson.titleVi}</h4>
                        <p className="text-sm text-gray-600 mt-1">{nextLesson.title}</p>
                      </div>
                      <Link
                        to={`/grammar/${topic.titleEn.toLowerCase().replace(/\s+/g, '-')}/lesson/${nextLesson.id}`}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary/90 transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        {nextLesson.status === 'in-progress' ? 'Tiếp tục' : 'Bắt đầu'}
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  );
                }
                return (
                  <p className="text-sm text-gray-600">
                    🎉 Bạn đã hoàn thành tất cả bài học!
                  </p>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrammarDetailPage;
