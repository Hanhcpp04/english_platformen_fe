import React, { useState, useEffect } from 'react';
import { Check, X, ChevronRight, RotateCw, Trophy, Lightbulb, Loader2, Eye, EyeOff } from 'lucide-react';
import { submitExerciseAnswer } from '../../../../service/vocabularyService';
import { toast } from 'react-toastify';

const WordArrangementExercise = ({ questions, topicId, typeId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [availableLetters, setAvailableLetters] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]); // Track đã submit

  // New: control hint visibility
  const [showHint, setShowHint] = useState(false);

  const question = questions[currentQuestion];
  
  // Kiểm tra câu hỏi hiện tại đã được trả lời chưa
  const isQuestionAnswered = answeredQuestions.some(
    (aq) => aq.questionId === question.id
  );

  useEffect(() => {
    // Shuffle letters when question changes
    const shuffled = [...question.scrambledLetters].sort(() => Math.random() - 0.5);
    setAvailableLetters(shuffled);
    setSelectedLetters([]);
    setShowResult(false);
    setIsCorrect(false);
    setResult(null);

    // Reset hint visibility when question changes
    setShowHint(false);

    // Kiểm tra nếu câu hỏi đã hoàn thành từ backend (isCompleted từ API)
    if (question.isCompleted) {
      setShowResult(true);
      setIsCorrect(true);
      setResult({
        isCorrect: true,
        correctAnswer: question.correctWord,
        isAlreadyCompleted: true,
        explanation: 'Bạn đã hoàn thành câu hỏi này rồi!'
      });
    }

    // Kiểm tra nếu câu hỏi đã được trả lời trong session này
    const answered = answeredQuestions.find((aq) => aq.questionId === question.id);
    if (answered) {
      setShowResult(true);
      setIsCorrect(answered.isCorrect);
      setResult(answered.result);
      // Không cần shuffle letters vì đã trả lời rồi
    }
  }, [currentQuestion, question.isCompleted, question.correctWord, question.scrambledLetters, question.id, answeredQuestions]);

  const handleSelectLetter = (letter, index) => {
    setSelectedLetters([...selectedLetters, { letter, originalIndex: index }]);
    setAvailableLetters(availableLetters.filter((_, i) => i !== index));
  };

  const handleRemoveLetter = (index) => {
    const removedLetter = selectedLetters[index];
    setSelectedLetters(selectedLetters.filter((_, i) => i !== index));
    setAvailableLetters([...availableLetters, removedLetter.letter]);
  };

  const handleClear = () => {
    setAvailableLetters([...question.scrambledLetters].sort(() => Math.random() - 0.5));
    setSelectedLetters([]);
    setShowResult(false);
  };

  // 💚 Step 3: Submit answer to API
  const handleSubmit = async () => {
    if (selectedLetters.length === 0 || submitting) return;

    // Ngăn submit nếu câu hỏi đã được trả lời
    if (isQuestionAnswered) {
      toast.warning('Bạn đã trả lời câu hỏi này rồi! Hãy chuyển sang câu tiếp theo.');
      return;
    }

    try {
      setSubmitting(true);

      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id;

      if (!userId) {
        toast.error('Vui lòng đăng nhập');
        return;
      }

      // Build user answer from selected letters
      const userAnswer = selectedLetters.map((item) => item.letter).join('');

      const answerData = {
        userId,
        userAnswer,
        exerciseType: 'Sắp xếp từ (Word Scramble)',
        typeId,
        topicId
      };

      // Debug logging
      console.log('📝 Submitting word arrangement answer:', {
        questionId: question.id,
        userAnswer,
        correctWord: question.correctWord,
        answerData
      });

      const response = await submitExerciseAnswer(question.id, answerData);

      // Debug response
      console.log('📨 API Response:', response);

      if (response.code === 1000 && response.result) {
        const apiResult = response.result;
        
        // Kiểm tra nếu câu hỏi đã được hoàn thành trước đó
        if (apiResult.isAlreadyCompleted) {
          toast.info('Bạn đã hoàn thành câu hỏi này rồi!');
          setResult(apiResult);
          setIsCorrect(apiResult.isCorrect);
          setShowResult(true);
          
          // Lưu vào answeredQuestions để không cho làm lại
          setAnsweredQuestions([
            ...answeredQuestions,
            {
              questionId: question.id,
              isCorrect: apiResult.isCorrect,
              result: apiResult,
              isAlreadyCompleted: true
            }
          ]);
          return;
        }
        
        setResult(apiResult);
        setIsCorrect(apiResult.isCorrect);
        setShowResult(true);
        
        // Cộng điểm và lưu vào answeredQuestions
        if (apiResult.isCorrect && !apiResult.isAlreadyCompleted) {
          setScore(score + 1);
          toast.success(`Chính xác! +${apiResult.xpEarned} XP`);
        } else if (!apiResult.isCorrect) {
          toast.error(`Chưa đúng! Đáp án đúng: ${apiResult.correctAnswer}`);
        }

        // Track câu hỏi đã trả lời
        setAnsweredQuestions([
          ...answeredQuestions,
          {
            questionId: question.id,
            isCorrect: apiResult.isCorrect,
            result: apiResult,
            userAnswer,
            isAlreadyCompleted: false
          }
        ]);
      } else {
        throw new Error(response.message || 'Không thể gửi câu trả lời');
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      toast.error(err.message || 'Có lỗi xảy ra khi gửi câu trả lời');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setScore(0);
    setIsCompleted(false);
    setSelectedLetters([]);
    setShowResult(false);
    setResult(null);
  };

  if (isCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white rounded-lg border-2 border-gray-100 p-8">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-10 h-10 text-purple-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Hoàn thành bài tập!
            </h3>
            <p className="text-gray-600">Chúc mừng bạn đã hoàn thành bài tập sắp xếp chữ</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Số câu đúng:</span>
              <span className="text-2xl font-bold text-purple-600">
                {score}/{questions.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Độ chính xác:</span>
              <span className="text-2xl font-bold text-purple-600">{percentage}%</span>
            </div>
            {result?.totalXp && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tổng XP:</span>
                <span className="text-2xl font-bold text-purple-600">{result.totalXp}</span>
              </div>
            )}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-4">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all mx-auto shadow-md hover:shadow-lg"
          >
            <RotateCw className="w-5 h-5" />
            Làm lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="bg-white rounded-lg border-2 border-gray-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Câu {currentQuestion + 1} / {questions.length}
          </span>
          <span className="text-sm text-gray-500">
            Điểm: {score}/{questions.length}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg border-2 border-gray-100 p-8 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {question.question}
          </h3>
          {question.questionVi && (
            <p className="text-gray-600 mb-4">{question.questionVi}</p>
          )}
          {question.hint && (
            <div className="w-full bg-purple-50 rounded-lg p-2 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <div className="text-sm text-purple-700 font-medium">Gợi ý:</div>
                  <div className="mt-1 text-sm text-purple-700">
                    {showHint ? (
                      <span>{question.hint}</span>
                    ) : (
                      <span className="italic text-gray-500">Gợi ý bị ẩn. Nhấn biểu tượng mắt để xem.</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowHint((s) => !s)}
                aria-label={showHint ? 'Ẩn gợi ý' : 'Hiện gợi ý'}
                className="ml-4 p-2 rounded-md hover:bg-purple-100 transition-colors"
              >
                {showHint ? (
                  <EyeOff className="w-5 h-5 text-purple-600" />
                ) : (
                  <Eye className="w-5 h-5 text-purple-600" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Answer Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Từ của bạn:
          </label>
          <div
            className={`min-h-[80px] p-4 rounded-lg border-2 transition-all ${
              showResult
                ? isCorrect
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            <div className="flex flex-wrap gap-2">
              {selectedLetters.length === 0 ? (
                <span className="text-gray-400 italic">Chọn các chữ cái bên dưới...</span>
              ) : (
                selectedLetters.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => !showResult && handleRemoveLetter(index)}
                    disabled={showResult}
                    className="px-4 py-3 bg-white border-2 border-purple-300 rounded-lg font-bold text-lg text-gray-900 hover:bg-purple-50 transition-all disabled:cursor-default"
                  >
                    {item.letter}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Available Letters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Các chữ cái có sẵn:
          </label>
          <div className="min-h-[80px] p-4 bg-white rounded-lg border-2 border-gray-200">
            <div className="flex flex-wrap gap-2">
              {availableLetters.map((letter, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && handleSelectLetter(letter, index)}
                  disabled={showResult}
                  className="px-4 py-3 bg-purple-50 border-2 border-purple-200 rounded-lg font-bold text-lg text-gray-900 hover:bg-purple-100 hover:border-purple-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result Message */}
        {showResult && result && (
          <div
            className={`p-4 rounded-lg flex items-start gap-3 ${
              isCorrect
                ? 'bg-green-50 border-2 border-green-200'
                : 'bg-red-50 border-2 border-red-200'
            }`}
          >
            {isCorrect ? (
              <>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-green-800">Chính xác!</p>
                    {result.isAlreadyCompleted && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                        Đã hoàn thành
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-green-700">
                    Từ đúng là: <strong>{result.correctAnswer}</strong>
                  </p>
                  {result.explanation && (
                    <p className="text-sm text-green-600 mt-1">{result.explanation}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <X className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-red-800">Chưa đúng!</p>
                    {result.isAlreadyCompleted && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                        Đã hoàn thành
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-red-700">
                    Từ đúng là: <strong>{result.correctAnswer}</strong>
                  </p>
                  {result.explanation && (
                    <p className="text-sm text-red-600 mt-1">{result.explanation}</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-4">
          {/* Left side: Clear and Previous buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClear}
              disabled={showResult || selectedLetters.length === 0}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Xóa hết
            </button>
            <button
              onClick={() => {
                if (currentQuestion > 0) {
                  setCurrentQuestion(currentQuestion - 1);
                }
              }}
              disabled={currentQuestion === 0}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
              Câu trước
            </button>
          </div>

          {/* Right side: Submit or Next button */}
          <div className="flex gap-3">
            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={selectedLetters.length === 0 || submitting || isQuestionAnswered}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang kiểm tra...
                  </>
                ) : isQuestionAnswered ? (
                  <>
                    <Check className="w-5 h-5" />
                    Đã trả lời
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Kiểm tra
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                {currentQuestion < questions.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành'}
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordArrangementExercise;