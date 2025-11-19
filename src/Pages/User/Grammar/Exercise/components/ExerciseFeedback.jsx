import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const ExerciseFeedback = ({ feedback, explanation, correctAnswer }) => {
  if (!feedback || !feedback.show) return null;

  return (
    <div
      className={`p-4 rounded-lg mb-6 ${
        feedback.isCorrect
          ? 'bg-green-50 border-2 border-green-200'
          : 'bg-red-50 border-2 border-red-200'
      }`}
    >
      <div className="flex items-start gap-3">
        {feedback.isCorrect ? (
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
        ) : (
          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
        )}
        <div>
          <h3
            className={`font-bold text-lg mb-2 ${
              feedback.isCorrect ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {feedback.isCorrect ? 'Chính xác!' : 'Chưa đúng'}
          </h3>
          <p className={feedback.isCorrect ? 'text-green-700' : 'text-red-700'}>
            {explanation}
          </p>
          {!feedback.isCorrect && correctAnswer && (
            <p className="mt-2 font-medium text-gray-900">
              Đáp án đúng: <span className="text-green-600">{correctAnswer}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseFeedback;
