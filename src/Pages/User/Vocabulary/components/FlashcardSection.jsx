import React, { useState } from 'react';
import { Volume2, ChevronLeft, ChevronRight, RotateCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { completeVocabulary } from '../../../../service/vocabularyService';
import { toast } from 'react-toastify';

const FlashcardSection = ({ vocabularies, topicId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState('');
  const [completedWords, setCompletedWords] = useState(
    (vocabularies || []).filter(v => v.isCompleted).map(v => v.id)
  );
  const [completing, setCompleting] = useState(false);

  const currentCard = vocabularies[currentIndex];

  const handleNext = () => {
    if (currentIndex < vocabularies.length - 1) {
      setDirection('next');
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
        setDirection('');
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection('prev');
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setIsFlipped(false);
        setDirection('');
      }, 300);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSpeak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const isCurrentCompleted = completedWords.includes(currentCard?.id);

  const handleComplete = async () => {
    if (!currentCard || completing) return;

    try {
      setCompleting(true);

      // Lấy thông tin user từ localStorage với xử lý lỗi
      const userStr = localStorage.getItem('user');
      let user = null;
      let userId = null;

      if (userStr && userStr !== 'undefined' && userStr !== 'null') {
        try {
          user = JSON.parse(userStr);
          userId = user?.id;
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
        }
      }

      if (!userId) {
        toast.error('Vui lòng đăng nhập để hoàn thành từ vựng');
        setCompleting(false);
        return;
      }

      const response = await completeVocabulary(userId, currentCard.id, topicId);

      if (response?.code === 1000 || response?.code === 200 || response?.success === true) {
        setCompletedWords(prev => prev.includes(currentCard.id) ? prev : [...prev, currentCard.id]);
        toast.success(`Đã hoàn thành từ "${currentCard.word}" (+${currentCard.xpReward || 5} XP)`);
        setTimeout(() => {
          if (currentIndex < vocabularies.length - 1) {
            handleNext();
          }
        }, 800);
      } else {
        toast.error(response?.message || 'Không thể hoàn thành từ vựng');
      }
    } catch (error) {
      console.error('Error completing vocabulary:', error);
      toast.error(error?.message || 'Có lỗi xảy ra khi hoàn thành từ vựng');
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Compact Progress Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 bg-white rounded-full border border-gray-200 p-1.5 shadow-sm">
          <div className="relative h-2 bg-gray-50 rounded-full overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/80 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${((currentIndex + 1) / vocabularies.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
          <span className="text-lg font-bold text-primary">{currentIndex + 1}</span>
          <span className="text-gray-400">/</span>
          <span className="text-sm font-medium text-gray-600">{vocabularies.length}</span>
        </div>
      </div>

      {/* Main Flashcard Area - Reduced Height */}
      <div className="relative flex items-center justify-center min-h-[380px]">
        {/* Navigation Buttons - Smaller */}
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="absolute left-0 z-10 p-3 bg-white rounded-full shadow-lg border border-gray-200 hover:border-primary hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:border-gray-200 transition-all duration-200"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === vocabularies.length - 1}
          className="absolute right-0 z-10 p-3 bg-white rounded-full shadow-lg border border-gray-200 hover:border-primary hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:border-gray-200 transition-all duration-200"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        {/* Flashcard Container - Reduced Size */}
        <div className="w-full max-w-2xl px-14">
          <div
            className={`transition-all duration-300 ${
              direction === 'next'
                ? 'translate-x-full opacity-0'
                : direction === 'prev'
                ? '-translate-x-full opacity-0'
                : 'translate-x-0 opacity-100'
            }`}
          >
            <div
              className="relative h-[350px] cursor-pointer perspective-1000"
              onClick={handleFlip}
            >
              <div
                className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front Side - English */}
                <div className="absolute w-full h-full backface-hidden">
                  <div className="relative bg-gradient-to-br from-white via-white to-gray-50 rounded-xl border-2 border-gray-200 shadow-xl p-8 h-full flex flex-col items-center justify-center overflow-hidden">
                    {/* Decorative Elements - Smaller */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-12 translate-x-12" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full translate-y-16 -translate-x-16" />
                    
                    <div className="relative z-10 text-center space-y-6 w-full">
                      {/* Word Badge */}
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        <Sparkles className="w-3.5 h-3.5" />
                        English Word
                      </div>

                      {/* Main Word - Smaller */}
                      <div className="space-y-3">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                          {currentCard.word}
                        </h2>
                        <p className="text-xl text-gray-500 font-light tracking-wide">
                          {currentCard.pronunciation}
                        </p>
                      </div>

                      {/* Audio Button - Smaller */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeak(currentCard.word);
                        }}
                        className="group p-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-full hover:shadow-lg hover:scale-110 transition-all duration-300"
                      >
                        <Volume2 className="w-6 h-6 group-hover:animate-pulse" />
                      </button>

                      {/* Hint - Smaller */}
                      <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Nhấn để xem nghĩa</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back Side - Vietnamese */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180">
                  <div className="relative bg-gradient-to-br from-primary via-primary to-primary/90 rounded-xl border-2 border-primary shadow-xl p-6 h-full flex flex-col justify-between text-white overflow-hidden">
                    {/* Decorative Pattern - Smaller */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full -translate-y-24 translate-x-24" />
                      <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full translate-y-20 -translate-x-20" />
                    </div>

                    <div className="relative z-10 space-y-4">
                      {/* Vietnamese Badge */}
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                        <Sparkles className="w-3.5 h-3.5" />
                        Nghĩa tiếng Việt
                      </div>

                      {/* Meaning - Smaller */}
                      <div className="text-center">
                        <h3 className="text-3xl md:text-4xl font-bold leading-tight">
                          {currentCard.meaning}
                        </h3>
                      </div>

                      {/* Examples - Compact */}
                      <div className="space-y-3 mt-4">
                        <div className="bg-white/15 backdrop-blur-md rounded-lg p-4 border border-white/20">
                          <p className="text-white/70 text-xs uppercase tracking-wider mb-1 font-semibold">
                            Example
                          </p>
                          <p className="text-base leading-relaxed font-medium italic">
                            "{currentCard.example}"
                          </p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-md rounded-lg p-4 border border-white/20">
                          <p className="text-white/70 text-xs uppercase tracking-wider mb-1 font-semibold">
                            Dịch
                          </p>
                          <p className="text-base leading-relaxed">
                            {currentCard.exampleVi}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Hint */}
                    <div className="relative z-10 flex items-center justify-center gap-2 text-white/60 text-xs">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Nhấn để quay lại</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Flip and Complete */}
      <div className="flex justify-center gap-3">
        <button
          onClick={handleFlip}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold text-sm"
        >
          <RotateCw className="w-4 h-4" />
          {isFlipped ? 'Xem từ tiếng Anh' : 'Xem nghĩa'}
        </button>
        
        {!isCurrentCompleted ? (
          <button
            onClick={handleComplete}
            disabled={completing}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-4 h-4" />
            {completing ? 'Đang xử lý...' : 'Đã học'}
          </button>
        ) : (
          <div className="flex items-center gap-2 px-6 py-2.5 bg-green-100 text-green-700 rounded-lg border-2 border-green-300 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4 fill-current" />
            Đã hoàn thành
          </div>
        )}
      </div>

      {/* Quick Navigation Dots */}
      <div className="flex flex-wrap justify-center gap-2 pt-2">
        {vocabularies.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsFlipped(false);
            }}
            className={`transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 h-2.5 bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-md'
                : 'w-2.5 h-2.5 bg-gray-300 rounded-full hover:bg-gray-400 hover:scale-125'
            }`}
            title={`Từ ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FlashcardSection;
