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
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center max-w-md">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Chọn đề bài để bắt đầu</h3>
          <p className="text-gray-600">
            Chọn một đề bài từ danh sách hoặc bắt đầu viết tự do
          </p>
        </div>
      </div>
    );
  }

  const isCompleted = currentWriting?.isCompleted || currentWriting?.is_completed;
  const title = currentWriting?.title || currentWriting?.question || 'Bài viết';

  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
      {/* Header - simplified */}
      <div className="border-b border-gray-200 px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <h2 className="text-base font-medium text-gray-900">{title}</h2>

            {isCompleted && (
              <span className="flex items-center gap-1 px-2 py-0.5 text-gray-600 rounded text-xs font-medium flex-shrink-0">
                <CheckCircle className="w-3 h-3 text-gray-600" />
                Hoàn thành
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs flex-shrink-0">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-semibold text-blue-600">{wordCount}</span>
              <span className="text-gray-500">từ</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-green-500" />
              <span className="font-semibold text-green-600">{formatTime(timeSpent)}</span>
            </span>
            {isCompleted && currentWriting.overallScore && (
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                <span className="font-bold text-lg text-green-600">{currentWriting.overallScore}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - simplified info area */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-3 space-y-2 border-b border-gray-200">
          {currentWriting.question && (
            <div className="p-2 rounded text-sm text-gray-800">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-gray-500 mt-0.5" />
                <div className="min-w-0 flex-1 text-gray-700">
                  <span className="font-medium">Yêu cầu: </span>
                  <span>{currentWriting.question}</span>
                </div>
              </div>
            </div>
          )}

          {(currentWriting.writingTips || currentWriting.writing_tips) && !isCompleted && (
            <details className="p-2 rounded text-sm text-gray-700">
              <summary className="cursor-pointer font-medium text-gray-800">
                Gợi ý viết bài
              </summary>
              <div className="mt-2 text-sm text-gray-700">
                {currentWriting.writingTips || currentWriting.writing_tips}
              </div>
            </details>
          )}

          {isCompleted && (
            <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-800">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {currentWriting.overallScore}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">Điểm tổng</div>
                  {currentWriting.xpReward && (
                    <div className="mt-2 px-2 py-1 bg-amber-50 rounded-full">
                      <span className="text-xs font-bold text-amber-600">
                        +{currentWriting.xpReward} XP
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2 min-w-0">
                  {/* Replace colorful bars with simple labels */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Ngữ pháp</span>
                    <span className="text-base font-bold text-green-600">{currentWriting.grammarScore}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Từ vựng</span>
                    <span className="text-base font-bold text-purple-600">{currentWriting.vocabularyScore}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Mạch lạc</span>
                    <span className="text-base font-bold text-orange-600">{currentWriting.coherenceScore}</span>
                  </div>
                </div>
              </div>

              {currentWriting.aiFeedback && (
                <details className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-700">
                  <summary className="cursor-pointer font-medium text-gray-800">
                    Nhận xét của AI
                  </summary>
                  <p className="mt-2 text-sm text-gray-700">
                    {currentWriting.aiFeedback}
                  </p>
                </details>
              )}
            </div>
          )}
        </div>

        {/* Editor Area */}
        <div className="p-4">
          {isCompleted ? (
            <div className="w-full min-h-[300px] max-h-[400px] overflow-y-auto p-3 border border-gray-200 rounded-lg bg-white">
              <div className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
                {content || 'Không có nội dung'}
              </div>
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Bắt đầu viết bài của bạn..."
              className="w-full h-[300px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 resize-none text-sm leading-relaxed text-gray-800 bg-white"
            />
          )}
        </div>
      </div>

      {/* Footer Actions - minimal */}
      <div className="border-t border-gray-200 px-4 py-2 flex-shrink-0 bg-white">
        {!isCompleted ? (
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs flex-shrink-0">
              {wordCount < 50 && (
                <span className="font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
                  ⚠️ Cần ít nhất 50 từ (còn {50 - wordCount})
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving || !content.trim() || loading}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm bg-white"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'Đang lưu...' : 'Lưu'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !content.trim() || wordCount < 50 || loading}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors text-sm font-semibold shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 justify-center bg-green-50 py-2 rounded">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">Bài viết đã hoàn thành</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WritingEditor;
