import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Menu, X } from 'lucide-react';
import UserAvatar from '../../../../Popups/UserAvatar';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navItems = [
    { label: 'Tính năng', href: '#features' },
    { label: 'Cách hoạt động', href: '#how-it-works' },
    { label: 'Cộng đồng', href: '/forum' },
  ];

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const checkLoginStatus = () => {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      
      console.log('🔍 Header - Raw data:', {
        token: token ? token.substring(0, 20) + '...' : null,
        userStr: userStr ? userStr.substring(0, 50) + '...' : null
      });
      
      // Kiểm tra token có hợp lệ không
      const hasValidToken = token && token !== 'undefined' && token !== 'null' && token.trim() !== '';
      const hasValidUser = userStr && userStr !== 'undefined' && userStr !== 'null';
      
      // Cần có cả token VÀ user data
      const newLoginStatus = hasValidToken && hasValidUser;
      
      console.log('🔍 Header - Login status:', { 
        hasValidToken, 
        hasValidUser, 
        newLoginStatus 
      });
      
      setIsLoggedIn(newLoginStatus);
    };

    checkLoginStatus();
  
    const timeoutId = setTimeout(checkLoginStatus, 100);

    window.addEventListener('storage', checkLoginStatus);
    
 
    window.addEventListener('userLoggedIn', checkLoginStatus);
    window.addEventListener('userLoggedOut', checkLoginStatus);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('userLoggedIn', checkLoginStatus);
      window.removeEventListener('userLoggedOut', checkLoginStatus);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isLoggedIn ? '/dashboard' : '/'} className="flex items-center gap-2 group">
            <div className="bg-primary rounded-xl p-2 transition-transform group-hover:scale-105">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              English Smart
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-700 hover:text-primary font-medium transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <UserAvatar />
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md font-medium bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Bắt đầu học
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col gap-4 mb-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-700 hover:text-primary font-medium transition-colors duration-200 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
              {isLoggedIn ? (
                <div className="px-4">
                  <UserAvatar />
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-md font-medium text-center text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-md font-medium text-center bg-primary text-white hover:bg-primary/90 shadow-md transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Bắt đầu học
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
