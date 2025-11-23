import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ChevronRight,
  Target,
  CheckCircle2,
  Circle,
  Clock,
  Zap,
  BookOpen,
  ArrowRight,
  Home,
  Award,
  Brain,
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { getTopicLessons, completeLesson, getExerciseTypes } from '../../../../service/grammarService';
import { toast } from 'react-toastify';

const GrammarDetailPage = () => {
  const { topicId } = useParams(); // Numeric ID from URL
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [summary, setSummary] = useState({
    totalLessons: 0,
    inProgress: 0,
    completedLessons: 0,
    notStarted: 0
  });
  const [topicInfo, setTopicInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completingLesson, setCompletingLesson] = useState(false);
  const [exerciseTypes, setExerciseTypes] = useState([]);

  // Get user ID from localStorage or auth context
  const getUserId = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.id) return user.id.toString();
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }
    
    const userId = localStorage.getItem('id');
    
    if (!userId) {
      console.error('No user ID found in localStorage');
      return null;
    }
    
    return userId;
  };

  // Fetch lessons from API
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userId = getUserId();
        
        if (!userId) {
          setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
          setLoading(false);
          return;
        }
        
        console.log('Fetching lessons for topic:', topicId, 'user:', userId);
        
        const response = await getTopicLessons(topicId, userId);
        console.log('API Response:', response);
        
        if ((response.code === 1000 || response.code === 200) && response.result) {
          const { lessons: lessonsList, summary: summaryData } = response.result;
          
          setLessons(lessonsList || []);
          setSummary(summaryData || {});
          
          // Extract topic info from first lesson or create default
          if (lessonsList && lessonsList.length > 0) {
            setSelectedLesson(lessonsList[0].id);
            // You can add topic info if API returns it, otherwise use default
            setTopicInfo({
              id: topicId,
              title: 'Chủ đề ngữ pháp',
              description: 'Học ngữ pháp tiếng Anh'
            });
          }
        } else {
          setError(`API trả về code: ${response.code}. ${response.message || ''}`);
        }
      } catch (err) {
        console.error('Error fetching lessons:', err);
        console.error('Error response:', err.response);
        
        // More detailed error message
        if (err.response) {
          setError(`Lỗi ${err.response.status}: ${err.response.data?.message || 'Không thể tải danh sách bài học'}`);
        } else if (err.request) {
          setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
        } else {
          setError('Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (topicId) {
      fetchLessons();
    }
  }, [topicId]);

  // Get current lesson from state
  const currentLesson = lessons.find(l => l.id === selectedLesson) || lessons[0];

  // Fetch exercise types when lesson is completed
  useEffect(() => {
    const fetchExerciseTypes = async () => {
      if (!currentLesson?.isCompleted || !currentLesson?.id) return;
      
      try {
        const types = await getExerciseTypes(topicId, currentLesson.id);
        setExerciseTypes(types || []);
      } catch (error) {
        console.error('Error fetching exercise types:', error);
        setExerciseTypes([]);
      }
    };

    fetchExerciseTypes();
  }, [topicId, currentLesson?.id, currentLesson?.isCompleted]);
  
  // Determine lesson status based on isCompleted flag (no locking)
  const getLessonStatus = (lesson) => {
    if (lesson.isCompleted) return 'completed';
    return 'new'; // All lessons are available
  };

  // Handle complete lesson
  const handleCompleteLesson = async () => {
    if (!currentLesson || currentLesson.isCompleted) {
      toast.info('Bài học này đã được hoàn thành rồi!');
      return;
    }

    try {
      setCompletingLesson(true);
      const userId = getUserId();
      
      console.log('Completing lesson:', {
        userId,
        topicId,
        lessonId: currentLesson.id
      });

      const response = await completeLesson(
        parseInt(userId),
        parseInt(topicId),
        currentLesson.id,
        'theory'
      );

      console.log('Complete lesson response:', response);

      if ((response.code === 1000 || response.code === 200) && response.result) {
        // Update local state
        setLessons(prevLessons => 
          prevLessons.map(lesson => 
            lesson.id === currentLesson.id 
              ? { ...lesson, isCompleted: true }
              : lesson
          )
        );

        // Update summary
        setSummary(prev => ({
          ...prev,
          completedLessons: prev.completedLessons + 1,
          inProgress: Math.max(0, prev.inProgress - 1)
        }));

        // Show success message
        const message = response.result.message === "Lesson was already completed"
          ? 'Bài học này đã được hoàn thành trước đó'
          : `Chúc mừng! Bạn đã hoàn thành bài học và nhận được +${currentLesson.xpReward} XP! 🎉`;
        
        toast.success(message);

        // Auto move to next lesson after 1.5s
        setTimeout(() => {
          const currentIndex = lessons.findIndex(l => l.id === selectedLesson);
          if (currentIndex < lessons.length - 1) {
            setSelectedLesson(lessons[currentIndex + 1].id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 1500);
      }
    } catch (err) {
      console.error('Error completing lesson:', err);
      toast.error('Không thể hoàn thành bài học. Vui lòng thử lại!');
    } finally {
      setCompletingLesson(false);
    }
  };

  // Calculate completion percentage
  const completionPercentage = summary.totalLessons > 0 
    ? Math.round((summary.completedLessons / summary.totalLessons) * 100) 
    : 0;

  const getStatusIcon = (status, size = 'w-5 h-5') => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className={`${size} text-green-500`} />;
      case 'in-progress':
        return <Circle className={`${size} text-blue-500 fill-blue-200`} />;
      case 'new':
        return <Circle className={`${size} text-gray-400`} />;
      default:
        return null;
    }
  };

  // Process and style HTML content from backend
  const processHtmlContent = (htmlContent) => {
    if (!htmlContent) return '';
    
    let processedHtml = htmlContent;
    
    // Add Tailwind CSS classes to HTML elements
    const styleMap = {
      'h2': 'text-3xl font-bold text-gray-900 mb-4 mt-6',
      'h3': 'text-2xl font-bold text-gray-800 mb-3 mt-5',
      'h4': 'text-xl font-semibold text-gray-800 mb-2 mt-4',
      'p': 'text-gray-700 mb-4 leading-relaxed',
      'ul': 'list-disc list-inside space-y-2 mb-4 ml-4',
      'ol': 'list-decimal list-inside space-y-2 mb-4 ml-4',
      'li': 'text-gray-700 leading-relaxed',
      'strong': 'font-bold text-gray-900',
      'em': 'italic text-gray-800',
      'code': 'bg-gray-100 px-2 py-1 rounded text-sm font-mono text-pink-600',
      'pre': 'bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 overflow-x-auto',
      'blockquote': 'border-l-4 border-blue-500 bg-blue-50 pl-4 py-2 mb-4 italic text-gray-700',
      'table': 'min-w-full divide-y divide-gray-200 mb-4 border border-gray-200 rounded-lg overflow-hidden',
      'th': 'bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-900',
      'td': 'px-4 py-3 text-sm text-gray-700 border-t border-gray-200',
    };
    
    Object.entries(styleMap).forEach(([tag, classes]) => {
     
      const regex = new RegExp(`<${tag}(?!\\s+class=)([^>]*)>`, 'gi');
      processedHtml = processedHtml.replace(regex, `<${tag} class="${classes}"$1>`);
      
      const regexWithClass = new RegExp(`<${tag}([^>]*?)class="([^"]*)"([^>]*)>`, 'gi');
      processedHtml = processedHtml.replace(regexWithClass, `<${tag}$1class="$2 ${classes}"$3>`);
    });
    
    // Add responsive image classes
    processedHtml = processedHtml.replace(
      /<img([^>]*?)>/gi,
      '<img class="max-w-full h-auto rounded-lg shadow-md my-4"$1>'
    );
    
    // Style links
    processedHtml = processedHtml.replace(
      /<a([^>]*?)>/gi,
      '<a class="text-blue-600 hover:text-blue-800 underline font-medium"$1>'
    );
    
    // Add container divs for better spacing
    processedHtml = processedHtml.replace(
      /<div([^>]*?)>/gi,
      '<div class="mb-4"$1>'
    );
    
    return processedHtml;
  };

  // Get lesson content from API data or fallback
  const getLessonContent = (lesson) => {
    if (!lesson) return { theory: '', examples: [] };
    
    const rawContent = lesson.content || `<h2>Lý thuyết: ${lesson.title}</h2><p>Nội dung đang được cập nhật...</p>`;
    const processedContent = processHtmlContent(rawContent);
    
    return {
      theory: processedContent,
      examples: []
    };
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Đã xảy ra lỗi</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          
          {/* Debug info */}
          <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left text-sm">
            <p className="font-semibold mb-2">Thông tin debug:</p>
            <p className="text-gray-700">• Topic ID: {topicId}</p>
            <p className="text-gray-700">• User ID: {getUserId()}</p>
            <p className="text-gray-700">• API URL: http://localhost:8088/api/v1/grammar/topics/{topicId}/lessons?user_id={getUserId()}</p>
            <p className="text-gray-700 mt-2">• Kiểm tra xem server có đang chạy không</p>
            <p className="text-gray-700">• Kiểm tra console để xem chi tiết lỗi</p>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // No lessons found
  if (lessons.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có bài học</h3>
          <p className="text-gray-600 mb-6">Chủ đề này chưa có bài học nào.</p>
          <Link
            to="/grammar"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* MAIN CONTENT - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* BREADCRUMB */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <Link to="/dashboard" className="flex items-center gap-1 hover:text-primary transition-colors">
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/grammar" className="hover:text-primary transition-colors">
                Ngữ pháp
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">
                {topicInfo?.title || `Chủ đề ${topicId}`}
              </span>
            </div>

            {/* TOPIC HEADER */}
            <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-7 h-7 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    {topicInfo?.title || 'Chủ đề ngữ pháp'}
                  </h1>
                  <p className="text-gray-600 mb-3">
                    {topicInfo?.description || 'Học ngữ pháp tiếng Anh'}
                  </p>
                  
                  {/* Progress */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="font-medium text-gray-700">Tiến độ</span>
                        <span className="text-blue-600 font-semibold">{completionPercentage}%</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-semibold">
                        <BookOpen className="w-4 h-4 inline mr-1" />
                        {summary.completedLessons}/{summary.totalLessons}
                      </div>
                      <div className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg font-semibold">
                        <Zap className="w-4 h-4 inline mr-1 fill-amber-500" />
                        +{currentLesson?.xpReward || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LESSON CONTENT */}
            <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm p-8">
              {currentLesson ? (
                <>
                  {/* Lesson Header */}
                  <div className="border-b border-gray-200 pb-4 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        Bài {currentLesson.id}
                      </span>
                      {getStatusIcon(currentLesson.isCompleted ? 'completed' : 'new')}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {currentLesson.title}
                    </h2>
                    
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm text-amber-600 font-semibold">
                        <Zap className="w-4 h-4 fill-amber-500" />
                        +{currentLesson.xpReward} XP
                      </div>
                      {currentLesson.isActive && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          Đang hoạt động
                        </span>
                      )}
                      {currentLesson.isCompleted && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          Đã hoàn thành
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Lesson Content */}
                  <div 
                    className="lesson-content max-w-none"
                    dangerouslySetInnerHTML={{ __html: getLessonContent(currentLesson).theory }}
                  />

                  {/* Action Buttons */}
                  <div className="space-y-4 mt-8 pt-6 border-t border-gray-200">
                    {/* Exercise Buttons - Show when lesson is completed */}
                    {currentLesson?.isCompleted && exerciseTypes.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {exerciseTypes.map((type) => {
                          // Determine route and styling based on exercise type
                          const getExerciseConfig = (typeName) => {
                            switch (typeName.toLowerCase()) {
                              case 'multiple choice':
                                return {
                                  route: 'multiple-choice',
                                  gradient: 'from-purple-600 to-pink-600',
                                  hoverGradient: 'hover:from-purple-700 hover:to-pink-700',
                                  icon: Target,
                                  label: 'Bài tập trắc nghiệm',
                                  subtitle: 'Multiple Choice'
                                };
                              case 'fill in the blank':
                                return {
                                  route: 'fill-blank',
                                  gradient: 'from-green-600 to-teal-600',
                                  hoverGradient: 'hover:from-green-700 hover:to-teal-700',
                                  icon: FileText,
                                  label: 'Bài tập điền từ',
                                  subtitle: 'Fill in the Blank'
                                };
                              default:
                                return {
                                  route: type.name.toLowerCase().replace(/\s+/g, '-'),
                                  gradient: 'from-blue-600 to-indigo-600',
                                  hoverGradient: 'hover:from-blue-700 hover:to-indigo-700',
                                  icon: BookOpen,
                                  label: type.name,
                                  subtitle: type.description
                                };
                            }
                          };

                          const config = getExerciseConfig(type.name);
                          const Icon = config.icon;

                          return (
                            <Link
                              key={type.id}
                              to={`/grammar/${topicId}/exercises/${config.route}?lesson_id=${currentLesson.id}`}
                              className={`flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r ${config.gradient} text-white rounded-lg font-bold ${config.hoverGradient} transition-all shadow-lg hover:shadow-xl`}
                            >
                              <Icon className="w-5 h-5" />
                              <div className="text-left">
                                <div>{config.label}</div>
                                <div className="text-xs opacity-90">
                                  {config.subtitle} {type.totalQuestions > 0 && `(${type.totalQuestions} câu)`}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                    
                    {/* Show message if lesson is completed but no exercises available */}
                    {currentLesson?.isCompleted && exerciseTypes.length === 0 && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                        <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 text-sm">Chưa có bài tập cho bài học này</p>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => {
                          const currentIndex = lessons.findIndex(l => l.id === selectedLesson);
                          if (currentIndex > 0) {
                            setSelectedLesson(lessons[currentIndex - 1].id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        disabled={lessons.findIndex(l => l.id === selectedLesson) === 0}
                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowRight className="w-5 h-5 inline mr-2 rotate-180" />
                        Bài trước
                      </button>
                      <button 
                        onClick={handleCompleteLesson}
                        disabled={completingLesson || currentLesson?.isCompleted}
                        className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                          currentLesson?.isCompleted
                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {completingLesson ? (
                          <>
                            <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : currentLesson?.isCompleted ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 inline mr-2" />
                            Đã hoàn thành
                          </>
                        ) : (
                          <>
                            Hoàn thành bài học
                            <Award className="w-5 h-5 inline ml-2" />
                          </>
                        )}
                      </button>
                      <button 
                        onClick={() => {
                          const currentIndex = lessons.findIndex(l => l.id === selectedLesson);
                          if (currentIndex < lessons.length - 1) {
                            setSelectedLesson(lessons[currentIndex + 1].id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        disabled={lessons.findIndex(l => l.id === selectedLesson) === lessons.length - 1}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Bài tiếp theo
                        <ArrowRight className="w-5 h-5 inline ml-2" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Vui lòng chọn một bài học để xem nội dung</p>
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR - LESSONS LIST */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900">Danh sách bài học</h3>
                </div>
                
                <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {lessons.map((lesson, index) => {
                    const isActive = lesson.id === selectedLesson;
                    const status = getLessonStatus(lesson);
                    
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-50 border-2 border-blue-500'
                            : 'border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Status Icon */}
                          <div className="mt-0.5">
                            {getStatusIcon(status, 'w-5 h-5')}
                          </div>
                          
                          {/* Lesson Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-semibold ${
                                isActive ? 'text-blue-600' : 'text-gray-500'
                              }`}>
                                Bài {lesson.id}
                              </span>
                            </div>
                            <h4 className={`text-sm font-semibold mb-1 ${
                              isActive ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {lesson.title}
                            </h4>
                            
                            {/* XP */}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                                <Zap className="w-3 h-3 fill-amber-500" />
                                +{lesson.xpReward}
                              </span>
                              {lesson.isActive && (
                                <span className="text-xs text-green-600 font-semibold">
                                  Đang hoạt động
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border-2 border-blue-200 p-4">
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-600" />
                  Thống kê
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Đã hoàn thành:</span>
                    <span className="font-bold text-green-600">
                      {summary.completedLessons}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Đang học:</span>
                    <span className="font-bold text-blue-600">
                      {summary.inProgress}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chưa học:</span>
                    <span className="font-bold text-gray-600">
                      {summary.notStarted}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrammarDetailPage;
