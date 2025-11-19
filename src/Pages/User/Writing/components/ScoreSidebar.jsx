import React from 'react';
import { BarChart3, Award, AlertCircle, Lightbulb } from 'lucide-react';

const ScoreSidebar = ({ currentWriting }) => {
  if (!currentWriting?.is_completed || !currentWriting?.ai_feedback) {
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 85) return 'Xuất sắc';
    if (score >= 70) return 'Tốt';
    if (score >= 50) return 'Khá';
    return 'Cần cải thiện';
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Kết quả chấm điểm
        </h3>
      </div>

      {/* Overall Score */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="text-5xl font-bold text-blue-600 mb-2">
            {currentWriting.overall_score}
          </div>
          <div className="text-gray-600 text-sm mb-1">/ 100 điểm</div>
          <div className={`text-lg font-medium ${getScoreColor(currentWriting.overall_score)}`}>
            {getScoreLabel(currentWriting.overall_score)}
          </div>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Chi tiết điểm số</h4>
        
        <div className="space-y-3">
          {/* Grammar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Ngữ pháp</span>
              <span className={`text-sm font-semibold ${getScoreColor(currentWriting.grammar_score || 0)}`}>
                {currentWriting.grammar_score || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${currentWriting.grammar_score || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Vocabulary */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Từ vựng</span>
              <span className={`text-sm font-semibold ${getScoreColor(currentWriting.vocabulary_score || 0)}`}>
                {currentWriting.vocabulary_score || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${currentWriting.vocabulary_score || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Coherence */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Mạch lạc</span>
              <span className={`text-sm font-semibold ${getScoreColor(currentWriting.coherence_score || 0)}`}>
                {currentWriting.coherence_score || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${currentWriting.coherence_score || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Feedback */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Nhận xét</h4>
        <div className="text-sm text-gray-600 leading-relaxed">
          {currentWriting.ai_feedback}
        </div>
      </div>

      {/* Grammar Suggestions */}
      {currentWriting.grammar_suggestions && currentWriting.grammar_suggestions.length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            Lỗi ngữ pháp ({currentWriting.grammar_suggestions.length})
          </h4>
          <div className="space-y-2">
            {currentWriting.grammar_suggestions.map((suggestion, index) => (
              <div key={index} className="text-sm bg-red-50 p-3 rounded border border-red-200">
                <div className="text-red-700 line-through mb-1">{suggestion.error}</div>
                <div className="text-green-700">→ {suggestion.correction}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vocabulary Suggestions */}
      {currentWriting.vocabulary_suggestions && currentWriting.vocabulary_suggestions.length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            Gợi ý từ vựng ({currentWriting.vocabulary_suggestions.length})
          </h4>
          <div className="space-y-2">
            {currentWriting.vocabulary_suggestions.map((suggestion, index) => (
              <div key={index} className="text-sm bg-yellow-50 p-3 rounded border border-yellow-200">
                <div className="mb-1">
                  <span className="text-gray-700">{suggestion.word}</span>
                  <span className="mx-2">→</span>
                  <span className="text-green-700 font-medium">{suggestion.suggestion}</span>
                </div>
                <div className="text-xs text-gray-500">({suggestion.context})</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* XP Reward */}
      {currentWriting.xp_reward && (
        <div className="p-4 bg-yellow-50">
          <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-lg border border-yellow-200">
            <Award className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-gray-600">Phần thưởng:</span>
            <span className="text-lg font-bold text-yellow-600">
              +{currentWriting.xp_reward} XP
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreSidebar;
