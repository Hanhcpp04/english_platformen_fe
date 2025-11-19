import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, BookOpen, PenTool, Trophy, Star, ChevronRight, Home, Loader2 } from 'lucide-react';
import FlashcardSection from './components/FlashcardSection';
import ExerciseSection from './components/ExerciseSection';
import { getVocabularyByTopic } from '../../../service/vocabularyService';
import { toast } from 'react-toastify';

const VocabularyDetail = () => {
  const { topicId } = useParams();
  const location = useLocation();
  const passedTopic = location.state?.topic;
  const [activeTab, setActiveTab] = useState('flashcard'); // 'flashcard' or 'exercise'
  const [loading, setLoading] = useState(true);
  const [vocabularies, setVocabularies] = useState([]);
  const [topicInfo, setTopicInfo] = useState(null);
  const [error, setError] = useState(null);

  // Fetch vocabulary data from API
  useEffect(() => {
    // If navigation provided topic metadata via Link.state, set it immediately as fallback
    if (passedTopic) {
      setTopicInfo({
        id: passedTopic.id || topicId,
        emoji: passedTopic.emoji || '📚',
        title: passedTopic.title || passedTopic.titleVi || 'Vocabulary Topic',
        titleVi: passedTopic.titleVi || passedTopic.title || 'Chủ đề từ vựng',
        description: passedTopic.description || '',
        totalWords: passedTopic.totalWords || 0,
        learnedWords: passedTopic.learnedWords || 0,
      });
    }
    const fetchVocabulary = async () => {
      try {
        setLoading(true);
        setError(null);

        // Debug: Kiểm tra tất cả localStorage keys
        console.log('=== 🔍 VocabularyDetail - localStorage Debug ===');
        console.log('All localStorage keys:', Object.keys(localStorage));
        
        // Lấy thông tin user từ localStorage với xử lý lỗi
        const userStr = localStorage.getItem('user');
        console.log('userStr (raw):', userStr);
        console.log('userStr type:', typeof userStr);
        console.log('userStr length:', userStr?.length);
        
        let user = null;
        let userId = null;

        if (userStr && userStr !== 'undefined' && userStr !== 'null') {
          try {
            user = JSON.parse(userStr);
            userId = user?.id;
            console.log('✅ Parsed user object:', user);
            console.log('✅ userId extracted:', userId);
            console.log('✅ userId type:', typeof userId);
          } catch (parseError) {
            console.error('❌ Error parsing user data:', parseError);
            console.error('❌ Failed userStr was:', userStr);
            localStorage.removeItem('user'); // Xóa dữ liệu lỗi
          }
        } else {
          console.warn('⚠️ userStr is empty, undefined, or null');
          console.warn('⚠️ Checking alternative storage...');
          
          // Thử lấy từ các key khác
          const altUser = localStorage.getItem('currentUser') || localStorage.getItem('userData');
          if (altUser) {
            console.log('⚠️ Found alternative user data:', altUser);
            try {
              user = JSON.parse(altUser);
              userId = user?.id;
            } catch (e) {
              console.error('❌ Failed to parse alternative user data:', e);
            }
          }
        }

        if (!userId) {
          console.error('❌ No userId found after all attempts');
          console.error('❌ Final user object:', user);
          
          // Fallback: Thử lấy từ API profile
          console.log('⚠️ Attempting to fetch profile from API...');
          try {
            const { getProfile } = await import('../../../service/authService');
            const profileResponse = await getProfile();
            const profileData = profileResponse.result || profileResponse;
            
            if (profileData?.id) {
              console.log('✅ Got userId from API profile:', profileData.id);
              userId = profileData.id;
              
              // Lưu lại vào localStorage để lần sau không phải gọi API
              localStorage.setItem('user', JSON.stringify(profileData));
              user = profileData;
            } else {
              throw new Error('No userId in profile response');
            }
          } catch (profileError) {
            console.error('❌ Failed to fetch profile:', profileError);
            toast.error('Vui lòng đăng nhập lại');
            setError('Không thể lấy thông tin người dùng');
            setLoading(false);
            return;
          }
        }
        
        if (!userId) {
          toast.error('Vui lòng đăng nhập để xem từ vựng');
          setError('Người dùng chưa đăng nhập');
          setLoading(false);
          return;
        }
        
        console.log('✅ Using userId:', userId);

        // Fetch vocabulary from API
        const response = await getVocabularyByTopic(topicId, userId);

        if (response.code === 200 && response.result) {
          const vocabList = response.result;

          // Transform API data to match component format
          const transformedVocabs = vocabList.map(vocab => ({
            id: vocab.id,
            word: vocab.englishWord,
            pronunciation: vocab.pronunciation || '',
            meaning: vocab.vietnameseMeaning,
            example: vocab.exampleSentence || '',
            exampleVi: vocab.exampleTranslation || '',
            image: vocab.imageUrl,
            audioUrl: vocab.audioUrl,
            wordType: vocab.wordType,
            xpReward: vocab.xpReward || 5,
            isCompleted: vocab.isCompleted || false
          }));

          setVocabularies(transformedVocabs);
          if (passedTopic) {
            setTopicInfo({
              id: passedTopic.id || topicId,
              emoji: passedTopic.emoji || '📚',
              title: passedTopic.title || passedTopic.titleVi || 'Vocabulary Topic',
              titleVi: passedTopic.titleVi || passedTopic.title || 'Chủ đề từ vựng',
              description: passedTopic.description || '',
              totalWords: passedTopic.totalWords || 0,
              learnedWords: passedTopic.learnedWords || 0,
            });
          }
        } else {
          throw new Error(response.message || 'Không thể tải từ vựng');
        }
      } catch (err) {
        console.error('Error fetching vocabulary:', err);
        setError(err.message || 'Có lỗi xảy ra khi tải từ vựng');
        toast.error(err.message || 'Không thể tải từ vựng');
      } finally {
        setLoading(false);
      }
    };

    if (topicId) {
      fetchVocabulary();
    }
  }, [topicId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải từ vựng...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Có lỗi xảy ra</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              to="/vocabulary"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!vocabularies || vocabularies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có từ vựng</h3>
            <p className="text-gray-600 mb-4">Chủ đề này chưa có từ vựng nào.</p>
            <Link
              to="/vocabulary"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'flashcard',
      label: 'Flashcard',
      icon: BookOpen,
      color: 'text-primary',
      bgColor: 'bg-primary',
    },
    {
      id: 'exercise',
      label: 'Bài tập',
      icon: PenTool,
      color: 'text-primary',
      bgColor: 'bg-primary',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-2">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/dashboard" className="flex items-center gap-1 hover:text-primary transition-colors">
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/vocabulary" className="hover:text-primary transition-colors">
            Từ vựng
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{topicInfo?.titleVi}</span>
        </div>

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{topicInfo?.emoji}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {topicInfo?.titleVi}
                </h1>
                <p className="text-gray-500 text-sm">{topicInfo?.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 rounded-lg border border-yellow-200">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">
                  {topicInfo?.learnedWords}/{topicInfo?.totalWords}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-gray-700">
                  +{vocabularies.reduce((sum, v) => sum + (v.xpReward || 0), 0)} XP
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm">{topicInfo?.description}</p>
        </div>

        {/* TABS */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1.5 inline-flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-md font-medium text-sm transition-all duration-200 ${activeTab === tab.id
                    ? `${tab.bgColor} text-white shadow-sm`
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div>
          {activeTab === 'flashcard' && (
            <FlashcardSection vocabularies={vocabularies} topicId={topicId} />
          )}
          {activeTab === 'exercise' && (
            <ExerciseSection topicId={topicId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default VocabularyDetail;
