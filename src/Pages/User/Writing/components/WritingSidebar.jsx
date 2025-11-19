import React, { useState } from 'react';
import { Edit3, FileText, Award, Plus, Check, ChevronDown, ChevronRight, BookOpen, ListChecks, BarChart3 } from 'lucide-react';

const WritingSidebar = ({ 
  topics = [], 
  selectedTopic, 
  tasks = [], 
  selectedTask, 
  prompts = [],
  onSelectTopic, 
  onSelectTask, 
  onSelectPrompt,
  onCreateNewWriting,
  onStartFreeWriting, 
  loading 
}) => {
  const [expandedTopics, setExpandedTopics] = useState({});
  const [expandedTasks, setExpandedTasks] = useState({});

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const toggleTask = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  // Load tasks khi expand topic
  const handleExpandTopic = async (topic) => {
    toggleTopic(topic.id);
    if (!expandedTopics[topic.id]) {
      await onSelectTopic(topic);
    }
  };

  // Load prompts khi expand task
  const handleExpandTask = async (task) => {
    toggleTask(task.id);
    if (!expandedTasks[task.id]) {
      await onSelectTask(task);
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-blue-600" />
          Luyện viết
        </h2>
        <p className="text-sm text-gray-500 mt-1">Chọn chủ đề và bài tập</p>
      </div>

      {/* Free Writing Button */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onStartFreeWriting}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Viết tự do
        </button>
      </div>

      {/* Content with Dropdown Hierarchy */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-16 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="p-4">
            <div className="text-xs font-medium text-gray-500 uppercase mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Chủ đề ({topics.length})
            </div>
            
            {topics.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chưa có chủ đề</p>
              </div>
            ) : (
              <div className="space-y-2">
                {topics.map((topic) => (
                  <div key={topic.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Topic Header */}
                    <div
                      className={`p-3 cursor-pointer transition-colors ${
                        selectedTopic?.id === topic.id
                          ? 'bg-blue-50 border-l-4 border-l-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleExpandTopic(topic)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          {expandedTopics[topic.id] ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                          <h4 className="text-sm font-medium text-gray-900">
                            {topic.name}
                          </h4>
                        </div>
                        {selectedTopic?.id === topic.id && tasks.length > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {tasks.length} bài
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Tasks Dropdown */}
                    {expandedTopics[topic.id] && selectedTopic?.id === topic.id && (
                      <div className="bg-gray-50 border-t border-gray-200">
                        {tasks.length === 0 ? (
                          <div className="p-4 text-center text-sm text-gray-400">
                            Chưa có bài tập
                          </div>
                        ) : (
                          <div className="p-2 space-y-1">
                            {tasks.map((task) => (
                              <div key={task.id} className="bg-white rounded border border-gray-200">
                                {/* Task Header */}
                                <div
                                  className={`p-2.5 cursor-pointer transition-colors ${
                                    selectedTask?.id === task.id
                                      ? 'bg-green-50'
                                      : 'hover:bg-gray-50'
                                  }`}
                                  onClick={() => handleExpandTask(task)}
                                >
                                  <div className="flex items-start gap-2">
                                    {expandedTasks[task.id] ? (
                                      <ChevronDown className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs text-gray-700 line-clamp-2">
                                        {task.question}
                                      </p>
                                      <div className="flex items-center gap-1 mt-1 text-xs text-yellow-600 font-medium">
                                        <Award className="w-3 h-3" />
                                        {task.xpReward} XP
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Prompts Dropdown */}
                                {expandedTasks[task.id] && selectedTask?.id === task.id && (
                                  <div className="bg-gray-50 border-t border-gray-200">
                                    {/* Nút viết bài mới */}
                                    <div className="p-2">
                                      <button
                                        onClick={onCreateNewWriting}
                                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
                                      >
                                        <Plus className="w-3 h-3" />
                                        Viết bài mới
                                      </button>
                                    </div>

                                    {prompts.length === 0 ? (
                                      <div className="p-3 text-center text-xs text-gray-400">
                                        Chưa có bài viết nào
                                      </div>
                                    ) : (
                                      <div className="p-2 space-y-1.5">
                                        {prompts.map((prompt, index) => (
                                          <div
                                            key={prompt.id}
                                            onClick={() => onSelectPrompt(prompt)}
                                            className={`bg-white p-2.5 rounded border cursor-pointer transition-all ${
                                              prompt.isCompleted
                                                ? 'border-green-200 hover:border-green-400 hover:bg-green-50'
                                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                            }`}
                                          >
                                            {/* Header với số thứ tự và trạng thái */}
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                              <div className="flex items-center gap-2">
                                                <span className={`text-xs font-semibold ${
                                                  prompt.isCompleted ? 'text-green-600' : 'text-gray-500'
                                                }`}>
                                                  Bài #{index + 1}
                                                </span>
                                                {prompt.isCompleted ? (
                                                  <div className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded-full">
                                                    <Check className="w-3 h-3 text-green-600" />
                                                    <span className="text-xs font-medium text-green-700">
                                                      Hoàn thành
                                                    </span>
                                                  </div>
                                                ) : (
                                                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-0.5 rounded-full">
                                                    <span className="text-xs font-medium text-yellow-700">
                                                      Chưa nộp
                                                    </span>
                                                  </div>
                                                )}
                                              </div>
                                              <span className="text-xs text-gray-500">
                                                {new Date(prompt.createdAt).toLocaleDateString('vi-VN')}
                                              </span>
                                            </div>

                                            {/* Preview nội dung */}
                                            <p className="text-xs text-gray-700 line-clamp-2 mb-2">
                                              {prompt.userContent.substring(0, 60)}...
                                            </p>
                                            
                                            {/* Điểm số chi tiết - CHỈ hiển thị khi đã hoàn thành */}
                                            {prompt.isCompleted && prompt.overallScore ? (
                                              <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
                                                <div className="flex items-center justify-between text-xs">
                                                  <span className="text-gray-600 font-medium">Tổng điểm:</span>
                                                  <span className="font-bold text-blue-600">
                                                    {prompt.overallScore}/100
                                                  </span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 text-xs">
                                                  <div className="text-center">
                                                    <div className="text-gray-500 mb-0.5">Ngữ pháp</div>
                                                    <div className="font-medium text-green-600">
                                                      {prompt.grammarScore}
                                                    </div>
                                                  </div>
                                                  <div className="text-center">
                                                    <div className="text-gray-500 mb-0.5">Từ vựng</div>
                                                    <div className="font-medium text-purple-600">
                                                      {prompt.vocabularyScore}
                                                    </div>
                                                  </div>
                                                  <div className="text-center">
                                                    <div className="text-gray-500 mb-0.5">Mạch lạc</div>
                                                    <div className="font-medium text-orange-600">
                                                      {prompt.coherenceScore}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            ) : (
                                              /* Hiển thị thông tin cơ bản cho bài chưa nộp */
                                              <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-gray-200">
                                                <span className="text-gray-500">
                                                  {prompt.wordCount} từ
                                                </span>
                                                <span className="text-yellow-600 font-medium">
                                                  Đang soạn thảo
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <div className="text-xl font-bold text-blue-600">
              {(topics || []).length}
            </div>
            <div className="text-gray-600 mt-0.5">Chủ đề</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-600">
              {(prompts || []).filter(p => p.isCompleted).length}
            </div>
            <div className="text-gray-600 mt-0.5">Hoàn thành</div>
          </div>
          <div>
            <div className="text-xl font-bold text-purple-600">
              {(prompts || []).reduce((sum, p) => sum + (p.overallScore || 0), 0) > 0
                ? Math.round((prompts || []).reduce((sum, p) => sum + (p.overallScore || 0), 0) / (prompts || []).filter(p => p.overallScore).length)
                : 0}
            </div>
            <div className="text-gray-600 mt-0.5">TB Điểm</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingSidebar;
