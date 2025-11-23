import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Award, Coins } from 'lucide-react';
import { logout } from '../../service/authService';

const UserAvatar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      console.log('👤 UserAvatar - Loading user data...');
      setIsLoading(true);
      
      const token = localStorage.getItem('accessToken');
      
      if (token && token !== 'undefined' && token !== 'null' && token.trim() !== '') {
        try {
          const { getProfile } = await import('../../service/authService');
          const profileData = await getProfile();
          const userData = profileData.result || profileData;
          
          console.log('✅ UserAvatar - Fetched user data from API:', userData);
          
          // Map dữ liệu từ API sang format hiển thị
          const mappedUser = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            fullName: userData.fullname,
            avatar: userData.avatar,
            role: userData.role,
            level: userData.currentLevel?.levelNumber || 1,
            levelName: userData.currentLevel?.levelName || 'Beginner',
            totalXp: userData.totalXp || 0,
            provider: userData.provider,
            streak: userData.streak?.currentStreak ?? 0,
            coins: userData.coins ?? 0
          };
          
          setUser(mappedUser);
          setIsLoading(false);
        } catch (error) {
          console.error('❌ UserAvatar - Error fetching user profile:', error);
          setUser(null);
          setIsLoading(false);
        }
      } else {
        console.log('❌ UserAvatar - No token found');
        setUser(null);
        setIsLoading(false);
      }
    };

    loadUserData();

    // Listen for login/logout events to reload user data
    window.addEventListener('userLoggedIn', loadUserData);
    window.addEventListener('userLoggedOut', loadUserData);
    window.addEventListener('storage', loadUserData);
    
    return () => {
      window.removeEventListener('userLoggedIn', loadUserData);
      window.removeEventListener('userLoggedOut', loadUserData);
      window.removeEventListener('storage', loadUserData);
    };
  }, []);

  useEffect(() => {
    // Đóng dropdown khi click bên ngoài
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('user');
    setIsDropdownOpen(false);
    navigate('/login');
  };

  // Hiển thị loading spinner khi đang load user data
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    );
  }
  
  if (!user) return null;

  // Lấy chữ cái đầu của tên để hiển thị nếu không có avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        id="user-avatar-button"
      >
        <div className="relative">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.fullName || user.username}
              className="w-10 h-10 rounded-full object-cover border-2 border-primary"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-bold border-2 border-primary">
              {getInitials(user.fullName || user.username)}
            </div>
          )}
          {/* Online indicator */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        
        {/* User name (desktop only) */}
        <div className="hidden md:flex flex-col items-start">
          <span className="text-sm font-semibold text-gray-900 max-w-[120px] truncate">
            {user.fullName || user.username}
          </span>
          <span className="text-xs text-gray-500">
            Level {user.level || 1}
          </span>
        </div>

        {/* Dropdown arrow */}
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div 
          className="fixed w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-[9999] animate-in slide-in-from-top-2 duration-200"
          style={{
            top: `${dropdownRef.current?.getBoundingClientRect().bottom + 8}px`,
            right: `${window.innerWidth - dropdownRef.current?.getBoundingClientRect().right}px`
          }}
        >
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName || user.username}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-bold text-lg">
                  {getInitials(user.fullName || user.username)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.fullName || user.username}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-semibold text-gray-700">
                  Level {user.level || 1}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              to="/profile"
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <User className="w-4 h-4" />
              <span>Trang cá nhân</span>
            </Link>

            <Link
              to="/settings"
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <Settings className="w-4 h-4" />
              <span>Cài đặt</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
