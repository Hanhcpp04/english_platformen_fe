import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Target,
  PenTool,
  MessageSquare,
  Zap,
  Award,
  TrendingUp,
  Calendar,
  Clock,
  ArrowRight,
  Trophy,
  Star,
  Flame,
  CheckCircle2,
  Circle,
} from 'lucide-react';

const Dashboard = () => {
  const learningModules = [
    {
      id: 1,
      title: 'Từ vựng',
      description: 'Học từ vựng qua flashcard và hình ảnh',
      icon: BookOpen,
      progress: '45/100',
      bgColor: 'bg-primary',
      bgColorLight: 'bg-primary/10',
      textColor: 'text-primary',
      borderColor: 'border-gray-100 hover:border-primary',
      iconBgHover: 'group-hover:bg-primary',
      buttonClass: 'bg-primary text-white hover:bg-primary/90',
      link: '/vocabulary',
    },
    {
      id: 2,
      title: 'Ngữ pháp',
      description: 'Bài giảng và thực hành ngữ pháp',
      icon: Target,
      progress: '32/80',
      bgColor: 'bg-yellow-600',
      bgColorLight: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      borderColor: 'border-gray-100 hover:border-yellow-600',
      iconBgHover: 'group-hover:bg-yellow-600',
      buttonClass: 'bg-yellow-600 text-white hover:bg-yellow-700',
      link: '/grammar',
    },
    {
      id: 3,
      title: 'Luyện viết',
      description: 'Cải thiện kỹ năng viết với AI',
      icon: PenTool,
      progress: '8 bài',
      bgColor: 'bg-green-600',
      bgColorLight: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-gray-100 hover:border-green-600',
      iconBgHover: 'group-hover:bg-green-600',
      buttonClass: 'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white',
      link: '/writing',
    },
    {
      id: 4,
      title: 'Diễn đàn',
      description: 'Kết nối và học hỏi từ cộng đồng',
      icon: MessageSquare,
      progress: '24 bài',
      bgColor: 'bg-purple-600',
      bgColorLight: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-gray-100 hover:border-purple-600',
      iconBgHover: 'group-hover:bg-purple-600',
      buttonClass: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white',
      link: '/forum',
    },
  ];

  const dailyGoals = [
    { id: 1, text: 'Học 10 từ vựng mới', completed: true },
    { id: 2, text: 'Hoàn thành 1 bài ngữ pháp', completed: true },
    { id: 3, text: 'Viết 1 bài essay', completed: true },
    { id: 4, text: 'Tham gia diễn đàn', completed: false },
    { id: 5, text: 'Học 20 phút', completed: false },
  ];

  const recentBadges = [
    { id: 1, icon: Trophy, gradient: 'from-yellow-400 to-orange-500', name: 'First Win' },
    { id: 2, icon: Star, gradient: 'from-blue-400 to-cyan-500', name: 'Scholar' },
    { id: 3, icon: Flame, gradient: 'from-red-400 to-pink-500', name: 'Hot Streak' },
    { id: 4, icon: Award, gradient: 'from-purple-400 to-indigo-500', name: 'Master' },
    { id: 5, icon: Zap, gradient: 'from-green-400 to-emerald-500', name: 'Speed' },
    { id: 6, icon: Target, gradient: 'from-orange-400 to-red-500', name: 'Accuracy' },
  ];

  const stats = [
    {
      icon: Zap,
      value: '15',
      label: 'Ngày streak',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500',
    },
    {
      icon: Award,
      value: '12',
      label: 'Huy hiệu',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-500',
    },
    {
      icon: TrendingUp,
      value: '89%',
      label: 'Độ chính xác',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
    },
  ];

  const completedGoals = dailyGoals.filter((goal) => goal.completed).length;
  const goalProgress = Math.round((completedGoals / dailyGoals.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* WELCOME SECTION */}
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Chào mừng trở lại, Nguyễn! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Hãy tiếp tục hành trình học tiếng Anh của bạn
              </p>
            </div>

            {/* PROGRESS CARD */}
            <div className="bg-white rounded-lg border-2 border-primary/20 shadow-md p-6 space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Tiến trình học tập
                  </h2>
                  <p className="text-gray-600">Level 5 - Intermediate Learner</p>
                </div>
                <div className="px-4 py-2 bg-primary rounded-lg">
                  <span className="text-white font-bold text-lg">2,450 XP</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">Tiến độ lên Level 6</span>
                  <span className="text-gray-600">550 XP nữa</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                    style={{ width: '82%' }}
                  />
                </div>
                <div className="text-right text-sm font-medium text-primary">82%</div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`${stat.bgColor} rounded-lg p-4 text-center hover:shadow-md transition-all duration-200`}
                  >
                    <div className="flex justify-center mb-2">
                      <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* LEARNING MODULES */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Module học tập</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {learningModules.map((module) => (
                  <div
                    key={module.id}
                    className={`bg-white rounded-lg border-2 ${module.borderColor} shadow-sm hover:shadow-lg transition-all duration-300 p-6 space-y-4 group`}
                  >
                    {/* Icon & Badge */}
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-14 h-14 ${module.bgColorLight} rounded-lg flex items-center justify-center ${module.iconBgHover} transition-all duration-300`}
                      >
                        <module.icon
                          className={`w-7 h-7 ${module.textColor} group-hover:text-white group-hover:scale-110 transition-all duration-300`}
                        />
                      </div>
                      <span
                        className={`px-3 py-1 ${module.bgColorLight} ${module.textColor} text-sm font-semibold rounded-full`}
                      >
                        {module.progress}
                      </span>
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {module.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{module.description}</p>
                    </div>

                    {/* Button */}
                    <Link
                      to={module.link}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${module.buttonClass}`}
                    >
                      Tiếp tục học
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            {/* DAILY GOAL CARD */}
            <div className="bg-white rounded-lg border-2 border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-gray-900">Mục tiêu hôm nay</h3>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">
                    {completedGoals}/{dailyGoals.length} bài tập
                  </span>
                  <span className="text-primary font-semibold">{goalProgress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${goalProgress}%` }}
                  />
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-3 pt-2">
                {dailyGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center gap-3">
                    {goal.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        goal.completed
                          ? 'text-gray-500 line-through'
                          : 'text-gray-700'
                      }`}
                    >
                      {goal.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RECENT BADGES CARD */}
            <div className="bg-white rounded-lg border-2 border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-gray-900">Huy hiệu gần đây</h3>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-3 gap-3">
                {recentBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`aspect-square rounded-lg bg-gradient-to-br ${badge.gradient} p-3 flex items-center justify-center hover:scale-110 transition-transform duration-200 cursor-pointer shadow-md`}
                  >
                    <badge.icon className="w-8 h-8 text-white" />
                  </div>
                ))}
              </div>
            </div>

            {/* STUDY TIME CARD */}
            <div className="bg-white rounded-lg border-2 border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-gray-900">
                  Thời gian học tuần này
                </h3>
              </div>
              <div className="text-center space-y-2">
                <div className="text-5xl font-bold text-gray-900">5h 32m</div>
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  +2h so với tuần trước
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
