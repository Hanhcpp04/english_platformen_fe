import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { BookOpen, ChevronRight, Edit3, Send, Clock, FileText, Award, Check, CheckCircle, Loader } from 'lucide-react';
import * as writingService from '../../../service/writingService';

const WritingPage = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [currentWriting, setCurrentWriting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    if (currentWriting) {
      setContent(currentWriting.userContent || '');
      setTimeSpent(currentWriting.timeSpent || 0);
    } else {
      setContent('');
      setTimeSpent(0);
    }
  }, [currentWriting]);

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  // Timer
  useEffect(() => {
    if (currentWriting && content.length > 0 && !currentWriting.isCompleted) {
      const timer = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentWriting, content]);

  const loadTopics = async () => {
    setLoading(true);
    try {
      const topicsData = await writingService.getAllTopics();
      setTopics(topicsData);
    } catch (error) {
      console.error('Error loading topics:', error);
      toast.error('Không thể tải danh sách chủ đề');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTopic = async (topic) => {
    setSelectedTopic(topic);
    setSelectedTask(null);
    setPrompts([]);
    setCurrentWriting(null);
    
    setLoading(true);
    try {
      const tasksData = await writingService.getTasksByTopicId(topic.id);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Không thể tải danh sách bài tập');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTask = async (task) => {
    setSelectedTask(task);
    
    if (!userId) {
      toast.error('Vui lòng đăng nhập!');
      return;
    }
    
    setLoading(true);
    try {
      const promptsData = await writingService.getPromptsByTaskId(task.id, userId);
      setPrompts(promptsData);
      
      // Tự động tạo bài viết mới
      setCurrentWriting({
        id: null,
        taskId: task.id,
        mode: 'PROMPT',
        userContent: '',
        wordCount: 0,
        timeSpent: 0,
        isCompleted: false,
        question: task.question,
        writingTips: task.writingTips,
        xpReward: task.xpReward,
      });
    } catch (error) {
      console.error('Error loading prompts:', error);
      toast.error('Không thể tải bài viết');
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPrompt = (prompt) => {
    setCurrentWriting({
      ...prompt,
      question: selectedTask.question,
      writingTips: selectedTask.writingTips,
      xpReward: selectedTask.xpReward,
    });
  };

  const handleSubmit = async () => {
    if (!currentWriting || !content.trim()) {
      toast.warning('Vui lòng viết nội dung trước khi nộp bài');
      return;
    }

    if (wordCount < 50) {
      toast.warning('Bài viết cần ít nhất 50 từ');
      return;
    }

    setIsSubmitting(true);
    try {
      const mockScores = {
        grammarScore: Math.floor(Math.random() * 20) + 75,
        vocabularyScore: Math.floor(Math.random() * 20) + 70,
        coherenceScore: Math.floor(Math.random() * 20) + 75,
      };
      
      const overallScore = Math.round(
        (mockScores.grammarScore + mockScores.vocabularyScore + mockScores.coherenceScore) / 3
      );

      const updatedWriting = {
        ...currentWriting,
        userContent: content,
        wordCount,
        timeSpent,
        ...mockScores,
        overallScore,
        isCompleted: true,
        aiFeedback: `Bài viết của bạn đạt ${overallScore} điểm. Điểm ngữ pháp: ${mockScores.grammarScore}/100, Từ vựng: ${mockScores.vocabularyScore}/100, Mạch lạc: ${mockScores.coherenceScore}/100. Bạn đã làm tốt!`,
        submittedAt: new Date().toISOString(),
      };

      setCurrentWriting(updatedWriting);
      toast.success('Đã nộp bài thành công!');
    } catch (error) {
      toast.error('Lỗi khi nộp bài');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (selectedTask) {
      setSelectedTask(null);
      setCurrentWriting(null);
    } else if (selectedTopic) {
      setSelectedTopic(null);
      setTasks([]);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Edit3 className="w-10 h-10 text-blue-600" />
            Luyện viết
          </h1>
          <p className="text-gray-600">Chọn chủ đề và bắt đầu luyện tập kỹ năng viết của bạn</p>
        </div>

        {/* Breadcrumb */}
        {(selectedTopic || selectedTask) && (
          <div className="mb-6 flex items-center gap-2 text-sm">
            <button 
              onClick={handleBack}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Quay lại
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {selectedTopic && <span className="text-gray-600">{selectedTopic.name}</span>}
            {selectedTask && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 font-medium">Đang viết bài</span>
              </>
            )}
          </div>
        )}

        {/* Content Area */}
        {!selectedTopic ? (
          // Topics List
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Chọn chủ đề ({topics.length})
            </h2>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleSelectTopic(topic)}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-blue-500 text-left group"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                      {topic.name}
                    </h3>
                    {topic.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{topic.description}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : !selectedTask ? (
          // Tasks List
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Chọn bài tập ({tasks.length})
            </h2>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => handleSelectTask(task)}
                    className="w-full bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-blue-500 text-left group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-gray-900 font-medium group-hover:text-blue-600 flex-1">
                        {task.question}
                      </p>
                      <div className="flex items-center gap-1 text-yellow-600 font-semibold bg-yellow-50 px-3 py-1 rounded-full">
                        <Award className="w-4 h-4" />
                        {task.xpReward} XP
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Writing Area
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Writing Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <h2 className="text-2xl font-bold mb-2">{currentWriting?.question}</h2>
              <div className="flex items-center gap-6 text-blue-100">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {wordCount} từ
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {formatTime(timeSpent)}
                </span>
                {currentWriting?.xpReward && (
                  <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                    <Award className="w-4 h-4" />
                    {currentWriting.xpReward} XP
                  </span>
                )}
              </div>
            </div>

            {/* Writing Tips */}
            {currentWriting?.writingTips && !currentWriting.isCompleted && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 m-6">
                <h3 className="font-semibold text-yellow-900 mb-2">💡 Gợi ý viết bài</h3>
                <p className="text-sm text-yellow-800 whitespace-pre-line">{currentWriting.writingTips}</p>
              </div>
            )}

            {/* Editor */}
            <div className="p-6">
              {currentWriting?.isCompleted ? (
                <>
                  {/* Result Display */}
                  <div className="mb-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h3 className="text-xl font-bold text-gray-900">Kết quả chấm điểm</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                      {/* Overall Score */}
                      <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                        <div className="text-4xl font-bold text-blue-600 mb-1">
                          {currentWriting.overallScore}
                        </div>
                        <div className="text-sm text-gray-600">Tổng điểm</div>
                      </div>
                      
                      {/* Grammar */}
                      <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                        <div className="text-3xl font-bold text-green-600 mb-1">
                          {currentWriting.grammarScore}
                        </div>
                        <div className="text-sm text-gray-600">Ngữ pháp</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className={`h-2 rounded-full ${getScoreColor(currentWriting.grammarScore)}`}
                            style={{ width: `${currentWriting.grammarScore}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Vocabulary */}
                      <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                        <div className="text-3xl font-bold text-purple-600 mb-1">
                          {currentWriting.vocabularyScore}
                        </div>
                        <div className="text-sm text-gray-600">Từ vựng</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className={`h-2 rounded-full ${getScoreColor(currentWriting.vocabularyScore)}`}
                            style={{ width: `${currentWriting.vocabularyScore}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Coherence */}
                      <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                        <div className="text-3xl font-bold text-orange-600 mb-1">
                          {currentWriting.coherenceScore}
                        </div>
                        <div className="text-sm text-gray-600">Mạch lạc</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className={`h-2 rounded-full ${getScoreColor(currentWriting.coherenceScore)}`}
                            style={{ width: `${currentWriting.coherenceScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* AI Feedback */}
                    {currentWriting.aiFeedback && (
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-2">📝 Nhận xét của AI</h4>
                        <p className="text-gray-700 leading-relaxed">{currentWriting.aiFeedback}</p>
                      </div>
                    )}
                  </div>

                  {/* Content Display (Read-only) */}
                  <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
                    <h4 className="font-semibold text-gray-700 mb-3">Bài viết của bạn</h4>
                    <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {content || 'Không có nội dung'}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Bắt đầu viết bài của bạn ở đây..."
                    className="w-full h-96 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base leading-relaxed"
                  />
                  
                  {/* Submit Button */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {wordCount < 50 && (
                        <span className="text-yellow-600 font-medium">
                          ⚠️ Cần ít nhất 50 từ để nộp bài (còn {50 - wordCount} từ)
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !content.trim() || wordCount < 50}
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-lg shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Đang nộp...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Nộp bài
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* My Submissions */}
            {prompts.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-4">📚 Bài viết đã làm ({prompts.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {prompts.map((prompt, index) => (
                    <button
                      key={prompt.id}
                      onClick={() => handleSelectPrompt(prompt)}
                      className={`text-left p-4 rounded-lg border-2 transition-all ${
                        prompt.isCompleted
                          ? 'bg-white border-green-200 hover:border-green-400'
                          : 'bg-white border-gray-200 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">Bài #{index + 1}</span>
                        {prompt.isCompleted ? (
                          <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                            <Check className="w-3 h-3" />
                            {prompt.overallScore} điểm
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                            Nháp
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {prompt.userContent.substring(0, 80)}...
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WritingPage;
