import React, { useEffect, useState } from 'react';
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
  const [stats, setStats] = useState([
    { icon: BookOpen, value: '0', label: 'Từ đã học', bgColor: 'bg-primary/10', iconColor: 'text-primary' },
    { icon: CheckCircle2, value: '0', label: 'Chủ đề hoàn thành', bgColor: 'bg-secondary/10', iconColor: 'text-secondary' },
    { icon: TrendingUp, value: '0%', label: 'Độ chính xác', bgColor: 'bg-green-50', iconColor: 'text-green-600' },
    { icon: Zap, value: '0', label: 'XP kiếm được', bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
  ]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const slugify = (s = '') => s.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const emojiMap = {
    Family: '👪',
    'Daily Activities': '🏃',
    'Food & Drinks': '🍔',
    Travel: '✈️',
    Technology: '💻',
    'Health & Fitness': '💪',
  };

  useEffect(() => {
    let mounted = true;

    // get token from localStorage (adjust keys if your app stores it under a different name)
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (!token) {
      if (!mounted) return;
      setError('Không tìm thấy token. Vui lòng đăng nhập.');
      setLoading(false);
      return;
    }

    // try to get userId from localStorage or decode from JWT payload
    let userId = localStorage.getItem('userId') || null;
    if (!userId) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          userId = payload.userId || payload.sub || payload.id || null;
        }
      } catch (e) {
        
      }
    }
    userId = userId || 1; // fallback id if none available

    fetch(`http://localhost:8088/api/v1/vocab/stats/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // credentials: 'include' // uncomment if your API requires cookies
    })
      .then((res) => {
        if (!res.ok) {
          // provide clearer messages for auth errors
          if (res.status === 401) throw new Error('Unauthorized (401). Token may be invalid or expired.');
          throw new Error(`${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((json) => {
        if (!mounted) return;
        // adjust if your API wraps differently
        const result = json.result || json;
        const topicProgress = result.topicProgress || [];
        const avgCompletion = topicProgress.length
          ? Math.round((topicProgress.reduce((s, t) => s + (t.completionPercentage || 0), 0) / topicProgress.length) * 100)
          : 0;

        setStats([
          { icon: BookOpen, value: String(result.totalWordsLearned || 0), label: 'Từ đã học', bgColor: 'bg-primary/10', iconColor: 'text-primary' },
          { icon: CheckCircle2, value: String(result.topicsCompleted || 0), label: 'Chủ đề hoàn thành', bgColor: 'bg-secondary/10', iconColor: 'text-secondary' },
          { icon: TrendingUp, value: `${avgCompletion}%`, label: 'Độ chính xác', bgColor: 'bg-green-50', iconColor: 'text-green-600' },
          { icon: Zap, value: String(result.totalXpEarned || 0), label: 'XP kiếm được', bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
        ]);

        setTopics(topicProgress.map((tp) => ({
          id: tp.topicId,
          emoji: emojiMap[tp.englishName] || '📘',
          title: tp.englishName || tp.topicName,
          titleVi: tp.topicName,
          description: tp.englishName || '',
          totalWords: tp.totalWords || 0,
          learnedWords: tp.wordsLearned || 0,
          xp: tp.xpEarned || 0,
          link: `/vocabulary/${slugify(tp.englishName || tp.topicName)}`,
        })));
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.message || 'Failed to load');
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const calculateProgress = (learned, total) => {
    if (!total || total === 0) return 0;
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
        {error && <div className="text-red-600 mb-4">Lỗi: {error}</div>}

        {/* TOPICS SECTION */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Chủ đề từ vựng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // simple loading placeholder
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg border-2 border-gray-100 p-6 h-44 animate-pulse" />
              ))
            ) : (
              topics.map((topic) => (
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
                      style={{ width: `${calculateProgress(topic.learnedWords, topic.totalWords)}%` }}
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
              ))
             )}
           </div>
         </div>
       </div>
     </div>
   );
};

export default VocabularyPage;
