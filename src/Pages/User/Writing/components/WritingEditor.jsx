import React, { useState, useEffect } from 'react';
import { Save, Send, Clock, FileText, CheckCircle, Info } from 'lucide-react';
import { toast } from 'react-toastify';

const WritingEditor = ({ currentWriting, onSave, onSubmit, loading }) => {
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentWriting) {
      setContent(currentWriting.userContent || currentWriting.user_content || '');
      setTimeSpent(currentWriting.timeSpent || currentWriting.time_spent || 0);
    } else {
      setContent('');
      setTimeSpent(0);
    }
  }, [currentWriting]);

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  // Timer to track time spent
  useEffect(() => {
    const isCompleted = currentWriting?.isCompleted || currentWriting?.is_completed;
    if (currentWriting && content.length > 0 && !isCompleted) {
      const timer = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentWriting, content]);

  const handleSave = async () => {
    if (!currentWriting) return;
    
    setIsSaving(true);
    try {
      await onSave({
        id: currentWriting.id,
        user_content: content,
        word_count: wordCount,
        time_spent: timeSpent
      });
      toast.success('Đã lưu bài viết');
    } catch (error) {
      toast.error('Lỗi khi lưu bài viết');
    } finally {
      setIsSaving(false);
    }
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
      await onSubmit({
        id: currentWriting.id,
        user_content: content,
        word_count: wordCount,
        time_spent: timeSpent
      });
      toast.success('Nộp bài thành công! Đang chấm điểm...');
    } catch (error) {
      toast.error('Lỗi khi nộp bài');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentWriting) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Chọn đề bài để bắt đầu</h3>
          <p className="text-gray-500">
            Chọn một đề bài từ danh sách bên trái hoặc bắt đầu viết tự do
          </p>
        </div>
      </div>
    );
  }

  const isCompleted = currentWriting?.isCompleted || currentWriting?.is_completed;
  const title = currentWriting?.title || currentWriting?.question || 'Bài viết';

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              {currentWriting.mode === 'FREE' && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  Tự do
                </span>
              )}
              {isCompleted && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                  <CheckCircle className="w-3 h-3" />
                  Hoàn thành
                </span>
              )}
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {wordCount} từ
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(timeSpent)}
              </span>
              {isCompleted && currentWriting.submittedAt && (
                <span className="text-xs text-gray-400">
                  Nộp lúc: {new Date(currentWriting.submittedAt).toLocaleString('vi-VN')}
                </span>
              )}
            </div>
          </div>

        </div>
        
        {/* Grid Layout: Question/Tips + Scores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column: Question/Tips/Feedback */}
          <div className="space-y-3">
            {/* Question */}
            {currentWriting.question && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900 mb-1">Yêu cầu đề bài</h3>
                    <p className="text-sm text-blue-800 leading-relaxed">{currentWriting.question}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Writing Tips - Chỉ hiển thị khi chưa hoàn thành */}
            {(currentWriting.writingTips || currentWriting.writing_tips) && !isCompleted && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <h3 className="text-sm font-medium text-yellow-900 mb-2">Gợi ý viết bài</h3>
                <div className="text-sm text-yellow-800 whitespace-pre-line leading-relaxed">
                  {currentWriting.writingTips || currentWriting.writing_tips}
                </div>
              </div>
            )}

            {/* AI Feedback - Chỉ hiển thị khi đã hoàn thành */}
            {isCompleted && currentWriting.aiFeedback && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <h3 className="text-sm font-medium text-green-900 mb-2">Nhận xét của AI</h3>
                <p className="text-sm text-green-800 leading-relaxed">
                  {currentWriting.aiFeedback}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Scores - Chỉ hiển thị khi đã hoàn thành */}
          {isCompleted && currentWriting.overallScore && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Kết quả chấm điểm
              </h3>
              
              {/* Overall Score - Lớn ở giữa */}
              <div className="text-center mb-4 pb-4 border-b border-blue-200">
                <div className="text-5xl font-bold text-blue-600 mb-1">
                  {currentWriting.overallScore}
                </div>
                <div className="text-sm text-gray-600 font-medium">Điểm tổng</div>
              </div>

              {/* Detailed Scores */}
              <div className="space-y-3">
                {/* Grammar Score */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Ngữ pháp</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${currentWriting.grammarScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-green-600 w-12 text-right">
                      {currentWriting.grammarScore}
                    </span>
                  </div>
                </div>

                {/* Vocabulary Score */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Từ vựng</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full transition-all"
                        style={{ width: `${currentWriting.vocabularyScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-purple-600 w-12 text-right">
                      {currentWriting.vocabularyScore}
                    </span>
                  </div>
                </div>

                {/* Coherence Score */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Mạch lạc</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full transition-all"
                        style={{ width: `${currentWriting.coherenceScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-orange-600 w-12 text-right">
                      {currentWriting.coherenceScore}
                    </span>
                  </div>
                </div>
              </div>

              {/* XP Reward */}
              {currentWriting.xpReward && (
                <div className="mt-4 pt-4 border-t border-blue-200 text-center">
                  <div className="inline-flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
                    <span className="text-sm font-bold text-yellow-700">
                      +{currentWriting.xpReward} XP
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Editor - Chế độ xem hoặc chỉnh sửa */}
      <div className="flex-1 overflow-y-auto p-6">
        {isCompleted ? (
          // Chế độ xem (read-only)
          <div className="w-full h-full min-h-[400px] p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-300">
              <Info className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 font-medium">
                Chế độ xem (Không thể chỉnh sửa)
              </span>
            </div>
            <div className="text-base leading-relaxed text-gray-800 whitespace-pre-wrap">
              {content || 'Không có nội dung'}
            </div>
          </div>
        ) : (
          // Chế độ chỉnh sửa
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Bắt đầu viết bài của bạn..."
            className="w-full h-full min-h-[400px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base leading-relaxed"
          />
        )}
      </div>

      {/* Action Buttons hoặc Thông tin bài đã nộp */}
      {!isCompleted ? (
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {wordCount < 50 && (
              <span className="text-yellow-600">Cần ít nhất 50 từ để nộp bài</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving || !content.trim() || loading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Đang lưu...' : 'Lưu nháp'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim() || wordCount < 50 || loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
            </button>
          </div>
        </div>
      ) : (
        <div className="border-t border-gray-200 px-6 py-4 bg-green-50">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Bài viết đã hoàn thành và được chấm điểm</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WritingEditor;
