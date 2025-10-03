import React from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  CheckCircle2,
  Circle,
  Lock,
  Award,
  TrendingUp,
  Zap,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Home,
} from 'lucide-react';

const GrammarPage = () => {
  const stats = [
    {
      icon: BookOpen,
      value: '8',
      label: 'Bài học hoàn thành',
      bgColor: 'bg-secondary/10',
      iconColor: 'text-secondary',
    },
    {
      icon: Target,
      value: '2',
      label: 'Chủ đề đang học',
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      icon: TrendingUp,
      value: '87%',
      label: 'Độ chính xác',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: Zap,
      value: '280',
      label: 'XP kiếm được',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  const topics = [
    {
      id: 1,
      title: 'Thì hiện tại',
      titleEn: 'Present Tenses',
      description: 'Present Simple, Present Continuous, Present Perfect',
      totalLessons: 5,
      completedLessons: 5,
      xp: 100,
      status: 'completed',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200 hover:border-green-400',
      link: '/grammar/present-tenses',
    },
    {
      id: 2,
      title: 'Thì quá khứ',
      titleEn: 'Past Tenses',
      description: 'Past Simple, Past Continuous, Past Perfect',
      totalLessons: 5,
      completedLessons: 3,
      xp: 100,
      status: 'in-progress',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200 hover:border-blue-400',
      link: '/grammar/past-tenses',
    },
    {
      id: 3,
      title: 'Thì tương lai',
      titleEn: 'Future Tenses',
      description: 'Will, Be going to, Future Continuous',
      totalLessons: 4,
      completedLessons: 0,
      xp: 80,
      status: 'new',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200 hover:border-purple-400',
      link: '/grammar/future-tenses',
    },
    {
      id: 4,
      title: 'Động từ khuyết thiếu',
      titleEn: 'Modal Verbs',
      description: 'Can, Could, May, Might, Must, Should',
      totalLessons: 6,
      completedLessons: 0,
      xp: 120,
      status: 'new',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200 hover:border-orange-400',
      link: '/grammar/modal-verbs',
    },
    {
      id: 5,
      title: 'Câu điều kiện',
      titleEn: 'Conditionals',
      description: 'Type 0, Type 1, Type 2, Type 3',
      totalLessons: 5,
      completedLessons: 0,
      xp: 100,
      status: 'new',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
      borderColor: 'border-pink-200 hover:border-pink-400',
      link: '/grammar/conditionals',
    },
    {
      id: 6,
      title: 'Câu bị động',
      titleEn: 'Passive Voice',
      description: 'Active to Passive transformation',
      totalLessons: 4,
      completedLessons: 0,
      xp: 80,
      status: 'new',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      borderColor: 'border-cyan-200 hover:border-cyan-400',
      link: '/grammar/passive-voice',
    },
  ];

  const getStatusBadge = (status, completedLessons, totalLessons) => {
    if (status === 'completed') {
      return (
        <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Hoàn thành
        </div>
      );
    }
    if (status === 'in-progress') {
      return (
        <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
          <Circle className="w-3.5 h-3.5 fill-blue-700" />
          Đang học
        </div>
      );
    }
    return (
      <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
        {completedLessons}/{totalLessons} bài
      </div>
    );
  };

  const getButtonConfig = (status) => {
    if (status === 'completed') {
      return {
        text: 'Ôn tập',
        icon: BookOpen,
        className: 'bg-white border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white',
      };
    }
    if (status === 'in-progress') {
      return {
        text: 'Tiếp tục học',
        icon: ArrowRight,
        className: 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md',
      };
    }
    return {
      text: 'Bắt đầu học',
      icon: ArrowRight,
      className: 'bg-primary text-white hover:bg-primary/90 hover:shadow-md',
    };
  };

  const calculateProgress = (completed, total) => {
    return Math.round((completed / total) * 100);
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
          <span className="text-gray-900 font-medium">Ngữ pháp</span>
        </div>

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Ngữ pháp
          </h1>
          <p className="text-gray-600 text-lg">
            Nắm vững ngữ pháp với bài giảng chi tiết và bài tập thực hành
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Chủ đề ngữ pháp</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => {
              const progress = calculateProgress(topic.completedLessons, topic.totalLessons);
              const buttonConfig = getButtonConfig(topic.status);

              return (
                <div
                  key={topic.id}
                  className={`bg-white rounded-xl border-2 ${topic.borderColor} p-6 space-y-4 transition-all duration-300 hover:shadow-xl group`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 ${topic.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Target className={`w-7 h-7 ${topic.iconColor}`} />
                    </div>
                    {getStatusBadge(topic.status, topic.completedLessons, topic.totalLessons)}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {topic.title}
                    </h3>
                    <p className="text-sm font-medium text-gray-600 mb-2">{topic.titleEn}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{topic.description}</p>
                  </div>

                  {/* Progress Bar */}
                  {progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs text-gray-600">
                        <span>Tiến độ</span>
                        <span className="font-semibold">{progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            topic.status === 'completed' 
                              ? 'bg-gradient-to-r from-green-500 to-green-400' 
                              : 'bg-gradient-to-r from-blue-500 to-blue-400'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* XP & Button */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-semibold">
                      <Zap className="w-4 h-4 fill-amber-500" />
                      +{topic.xp}
                    </div>
                    <Link
                      to={topic.link}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${buttonConfig.className}`}
                    >
                      <buttonConfig.icon className="w-4 h-4" />
                      {buttonConfig.text}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrammarPage;
