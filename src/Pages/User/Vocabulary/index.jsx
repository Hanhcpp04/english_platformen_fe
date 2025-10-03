import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Lock,
  Award,
  TrendingUp,
  Zap,
  ArrowRight,
  ChevronRight,
  Home,
} from 'lucide-react';

const VocabularyPage = () => {
  const stats = [
    {
      icon: BookOpen,
      value: '77',
      label: 'Từ đã học',
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      icon: CheckCircle2,
      value: '3',
      label: 'Chủ đề hoàn thành',
      bgColor: 'bg-secondary/10',
      iconColor: 'text-secondary',
    },
    {
      icon: TrendingUp,
      value: '92%',
      label: 'Độ chính xác',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: Zap,
      value: '350',
      label: 'XP kiếm được',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  const topics = [
    {
      id: 1,
      emoji: '🏃',
      title: 'Daily Activities',
      titleVi: 'Hoạt động hàng ngày',
      description: 'Từ vựng về các hoạt động thường ngày',
      totalWords: 50,
      learnedWords: 45,
      xp: 100,
      link: '/vocabulary/daily-activities',
    },
    {
      id: 2,
      emoji: '🍔',
      title: 'Food & Drinks',
      titleVi: 'Đồ ăn & Thức uống',
      description: 'Từ vựng về món ăn và đồ uống',
      totalWords: 60,
      learnedWords: 32,
      xp: 120,
      link: '/vocabulary/food-drinks',
    },
    {
      id: 3,
      emoji: '✈️',
      title: 'Travel & Transportation',
      titleVi: 'Du lịch & Giao thông',
      description: 'Từ vựng về du lịch và phương tiện',
      totalWords: 55,
      learnedWords: 0,
      xp: 110,
      link: '/vocabulary/travel',
    },
    {
      id: 4,
      emoji: '💼',
      title: 'Work & Business',
      titleVi: 'Công việc & Kinh doanh',
      description: 'Từ vựng về môi trường làm việc',
      totalWords: 70,
      learnedWords: 0,
      xp: 140,
      link: '/vocabulary/work-business',
    },
    {
      id: 5,
      emoji: '💻',
      title: 'Technology',
      titleVi: 'Công nghệ',
      description: 'Từ vựng về công nghệ và máy tính',
      totalWords: 65,
      learnedWords: 0,
      xp: 130,
      link: '/vocabulary/technology',
    },
    {
      id: 6,
      emoji: '💪',
      title: 'Health & Fitness',
      titleVi: 'Sức khỏe & Thể hình',
      description: 'Từ vựng về sức khỏe và tập luyện',
      totalWords: 50,
      learnedWords: 0,
      xp: 100,
      link: '/vocabulary/health-fitness',
    },
  ];

  const calculateProgress = (learned, total) => {
    return Math.round((learned / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/dashboard" className="flex items-center gap-1 hover:text-primary transition-colors">
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Từ vựng</span>
        </div>

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Từ vựng
          </h1>
          <p className="text-gray-600 text-lg">
            Học từ vựng theo chủ đề với flashcard và bài tập đa dạng
          </p>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border-2 border-gray-100 p-4 hover:shadow-md transition-all duration-200"
            >
              <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* TOPICS SECTION */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Chủ đề từ vựng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => {
              const progress = calculateProgress(topic.learnedWords, topic.totalWords);

              return (
                <div
                  key={topic.id}
                  className="bg-white rounded-lg border-2 border-gray-100 p-6 space-y-4 transition-all duration-300 hover:border-primary hover:shadow-lg"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="text-4xl">{topic.emoji}</div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {topic.titleVi}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{topic.title}</p>
                    <p className="text-sm text-gray-500">{topic.description}</p>
                  </div>

                  {/* Progress Info */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 font-medium">
                      {topic.learnedWords}/{topic.totalWords} từ
                    </span>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                      +{topic.xp} XP
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Button */}
                  <Link
                    to={topic.link}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium transition-all duration-200 hover:scale-105 active:scale-95 bg-primary text-white hover:bg-primary/90"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Bắt đầu học
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyPage;
