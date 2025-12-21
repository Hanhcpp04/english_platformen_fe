import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import {
  BookOpen,
  Edit3,
  Award,
  Loader,
  ChevronRight,
  ArrowLeft,
  Plus,
  Home,
} from "lucide-react";
import * as writingService from "../../../service/writingService";
import WritingSidebar from "./components/WritingSidebar";
import WritingEditor from "./components/WritingEditor";

const WritingPage = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [currentWriting, setCurrentWriting] = useState(null);
  const [loading, setLoading] = useState(false);

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    setLoading(true);
    try {
      const topicsData = await writingService.getAllTopics();
      setTopics(topicsData);
    } catch (error) {
      console.error("Error loading topics:", error);
      toast.error("Không thể tải danh sách chủ đề");
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
      console.error("Error loading tasks:", error);
      toast.error("Không thể tải danh sách bài tập");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTask = async (task) => {
    setSelectedTask(task);

    if (!userId) {
      toast.error("Vui lòng đăng nhập!");
      return;
    }

    setLoading(true);
    try {
      const promptsData = await writingService.getPromptsByTaskId(
        task.id,
        userId
      );
      setPrompts(promptsData);
      setCurrentWriting(null);
    } catch (error) {
      console.error("Error loading prompts:", error);
      toast.error("Không thể tải bài viết");
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setSelectedTask(null);
    setTasks([]);
    setPrompts([]);
    setCurrentWriting(null);
  };

  const handleSelectPrompt = (prompt) => {
    setCurrentWriting({
      ...prompt,
      question: selectedTask.question,
      writingTips: selectedTask.writingTips,
      xpReward: selectedTask.xpReward,
    });
  };

  const handleCreateNewWriting = () => {
    if (!selectedTask) {
      toast.warning("Vui lòng chọn bài tập trước");
      return;
    }

    setCurrentWriting({
      id: null,
      taskId: selectedTask.id,
      mode: "PROMPT",
      user_content: "",
      word_count: 0,
      time_spent: 0,
      is_completed: false,
      question: selectedTask.question,
      writing_tips: selectedTask.writingTips,
      xp_reward: selectedTask.xpReward,
    });
  };

  const handleStartFreeWriting = () => {
    setCurrentWriting({
      id: null,
      mode: "FREE",
      user_content: "",
      word_count: 0,
      time_spent: 0,
      is_completed: false,
      question: "Viết tự do",
      writing_tips:
        "Hãy viết về bất cứ chủ đề gì bạn muốn. Thể hiện sự sáng tạo và phong cách viết của riêng bạn!",
    });
  };

  const handleSave = async (data) => {
    // Mock save API
    console.log("Saving writing:", data);
    // TODO: Implement actual API call
  };

  const handleSubmit = async (data) => {
    if (!userId) {
      toast.error("Vui lòng đăng nhập!");
      return;
    }

    setLoading(true);
    try {
      // Prepare request data
      const requestData = {
        taskId: currentWriting.taskId || null,
        content: data.user_content,
        mode: currentWriting.mode || "PROMPT",
        timeSpent: data.time_spent || 0,
      };

      console.log("=== Submitting Writing ===");
      console.log("User ID:", userId);
      console.log("Request Data:", requestData);

      // Call API to grade writing
      const response = await writingService.submitWriting(userId, requestData);

      console.log("=== API Response ===");
      console.log("Full Response:", response);

      // Extract result from API response
      // Check if response has 'result' property (wrapped response) or is direct data
      const result = response.result || response;

      // Update current writing with grading results
      const updatedWriting = {
        ...currentWriting,
        ...data,
        id: result.promptId,
        grammarScore: result.grammarScore,
        vocabularyScore: result.vocabularyScore,
        coherenceScore: result.coherenceScore,
        overallScore: result.overallScore,
        generalFeedback: result.generalFeedback,
        aiFeedback: result.generalFeedback, // Keep for backward compatibility
        grammarSuggestions: result.grammarSuggestions || [],
        vocabularySuggestions: result.vocabularySuggestions || [],
        wordCount: result.wordCount,
        xpEarned: result.xpEarned,
        is_completed: result.isCompleted,
        isCompleted: result.isCompleted,
        submittedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      setCurrentWriting(updatedWriting);

      // Update prompts list
      setPrompts((prev) => [...prev, updatedWriting]);

      toast.success(
        `Bài viết đã được chấm điểm! Điểm tổng: ${result.overallScore}/100 | XP: +${result.xpEarned}`
      );
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error(
        error.response?.data?.message ||
          "Không thể chấm điểm bài viết. Vui lòng thử lại!"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Nếu chưa chọn topic, hiển thị danh sách topics
  if (!selectedTopic) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1600px] mx-auto px-8 py-6">
          {/* BREADCRUMB */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link
              to="/dashboard"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Luyện viết</span>
          </div>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2.5">
                  <Edit3 className="w-7 h-7 text-blue-600" />
                  Luyện viết
                </h1>
                <p className="text-gray-600 text-sm">
                  Chọn chủ đề để bắt đầu luyện tập
                </p>
              </div>
            </div>
          </div>

          {/* Topics Grid */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gray-700" />
                Chủ đề
              </h2>
              <span className="text-xs text-gray-500">
                {topics.length} chủ đề
              </span>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader className="w-7 h-7 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleSelectTopic(topic)}
                    className="bg-white p-5 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all text-left group min-h-[120px] flex flex-col"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {topic.name}
                        </h3>
                      </div>
                    </div>
                    {topic.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed flex-1">
                        {topic.description}
                      </p>
                    )}
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span>Nhấn để xem bài tập</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Nếu đã chọn topic, hiển thị view với sidebar + editor
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleBackToTopics}
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Quay lại</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <h2 className="text-sm font-semibold text-gray-900">
            {selectedTopic.name}
          </h2>
        </div>
        
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Tasks List */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col overflow-hidden">
          <div className="px-3 py-2.5 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-900">Bài tập</h3>
              <span className="text-xs text-gray-500">{tasks.length}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2.5">
            {loading ? (
              <div className="space-y-1.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse h-14 bg-gray-200 rounded"
                  ></div>
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <BookOpen className="w-8 h-8 mx-auto mb-1.5 opacity-40" />
                <p className="text-xs">Chưa có bài tập</p>
              </div>
            ) : (
              <div className="space-y-1">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => handleSelectTask(task)}
                    className={`w-full text-left p-2 rounded border transition-all ${
                      selectedTask?.id === task.id
                        ? "bg-blue-50 border-blue-400 shadow-sm"
                        : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <p className="text-xs text-gray-900 font-medium line-clamp-2 mb-1 leading-snug">
                      {task.question}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                        <Award className="w-3 h-3" />
                        <span>{task.xpReward}</span>
                      </div>
                      {selectedTask?.id === task.id && prompts.length > 0 && (
                        <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-medium">
                          {prompts.filter((p) => p.isCompleted).length}/
                          {prompts.length}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Middle: Editor */}
        <WritingEditor
          currentWriting={currentWriting}
          onSave={handleSave}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {/* Right: Submissions Sidebar */}
        {selectedTask && (
          <WritingSidebar
            prompts={prompts}
            onSelectPrompt={handleSelectPrompt}
            onCreateNewWriting={handleCreateNewWriting}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default WritingPage;
