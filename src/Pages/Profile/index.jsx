import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Award, 
  Coins, 
  TrendingUp, 
  Calendar,
  Edit2,
  Shield,
  Trophy,
  Star,
  Target,
  BookOpen,
  Clock,
  Flame
} from 'lucide-react';
import { getProfile, getBadgeSumary } from '../../service/authService';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredBadge, setHoveredBadge] = useState(null);
  const navigate = useNavigate();

  const normalizeUser = (u) => {
    if (!u) return null;
    
    // Map dữ liệu từ API response
    return {
      id: u.id,
      fullName: u.fullname || u.fullName || u.username || '',
      username: u.username || '',
      email: u.email || '',
      avatar: u.avatar || null,
      role: u.role || 'USER',
      level: u.currentLevel?.levelNumber || 1,
      levelName: u.currentLevel?.levelName || 'Beginner',
      levelDescription: u.currentLevel?.description || '',
      totalXp: u.totalXp || 0,
      minXp: u.currentLevel?.minXp || 0,
      maxXp: u.currentLevel?.maxXp || 499,
      provider: u.provider,
      googleId: u.googleId,
      facebookId: u.facebookId,
      isActive: u.isActive,
      badges: u.badges || [],
      streak: u.streak?.currentStreak ?? 0,
      longestStreak: u.streak?.longestStreak ?? 0,
      lastActivityDate: u.streak?.lastActivityDate,
      streakStartDate: u.streak?.streakStartDate,
      totalStudyDays: u.streak?.totalStudyDays ?? 0,
      lessonsCompleted: u.lessonsCompleted ?? 0,
      accuracy: u.accuracy ?? 0,
      totalHours: u.totalHours ?? 0,
      recentActivities: u.recentActivities || [],
      coins: u.coins ?? 0,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt
    };
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch dữ liệu mới từ API
        const response = await getProfile();
        if (response.result) {
          const normalized = normalizeUser(response.result);
          try {
            const badgeResp = await getBadgeSumary(response.result.id);
            const badgeData = badgeResp.result || badgeResp;
            // map recentBadges sang dạng mà UI dùng
            if (badgeData?.recentBadges?.length) {
              normalized.badges = badgeData.recentBadges.map(b => ({
                id: b.id,
                name: b.name,
                description: b.description,
                iconUrl: b.iconUrl,
                isEarned: b.isEarned,
                earnedAt: b.earnedAt
              }));
            }
            // lưu thêm thông tin tổng quan nếu cần
            normalized.totalBadges = badgeData?.totalBadges ?? normalized.totalBadges;
            normalized.earnedBadges = badgeData?.earnedBadges ?? normalized.earnedBadges;
            normalized.unlockedBadges = badgeData?.unlockedBadges ?? normalized.unlockedBadges;
          } catch (badgeErr) {
            console.warn('Không lấy được badge summary:', badgeErr);
          }
          setUser(normalized);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);
  const getInitials = (name) => {
    const n = name || (user && (user.fullName || user.username)) || 'U';
    return n
      .split(' ')
      .filter(Boolean)
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Calculate level progress
  const calculateLevelProgress = () => {
    if (user && typeof user.totalXp === 'number' && user.minXp !== undefined && user.maxXp !== undefined) {
      const xpRange = user.maxXp - user.minXp;
      const xpProgress = user.totalXp - user.minXp;
      return Math.min(100, Math.max(0, (xpProgress / xpRange) * 100));
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Quay lại Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto w-full px-2 sm:px-4 lg:px-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName || user.username}
                  className="w-28 h-28 rounded-full object-cover border-4 border-gray-50"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-primary flex items-center justify-center text-white font-bold text-4xl border-4 border-gray-50">
                  {getInitials(user.fullName || user.username)}
                </div>
              )}
              <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition-colors border border-gray-200">
                <Edit2 className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Name and Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.fullName || user.username}
              </h1>
              <p className="text-gray-500 mt-1 flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
              <div className="mt-3 flex items-center gap-2 justify-center sm:justify-start">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Level {user.level || 1}
                </span>
                {user.role === 'ADMIN' && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    Admin
                  </span>
                )}
              </div>
            </div>

            {/* Edit Profile Button */}
            <button className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium">
              <Edit2 className="w-4 h-4" />
              Chỉnh sửa hồ sơ
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Stats */}
          <div className="md:col-span-1 space-y-6">
            {/* Level Progress */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Cấp độ</h3>
                <TrendingUp className="w-6 h-6 text-gray-400" />
              </div>
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-white font-bold text-2xl mb-2">
                  {user.level || 1}
                </div>
                <p className="text-gray-600 text-sm">Cấp độ hiện tại</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tiến độ</span>
                  <span className="font-semibold text-primary">
                    {user.totalXp} / {user.maxXp} XP
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${calculateLevelProgress()}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 text-center pt-1">
                  {user.levelName} - {user.levelDescription}
                </p>
                <p className="text-xs text-gray-500 text-center">
                  Còn {user.maxXp - user.totalXp} XP để lên cấp tiếp theo
                </p>
              </div>
            </div>

            {/* Badges Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Huy hiệu</h3>
                <Trophy className="w-6 h-6 text-gray-400" />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {user.badges && user.badges.length > 0 ? (
                  user.badges.map((badge) => {
                    const bid = badge.id ?? badge.name;
                    return (
                      <div
                        key={bid}
                        className="relative"
                        onMouseEnter={() => setHoveredBadge(bid)}
                        onMouseLeave={() => setHoveredBadge(null)}
                      >
                        <div
                          className="aspect-square bg-yellow-100 rounded-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                          title={badge.name}
                        >
                          {/* nếu có iconUrl dùng ảnh, nếu không dùng icon mặc định */}
                          {badge.iconUrl ? (
                            <img src={badge.iconUrl} alt={badge.name} className="w-8 h-8 object-contain" />
                          ) : (
                            <Trophy className="w-6 h-6 text-yellow-500" />
                          )}
                        </div>

                        {/* Tooltip */}
                        {hoveredBadge === bid && (
                          <div className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-white border border-gray-200 shadow-lg rounded-md p-3 text-sm text-gray-800">
                            <div className="flex items-start gap-3">
                              {badge.iconUrl && (
                                <img src={badge.iconUrl} alt={badge.name} className="w-10 h-10 rounded-sm object-contain" />
                              )}
                              <div>
                                <div className="font-semibold text-gray-900">{badge.name}</div>
                                {badge.description && <div className="text-xs text-gray-600 mt-1">{badge.description}</div>}
                                {badge.earnedAt && (
                                  <div className="text-xs text-gray-500 mt-2">Đạt được: {new Date(badge.earnedAt).toLocaleString('vi-VN')}</div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
                      >
                        <Trophy className="w-6 h-6 text-gray-300" />
                      </div>
                    ))}
                  </>
                )}
              </div>
              <p className="text-center text-gray-500 text-sm mt-4">
                {user.badges?.length || 0}  / {user.totalBadges || 12} 
              </p>
            </div>
          </div>

          {/* Right Column - Activity & Stats */}
          <div className="md:col-span-2 space-y-6">
            {/* Statistics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center text-gray-500 mb-2">
                  <Flame className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Streak hiện tại</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{user.streak || 0}</p>
                <p className="text-xs text-gray-400 mt-1">Streak dài nhất: {user.longestStreak || 0} ngày</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center text-gray-500 mb-2">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Tổng ngày học</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{user.totalStudyDays || 0}</p>
                {user.lastActivityDate && (
                  <p className="text-xs text-gray-400 mt-1">
                    Hoạt động: {new Date(user.lastActivityDate).toLocaleDateString('vi-VN')}
                  </p>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center text-gray-500 mb-2">
                  <BookOpen className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Bài học</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{user.lessonsCompleted || 0}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center text-gray-500 mb-2">
                  <Target className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Độ chính xác</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{user.accuracy || 0}%</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-gray-900">Hoạt động gần đây</h3>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>

              {user.recentActivities && user.recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {user.recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Star className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{activity.title}</p>
                        <p className="text-sm text-gray-500">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Chưa có hoạt động nào</p>
                  <p className="text-sm text-gray-400 mt-1">Bắt đầu học để ghi nhận hoạt động của bạn</p>
                </div>
              )}
            </div>

            {/* Learning Goals */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-gray-900">Mục tiêu học tập</h3>
                <Target className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Học mỗi ngày</span>
                    <span className="text-sm font-semibold text-primary">5/7 ngày</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '71%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Hoàn thành 20 bài học</span>
                    <span className="text-sm font-semibold text-primary">{user.lessonsCompleted || 0}/20</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${((user.lessonsCompleted || 0) / 20) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Kiếm 1000 xu</span>
                    <span className="text-sm font-semibold text-primary">{user.coins || 0}/1000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${((user.coins || 0) / 1000) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
