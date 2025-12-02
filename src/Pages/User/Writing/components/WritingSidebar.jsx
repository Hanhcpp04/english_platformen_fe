import React from 'react';
import { FileText, Plus, Check } from 'lucide-react';

const WritingSidebar = ({ 
  prompts = [],
  onSelectPrompt,
  onCreateNewWriting,
  loading 
}) => {
  return (
    <div className="w-72 bg-gray-50 border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Bài đã làm</h2>
          <span className="text-xs text-gray-500">{prompts.length}</span>
        </div>
      </div>

      {/* New Writing Button */}
      <div className="p-3 bg-white border-b border-gray-200">
        <button
          onClick={onCreateNewWriting}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Viết bài mới
        </button>
      </div>

      {/* Submissions List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-3 space-y-1.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : prompts.length === 0 ? (
          <div className="p-3">
            <div className="text-center py-12 text-gray-400">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-xs">Chưa có bài viết</p>
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-1.5">
            {prompts.map((prompt, index) => (
              <div
                key={prompt.id}
                onClick={() => onSelectPrompt(prompt)}
                className={`bg-white p-2.5 rounded border cursor-pointer transition-all ${
                  prompt.isCompleted || prompt.is_completed
                    ? 'border-green-200 hover:border-green-300 hover:shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-gray-700">
                      #{index + 1}
                    </span>
                    {(prompt.isCompleted || prompt.is_completed) ? (
                      <span className="flex items-center gap-1 bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-xs font-medium">
                        <Check className="w-3 h-3" />
                        Hoàn thành
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-xs font-medium">
                        Nháp
                      </span>
                    )}
                  </div>
                  {prompt.createdAt && (
                    <span className="text-xs text-gray-400">
                      {new Date(prompt.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                    </span>
                  )}
                </div>

                {/* Preview */}
                <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                  {(prompt.userContent || prompt.user_content || '').substring(0, 80)}...
                </p>
                
                {/* Scores */}
                {(prompt.isCompleted || prompt.is_completed) && prompt.overallScore ? (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Tổng:</span>
                      <span className="text-sm font-bold text-blue-600">
                        {prompt.overallScore}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-xs">
                      <div className="text-center bg-gray-50 rounded py-1">
                        <div className="text-gray-500 text-xs">NP</div>
                        <div className="font-semibold text-gray-900">
                          {prompt.grammarScore}
                        </div>
                      </div>
                      <div className="text-center bg-gray-50 rounded py-1">
                        <div className="text-gray-500 text-xs">TV</div>
                        <div className="font-semibold text-gray-900">
                          {prompt.vocabularyScore}
                        </div>
                      </div>
                      <div className="text-center bg-gray-50 rounded py-1">
                        <div className="text-gray-500 text-xs">ML</div>
                        <div className="font-semibold text-gray-900">
                          {prompt.coherenceScore}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                    <span className="text-gray-500">
                      {prompt.wordCount || prompt.word_count || 0} từ
                    </span>
                    <span className="text-amber-600 font-medium">
                      Chưa nộp
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="px-4 py-3 border-t border-gray-200 bg-white">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">
              {prompts.filter(p => p.isCompleted || p.is_completed).length}
            </div>
            <div className="text-xs text-gray-500">Hoàn thành</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {prompts.reduce((sum, p) => sum + (p.overallScore || 0), 0) > 0
                ? Math.round(prompts.reduce((sum, p) => sum + (p.overallScore || 0), 0) / prompts.filter(p => p.overallScore).length)
                : 0}
            </div>
            <div className="text-xs text-gray-500">Điểm TB</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingSidebar;
