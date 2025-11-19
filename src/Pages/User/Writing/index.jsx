import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import WritingSidebar from './components/WritingSidebar';
import WritingEditor from './components/WritingEditor';
import ScoreSidebar from './components/ScoreSidebar';
import * as writingService from '../../../service/writingService';

const WritingPage = () => {
  // State cho Topics, Tasks, Prompts hierarchy
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [currentWriting, setCurrentWriting] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Lấy userId từ localStorage
  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  // Load topics khi component mount
  useEffect(() => {
    loadTopics();
  }, []);

  // Load topics từ API
  const loadTopics = async () => {
    setLoading(true);
    try {
      const topicsData = await writingService.getAllTopics();
      setTopics(topicsData);
    } catch (error) {
      console.error('Error loading topics:', error);
      toast.error('Không thể tải danh sách chủ đề. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Handle chọn Topic
  const handleSelectTopic = async (topic) => {
    // Nếu topic là null, reset về danh sách topics
    if (!topic) {
      setSelectedTopic(null);
      setSelectedTask(null);
      setTasks([]);
      setPrompts([]);
      setCurrentWriting(null);
      return;
    }
    
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
      toast.error('Không thể tải danh sách bài tập. Vui lòng thử lại!');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle chọn Task
  const handleSelectTask = async (task) => {
    // Nếu task là null, reset về danh sách tasks
    if (!task) {
      setSelectedTask(null);
      setPrompts([]);
      setCurrentWriting(null);
      return;
    }
    
    setSelectedTask(task);
    
    if (!userId) {
      toast.error('Vui lòng đăng nhập để tiếp tục!');
      return;
    }
    
    setLoading(true);
    try {
      const promptsData = await writingService.getPromptsByTaskId(task.id, userId);
      setPrompts(promptsData);
      
      // CHỈ load prompts, KHÔNG tự động chọn prompt
      // User sẽ click vào prompt để xem
    } catch (error) {
      console.error('Error loading prompts:', error);
      toast.error('Không thể tải bài viết. Vui lòng thử lại!');
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle chọn Prompt (khi click vào một bài viết cụ thể)
  const handleSelectPrompt = (prompt) => {
    setCurrentWriting({
      ...prompt,
      question: selectedTask.question,
      writingTips: selectedTask.writingTips,
      xpReward: selectedTask.xpReward,
    });
  };

  // Handle tạo bài viết mới cho task
  const handleCreateNewWriting = () => {
    if (!selectedTask) return;
    
    setCurrentWriting({
      id: null,
      taskId: selectedTask.id,
      mode: 'PROMPT',
      userContent: '',
      wordCount: 0,
      timeSpent: 0,
      isCompleted: false,
      question: selectedTask.question,
      writingTips: selectedTask.writingTips,
      xpReward: selectedTask.xpReward,
    });
  };

  // Save writing (draft) - CHỈ CẬP NHẬT STATE LOCAL
  const handleSaveWriting = async (writingData) => {
    // Vì chưa có API save/create, chỉ update state local
    setCurrentWriting(prev => ({
      ...prev,
      ...writingData,
    }));
    toast.success('Đã lưu bản nháp (local)!');
  };

  // Submit writing - CHỈ CẬP NHẬT STATE LOCAL
  const handleSubmitWriting = async (writingData) => {
    // Mock AI evaluation (vì chưa có API submit)
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
      ...writingData,
      ...mockScores,
      overallScore,
      isCompleted: true,
      aiFeedback: `Bài viết của bạn đạt ${overallScore} điểm. Điểm ngữ pháp: ${mockScores.grammarScore}/100, Từ vựng: ${mockScores.vocabularyScore}/100, Mạch lạc: ${mockScores.coherenceScore}/100. Bạn đã làm tốt! Hãy tiếp tục luyện tập để cải thiện kỹ năng viết.`,
      submittedAt: new Date().toISOString(),
    };

    setCurrentWriting(updatedWriting);
    toast.success('Đã nộp bài thành công (mock)!');
  };

  // Start free writing mode (optional)
  const handleStartFreeWriting = () => {
    setSelectedTopic(null);
    setSelectedTask(null);
    setPrompts([]);
    setCurrentWriting({
      id: null,
      taskId: null,
      mode: 'FREE',
      userContent: '',
      wordCount: 0,
      timeSpent: 0,
      isCompleted: false,
      question: 'Viết về bất kỳ chủ đề nào bạn muốn. Thể hiện sự sáng tạo của bạn!',
      writingTips: 'Đây là chế độ viết tự do. Bạn có thể viết về bất kỳ chủ đề gì bạn muốn!',
      xpReward: 50,
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <WritingSidebar
        topics={topics}
        selectedTopic={selectedTopic}
        tasks={tasks}
        selectedTask={selectedTask}
        prompts={prompts}
        onSelectTopic={handleSelectTopic}
        onSelectTask={handleSelectTask}
        onSelectPrompt={handleSelectPrompt}
        onCreateNewWriting={handleCreateNewWriting}
        onStartFreeWriting={handleStartFreeWriting}
        loading={loading}
      />
      <WritingEditor
        currentWriting={currentWriting}
        onSave={handleSaveWriting}
        onSubmit={handleSubmitWriting}
        loading={loading}
      />
      <ScoreSidebar 
        currentWriting={currentWriting}
        grammarSuggestions={
          currentWriting?.grammarSuggestions 
            ? writingService.parseGrammarSuggestions(currentWriting.grammarSuggestions)
            : []
        }
        vocabularySuggestions={
          currentWriting?.vocabularySuggestions
            ? writingService.parseVocabularySuggestions(currentWriting.vocabularySuggestions)
            : []
        }
      />
    </div>
  );
};

export default WritingPage;
