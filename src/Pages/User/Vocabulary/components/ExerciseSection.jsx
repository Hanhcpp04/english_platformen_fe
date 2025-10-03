import React, { useState } from 'react';
import { CheckCircle2, ListChecks, Shuffle } from 'lucide-react';
import MultipleChoiceExercise from './MultipleChoiceExercise';
import WordArrangementExercise from './WordArrangementExercise';

const ExerciseSection = ({ exercises }) => {
  const [exerciseType, setExerciseType] = useState('multiple-choice');

  const exerciseTypes = [
    {
      id: 'multiple-choice',
      label: 'Trắc nghiệm',
      icon: ListChecks,
      count: exercises.multipleChoice.length,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      id: 'word-arrangement',
      label: 'Sắp xếp chữ',
      icon: Shuffle,
      count: exercises.wordArrangement.length,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Exercise Type Selector */}
      <div className="bg-white rounded-lg border-2 border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Chọn loại bài tập</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exerciseTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setExerciseType(type.id)}
              className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                exerciseType === type.id
                  ? `${type.borderColor} ${type.bgColor} shadow-md`
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full ${type.bgColor} flex items-center justify-center`}
                >
                  <type.icon className={`w-6 h-6 ${type.color}`} />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-bold text-gray-900 mb-1">{type.label}</h4>
                  <p className="text-sm text-gray-600">{type.count} câu hỏi</p>
                </div>
                {exerciseType === type.id && (
                  <CheckCircle2 className={`w-6 h-6 ${type.color}`} />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Content */}
      <div>
        {exerciseType === 'multiple-choice' && (
          <MultipleChoiceExercise questions={exercises.multipleChoice} />
        )}
        {exerciseType === 'word-arrangement' && (
          <WordArrangementExercise questions={exercises.wordArrangement} />
        )}
      </div>
    </div>
  );
};

export default ExerciseSection;
