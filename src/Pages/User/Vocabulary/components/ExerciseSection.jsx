import React, { useState, useEffect } from 'react';
import { CheckCircle2, ListChecks, Shuffle, Loader2 } from 'lucide-react';
import MultipleChoiceExercise from './MultipleChoiceExercise';
import WordArrangementExercise from './WordArrangementExercise';
import { getExerciseTypesByTopic, getExerciseQuestions } from '../../../../service/vocabularyService';
import { toast } from 'react-toastify';

const ExerciseSection = ({ topicId }) => {
  const [exerciseTypes, setExerciseTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState(null);

  // 🩵 Step 1: Fetch exercise types on component mount
  useEffect(() => {
    const fetchExerciseTypes = async () => {
      try {
        setLoading(true);
        setError(null);

        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const userId = user?.id;

        if (!userId) {
          toast.error('Vui lòng đăng nhập để xem bài tập');
          setError('Người dùng chưa đăng nhập');
          return;
        }

        const response = await getExerciseTypesByTopic(topicId, userId);

        if (response.code === 1000 && response.result) {
          const types = response.result.map((type) => ({
            id: type.id,
            name: type.name,
            label: type.name,
            description: type.description,
            count: type.questionCount,
            completedCount: type.completedCount,
            icon: type.id === 1 ? ListChecks : Shuffle,
            color: type.id === 1 ? 'text-blue-600' : 'text-purple-600',
            bgColor: type.id === 1 ? 'bg-blue-50' : 'bg-purple-50',
            borderColor: type.id === 1 ? 'border-blue-200' : 'border-purple-200',
          }));
          setExerciseTypes(types);
        } else {
          throw new Error(response.message || 'Không thể tải danh sách bài tập');
        }
      } catch (err) {
        console.error('Error fetching exercise types:', err);
        setError(err.message || 'Có lỗi xảy ra khi tải bài tập');
        toast.error(err.message || 'Không thể tải danh sách bài tập');
      } finally {
        setLoading(false);
      }
    };

    if (topicId) {
      fetchExerciseTypes();
    }
  }, [topicId]);

  // 🩷 Step 2: Fetch questions when exercise type is selected
  const handleSelectType = async (type) => {
    if (selectedType?.id === type.id) return; // Prevent re-fetch if same type

    try {
      setLoadingQuestions(true);
      setSelectedType(type);

      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id;

      if (!userId) {
        toast.error('Vui lòng đăng nhập');
        return;
      }

      const response = await getExerciseQuestions(type.id, topicId, userId);

      if (response.code === 1000 && response.result) {
        setQuestions(response.result.questions || []);
      } else {
        throw new Error(response.message || 'Không thể tải câu hỏi');
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
      toast.error(err.message || 'Không thể tải câu hỏi');
      setQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
          <p className="text-gray-600 text-sm">Đang tải bài tập...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // No exercise types
  if (exerciseTypes.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">Chưa có bài tập cho chủ đề này.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Exercise Type Selector */}
      <div className="bg-white rounded-lg border-2 border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Chọn loại bài tập</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exerciseTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleSelectType(type)}
              className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                selectedType?.id === type.id
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
                  <p className="text-sm text-gray-600">
                    {type.count} câu hỏi
                    {type.completedCount > 0 && (
                      <span className="ml-2 text-green-600">
                        ({type.completedCount} đã làm)
                      </span>
                    )}
                  </p>
                </div>
                {selectedType?.id === type.id && (
                  <CheckCircle2 className={`w-6 h-6 ${type.color}`} />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Content */}
      {selectedType && (
        <div>
          {loadingQuestions ? (
            <div className="flex items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                <p className="text-gray-600 text-sm">Đang tải câu hỏi...</p>
              </div>
            </div>
          ) : questions.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-600">Không có câu hỏi nào cho bài tập này.</p>
            </div>
          ) : (
            <>
              {selectedType.id === 1 && (
                <MultipleChoiceExercise 
                  questions={questions} 
                  topicId={topicId}
                  typeId={selectedType.id}
                />
              )}
              {selectedType.id === 2 && (
                <WordArrangementExercise 
                  questions={questions}
                  topicId={topicId}
                  typeId={selectedType.id}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ExerciseSection;
