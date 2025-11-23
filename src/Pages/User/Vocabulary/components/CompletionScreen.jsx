import React from 'react';
import { Award, RotateCcw, ArrowRight } from 'lucide-react';

const CompletionScreen = ({ score, onReset, onReview, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Hoàn thành bài tập! 🎉
          </h2>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {score.correctCount}/{score.total}
              </div>
              <div className="text-sm text-gray-600">Câu đúng</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {score.percentage}%
              </div>
              <div className="text-sm text-gray-600">Độ chính xác</div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600 mb-1">
                +{score.totalXP}
              </div>
              <div className="text-sm text-gray-600">XP nhận được</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={onReview}
              className="flex items-center gap-2 px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50"
            >
              <Award className="w-5 h-5" />
              Xem lại bài làm
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50"
            >
              <RotateCcw className="w-5 h-5" />
              Làm lại
            </button>
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Quay lại chủ đề
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;
