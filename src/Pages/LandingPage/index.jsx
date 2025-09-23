import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [xpAnimation, setXpAnimation] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Minh Tú",
      level: "Intermediate",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b9e7d2c3?w=64&h=64&fit=crop&crop=face",
      quote: "EnglishSmart đã giúp tôi cải thiện vocabulary từ 2000 lên 5000 từ chỉ trong 3 tháng!",
      rating: 5
    },
    {
      id: 2,
      name: "Trần Đức Nam",
      level: "Advanced",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      quote: "AI chat bot giúp tôi tự tin giao tiếp tiếng Anh hơn rất nhiều. Highly recommended!",
      rating: 5
    },
    {
      id: 3,
      name: "Lê Thị Hoa",
      level: "Expert",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      quote: "Gamification system rất thú vị, tôi không còn cảm thấy nhàm chán khi học English nữa!",
      rating: 5
    }
  ];

  // Auto-slide testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // XP Animation trigger
  const triggerXpAnimation = () => {
    setXpAnimation(true);
    setTimeout(() => setXpAnimation(false), 2000);
  };

  return (
    <div className="landing-page bg-gradient-to-br from-white via-blue-50 to-indigo-100 min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg fixed w-full z-50 top-0 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="text-3xl font-bold font-kumbh">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  🎓 EnglishSmart
                </span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="top-menu-item text-gray-700 font-medium font-montserrat">Trang chủ</a>
              <a href="#features" className="top-menu-item text-gray-700 font-medium font-montserrat">Tính năng</a>
              <a href="#how-it-works" className="top-menu-item text-gray-700 font-medium font-montserrat">Cách hoạt động</a>
              <a href="#testimonials" className="top-menu-item text-gray-700 font-medium font-montserrat">Đánh giá</a>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 transition duration-300 font-medium font-montserrat"
              >
                Đăng nhập
              </Link>
              <Link
                to="/signup"
                className="btn-primary px-6 py-3 text-base font-semibold"
              >
                🚀 Bắt đầu ngay
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}>
                  </path>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t">
              <div className="px-4 py-6 space-y-4">
                <a href="#home" className="block text-gray-700 font-medium">Trang chủ</a>
                <a href="#features" className="block text-gray-700 font-medium">Tính năng</a>
                <a href="#how-it-works" className="block text-gray-700 font-medium">Cách hoạt động</a>
                <a href="#testimonials" className="block text-gray-700 font-medium">Đánh giá</a>
                <Link to="/login" className="block text-gray-700 font-medium">Đăng nhập</Link>
                <Link to="/signup" className="block btn-primary px-6 py-3 text-center">🚀 Bắt đầu ngay</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section relative overflow-hidden min-h-screen flex items-center pt-20">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-10">
          <div className="floating-shapes">
            <div className="shape shape-1 absolute top-20 left-10 w-20 h-20 bg-blue-400 rounded-full animate-bounce delay-100"></div>
            <div className="shape shape-2 absolute top-40 right-20 w-16 h-16 bg-purple-400 rounded-full animate-bounce delay-300"></div>
            <div className="shape shape-3 absolute bottom-40 left-20 w-24 h-24 bg-pink-400 rounded-full animate-bounce delay-500"></div>
            <div className="shape shape-4 absolute top-60 left-1/2 w-12 h-12 bg-yellow-400 rounded-full animate-pulse delay-700"></div>
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8 animate-fade-in">
              <h1 className="text-5xl lg:text-7xl font-bold font-kumbh text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 leading-tight">
                Học Tiếng Anh<br />
                <span className="text-primary animate-pulse">Thông Minh</span><br />
                với AI
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 font-montserrat max-w-lg leading-relaxed">
                Hệ thống gamification độc đáo, AI hỗ trợ 24/7 giúp bạn tiến bộ nhanh chóng và hiệu quả
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/signup"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl text-lg shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    🚀 Bắt Đầu Miễn Phí
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                
                <button className="group px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a2 2 0 002 2h2a2 2 0 002-2v-4M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1"></path>
                  </svg>
                  📹 Xem Demo
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center group cursor-pointer">
                  <div className="text-4xl font-bold text-blue-600 font-kumbh group-hover:scale-110 transition-transform duration-300">10,000+</div>
                  <div className="text-sm text-gray-600 font-montserrat">Học viên</div>
                  <div className="w-8 h-1 bg-blue-600 mx-auto mt-2 rounded-full"></div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="text-4xl font-bold text-purple-600 font-kumbh group-hover:scale-110 transition-transform duration-300">95%</div>
                  <div className="text-sm text-gray-600 font-montserrat">Cải thiện</div>
                  <div className="w-8 h-1 bg-purple-600 mx-auto mt-2 rounded-full"></div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="text-4xl font-bold text-pink-600 font-kumbh group-hover:scale-110 transition-transform duration-300">24/7</div>
                  <div className="text-sm text-gray-600 font-montserrat">AI Support</div>
                  <div className="w-8 h-1 bg-pink-600 mx-auto mt-2 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Dashboard */}
            <div className="relative">
              <div className="hero-dashboard bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 border border-gray-100">
                <div className="dashboard-header flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl animate-pulse">
                    🎓
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-lg font-kumbh">English Dashboard</div>
                    <div className="text-sm text-gray-500 font-montserrat">Level: Intermediate ⭐</div>
                  </div>
                </div>
                
                <div className="progress-bars space-y-4">
                  <div className="skill-item">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium font-montserrat flex items-center gap-2">
                        📚 Vocabulary
                      </span>
                      <span className="text-sm text-blue-600 font-bold">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out relative" 
                        style={{width: '85%'}}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="skill-item">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium font-montserrat flex items-center gap-2">
                        📝 Grammar
                      </span>
                      <span className="text-sm text-purple-600 font-bold">72%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out relative" 
                        style={{width: '72%'}}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="skill-item">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium font-montserrat flex items-center gap-2">
                        🗣️ Speaking
                      </span>
                      <span className="text-sm text-pink-600 font-bold">68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-pink-500 to-pink-600 h-3 rounded-full transition-all duration-1000 ease-out relative" 
                        style={{width: '68%'}}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="achievements mt-6 grid grid-cols-3 gap-3">
                  <div className="achievement-badge bg-gradient-to-r from-yellow-100 to-yellow-200 p-3 rounded-xl text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <div className="text-2xl animate-bounce">🏆</div>
                    <div className="text-xs font-medium font-montserrat">Word Master</div>
                  </div>
                  <div className="achievement-badge bg-gradient-to-r from-green-100 to-green-200 p-3 rounded-xl text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <div className="text-2xl animate-pulse">⚡</div>
                    <div className="text-xs font-medium font-montserrat">Speed Learner</div>
                  </div>
                  <div className="achievement-badge bg-gradient-to-r from-purple-100 to-purple-200 p-3 rounded-xl text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <div className="text-2xl animate-spin" style={{animationDuration: '3s'}}>🎯</div>
                    <div className="text-xs font-medium font-montserrat">Goal Crusher</div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white text-2xl animate-pulse shadow-lg">
                ⭐
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white text-xl animate-bounce shadow-lg">
                🚀
              </div>
              <div className="absolute top-1/2 -right-8 w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm animate-ping">
                💫
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center cursor-pointer hover:border-blue-500 transition-colors duration-300">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-ping"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white relative" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-bold font-kumbh text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
              Tính Năng Đột Phá
            </h2>
            <p className="text-xl text-gray-600 font-montserrat max-w-3xl mx-auto leading-relaxed">
              Nền tảng học tiếng Anh thông minh với công nghệ AI tiên tiến và phương pháp gamification hiện đại
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Vocabulary Feature */}
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-kumbh group-hover:text-blue-600 transition-colors duration-300">Smart Vocabulary</h3>
              <p className="text-gray-600 leading-relaxed font-montserrat">
                Học từ vựng thông minh với AI phân tích khả năng và đề xuất từ phù hợp với trình độ
              </p>
              <div className="mt-4 flex justify-center">
                <div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">10,000+ từ vựng</div>
              </div>
            </div>

            {/* Grammar Feature */}
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center border border-gray-100 hover:border-purple-200 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-kumbh group-hover:text-purple-600 transition-colors duration-300">AI Grammar</h3>
              <p className="text-gray-600 leading-relaxed font-montserrat">
                Hệ thống ngữ pháp AI sửa lỗi real-time và giải thích chi tiết từng quy tắc
              </p>
              <div className="mt-4 flex justify-center">
                <div className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold">Real-time correction</div>
              </div>
            </div>

            {/* AI Chat Feature */}
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center border border-gray-100 hover:border-green-200 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-kumbh group-hover:text-green-600 transition-colors duration-300">AI Chat Bot</h3>
              <p className="text-gray-600 leading-relaxed font-montserrat">
                Trò chuyện với AI 24/7, luyện speaking và nhận feedback chi tiết về phát âm
              </p>
              <div className="mt-4 flex justify-center">
                <div className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold">24/7 available</div>
              </div>
            </div>

            {/* Gamification Feature */}
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center border border-gray-100 hover:border-yellow-200 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <span className="text-3xl">🎮</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-kumbh group-hover:text-yellow-600 transition-colors duration-300">Gamification</h3>
              <p className="text-gray-600 leading-relaxed font-montserrat">
                Hệ thống XP, level, badge và leaderboard biến việc học thành trò chơi thú vị
              </p>
              <div className="mt-4 flex justify-center">
                <div className="bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full text-sm font-semibold">50+ achievements</div>
              </div>
            </div>

            {/* Community Feature */}
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center border border-gray-100 hover:border-pink-200 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-kumbh group-hover:text-pink-600 transition-colors duration-300">Community</h3>
              <p className="text-gray-600 leading-relaxed font-montserrat">
                Kết nối với cộng đồng học viên, chia sẻ kinh nghiệm và cùng nhau tiến bộ
              </p>
              <div className="mt-4 flex justify-center">
                <div className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm font-semibold">10,000+ members</div>
              </div>
            </div>

            {/* Progress Tracking Feature */}
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-kumbh group-hover:text-indigo-600 transition-colors duration-300">Progress Analytics</h3>
              <p className="text-gray-600 leading-relaxed font-montserrat">
                Theo dõi tiến độ chi tiết với biểu đồ, thống kê và báo cáo học tập cá nhân
              </p>
              <div className="mt-4 flex justify-center">
                <div className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-semibold">Smart analytics</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-bold font-kumbh text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
              Cách Thức Hoạt Động
            </h2>
            <p className="text-xl text-gray-600 font-montserrat max-w-3xl mx-auto leading-relaxed">
              Chỉ với 4 bước đơn giản, bạn sẽ bắt đầu hành trình học tiếng Anh hiệu quả
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform -translate-y-1/2"></div>
            
            <div className="grid lg:grid-cols-4 gap-8 relative">
              {/* Step 1 */}
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-all duration-300 relative z-10">
                    <span className="text-3xl text-white">📝</span>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-200 rounded-full opacity-20 group-hover:scale-125 transition-all duration-300"></div>
                  <div className="lg:hidden w-1 h-16 bg-gradient-to-b from-blue-500 to-purple-500 mx-auto mt-4"></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-blue-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-kumbh">Đăng Ký</h3>
                  <p className="text-gray-600 font-montserrat leading-relaxed">
                    Tạo tài khoản miễn phí chỉ trong 30 giây với email hoặc Google/Facebook
                  </p>
                  <div className="mt-4">
                    <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                      Bước 1
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-all duration-300 relative z-10">
                    <span className="text-3xl text-white">🎯</span>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-200 rounded-full opacity-20 group-hover:scale-125 transition-all duration-300"></div>
                  <div className="lg:hidden w-1 h-16 bg-gradient-to-b from-purple-500 to-pink-500 mx-auto mt-4"></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-purple-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-kumbh">Đánh Giá Trình Độ</h3>
                  <p className="text-gray-600 font-montserrat leading-relaxed">
                    AI đánh giá khả năng hiện tại qua bài test 10 phút để tạo lộ trình cá nhân
                  </p>
                  <div className="mt-4">
                    <span className="inline-block bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
                      Bước 2
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-all duration-300 relative z-10">
                    <span className="text-3xl text-white">📚</span>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-pink-200 rounded-full opacity-20 group-hover:scale-125 transition-all duration-300"></div>
                  <div className="lg:hidden w-1 h-16 bg-gradient-to-b from-pink-500 to-green-500 mx-auto mt-4"></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-pink-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-kumbh">Học Tập Cá Nhân</h3>
                  <p className="text-gray-600 font-montserrat leading-relaxed">
                    Bài học được AI tùy chỉnh theo trình độ, tốc độ học và mục tiêu của bạn
                  </p>
                  <div className="mt-4">
                    <span className="inline-block bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-semibold">
                      Bước 3
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-all duration-300 relative z-10">
                    <span className="text-3xl text-white">🚀</span>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-200 rounded-full opacity-20 group-hover:scale-125 transition-all duration-300"></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-green-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-kumbh">Tiến Bộ Rõ Rệt</h3>
                  <p className="text-gray-600 font-montserrat leading-relaxed">
                    Theo dõi kết quả học tập qua biểu đồ, nhận certificate và thăng level
                  </p>
                  <div className="mt-4">
                    <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                      Bước 4
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Connecting arrows for larger screens */}
            <div className="hidden lg:flex absolute top-1/2 left-0 right-0 justify-between px-12 transform -translate-y-1/2 pointer-events-none">
              <div className="flex-1 flex justify-center">
                <svg className="w-8 h-8 text-blue-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                </svg>
              </div>
              <div className="flex-1 flex justify-center">
                <svg className="w-8 h-8 text-purple-500 animate-pulse" style={{animationDelay: '0.5s'}} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                </svg>
              </div>
              <div className="flex-1 flex justify-center">
                <svg className="w-8 h-8 text-pink-500 animate-pulse" style={{animationDelay: '1s'}} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gamification Preview Section */}
      <section className="py-20 bg-white relative overflow-hidden" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-bold font-kumbh text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 mb-6">
              Trải Nghiệm Gamification
            </h2>
            <p className="text-xl text-gray-600 font-montserrat max-w-3xl mx-auto leading-relaxed">
              Học tiếng Anh như chơi game với hệ thống XP, cấp độ và achievement độc đáo
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Interactive Demo */}
            <div className="space-y-8">
              {/* XP System */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-3xl border border-yellow-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 font-kumbh flex items-center gap-3">
                    <span className="text-3xl">⚡</span>
                    Hệ Thống XP
                  </h3>
                  <button 
                    onClick={triggerXpAnimation}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full font-semibold hover:scale-105 transition-transform duration-300"
                  >
                    +50 XP
                  </button>
                </div>
                
                <div className="relative">
                  <div className="flex justify-between mb-2">
                    <span className="text-lg font-semibold text-gray-700">Level 15 Progress</span>
                    <span className="text-lg font-bold text-orange-600">2,450 / 3,000 XP</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`bg-gradient-to-r from-yellow-500 to-orange-500 h-4 rounded-full transition-all duration-1000 ease-out relative ${xpAnimation ? 'animate-pulse' : ''}`}
                      style={{width: '82%'}}
                    >
                      <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                    </div>
                  </div>
                  
                  {xpAnimation && (
                    <div className="absolute -top-8 right-20 text-2xl font-bold text-orange-600 animate-bounce">
                      +50 XP! 🎉
                    </div>
                  )}
                </div>
              </div>

              {/* Level System */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-3xl border border-purple-200 hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-900 font-kumbh flex items-center gap-3 mb-6">
                  <span className="text-3xl">🏆</span>
                  Cấp Độ & Thứ Hạng
                </h3>
                
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-2xl shadow-md">
                    <div className="text-2xl mb-2">🥉</div>
                    <div className="text-sm font-semibold text-gray-600">Beginner</div>
                    <div className="text-xs text-gray-500">Level 1-5</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-2xl shadow-md">
                    <div className="text-2xl mb-2">🥈</div>
                    <div className="text-sm font-semibold text-gray-600">Elementary</div>
                    <div className="text-xs text-gray-500">Level 6-10</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl shadow-md border-2 border-purple-300">
                    <div className="text-2xl mb-2">🥇</div>
                    <div className="text-sm font-semibold text-purple-700">Intermediate</div>
                    <div className="text-xs text-purple-600">Level 11-20</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-2xl shadow-md opacity-60">
                    <div className="text-2xl mb-2">💎</div>
                    <div className="text-sm font-semibold text-gray-600">Expert</div>
                    <div className="text-xs text-gray-500">Level 21+</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Badge Showcase & Leaderboard */}
            <div className="space-y-8">
              {/* Achievement Badges */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-3xl border border-green-200 hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-900 font-kumbh flex items-center gap-3 mb-6">
                  <span className="text-3xl">🏅</span>
                  Achievement Badges
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="group text-center p-4 bg-white rounded-2xl shadow-md hover:scale-105 transition-all duration-300">
                    <div className="text-3xl mb-2 group-hover:animate-spin" style={{animationDuration: '2s'}}>🎯</div>
                    <div className="text-sm font-semibold text-gray-700">Streak Master</div>
                    <div className="text-xs text-green-600">7 ngày liên tiếp</div>
                  </div>
                  
                  <div className="group text-center p-4 bg-white rounded-2xl shadow-md hover:scale-105 transition-all duration-300">
                    <div className="text-3xl mb-2 group-hover:animate-bounce">📚</div>
                    <div className="text-sm font-semibold text-gray-700">Word Collector</div>
                    <div className="text-xs text-blue-600">1000+ từ vựng</div>
                  </div>
                  
                  <div className="group text-center p-4 bg-white rounded-2xl shadow-md hover:scale-105 transition-all duration-300">
                    <div className="text-3xl mb-2 group-hover:animate-pulse">⚡</div>
                    <div className="text-sm font-semibold text-gray-700">Speed Demon</div>
                    <div className="text-xs text-purple-600">Hoàn thành nhanh</div>
                  </div>
                  
                  <div className="group text-center p-4 bg-white rounded-2xl shadow-md hover:scale-105 transition-all duration-300">
                    <div className="text-3xl mb-2 group-hover:animate-spin" style={{animationDuration: '3s'}}>🌟</div>
                    <div className="text-sm font-semibold text-gray-700">Perfect Score</div>
                    <div className="text-xs text-yellow-600">100% chính xác</div>
                  </div>
                  
                  <div className="group text-center p-4 bg-white rounded-2xl shadow-md hover:scale-105 transition-all duration-300">
                    <div className="text-3xl mb-2 group-hover:animate-bounce">🎪</div>
                    <div className="text-sm font-semibold text-gray-700">Grammar Guru</div>
                    <div className="text-xs text-indigo-600">Chuyên gia ngữ pháp</div>
                  </div>
                  
                  <div className="group text-center p-4 bg-white rounded-2xl shadow-md hover:scale-105 transition-all duration-300">
                    <div className="text-3xl mb-2 group-hover:animate-pulse">🎭</div>
                    <div className="text-sm font-semibold text-gray-700">Speaking Star</div>
                    <div className="text-xs text-pink-600">Nói giỏi nhất</div>
                  </div>
                </div>
              </div>

              {/* Leaderboard Preview */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-3xl border border-blue-200 hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-900 font-kumbh flex items-center gap-3 mb-6">
                  <span className="text-3xl">🏆</span>
                  Bảng Xếp Hạng
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border-2 border-yellow-300">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">🥇</div>
                      <div>
                        <div className="font-bold text-gray-800">Bạn</div>
                        <div className="text-sm text-gray-600">Level 15</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-600">2,450 XP</div>
                      <div className="text-sm text-gray-600">#1 tuần này</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">🥈</div>
                      <div>
                        <div className="font-semibold text-gray-700">Minh Anh</div>
                        <div className="text-sm text-gray-600">Level 14</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-600">2,380 XP</div>
                      <div className="text-sm text-gray-500">#2</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">🥉</div>
                      <div>
                        <div className="font-semibold text-gray-700">Quang Huy</div>
                        <div className="text-sm text-gray-600">Level 13</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-600">2,120 XP</div>
                      <div className="text-sm text-gray-500">#3</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-bold font-kumbh text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
              Học Viên Nói Gì Về Chúng Tôi
            </h2>
            <p className="text-xl text-gray-600 font-montserrat max-w-3xl mx-auto leading-relaxed">
              Hàng nghìn học viên đã thành công với EnglishSmart
            </p>
          </div>

          {/* Testimonial Slider */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-100 to-yellow-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              
              <div className="relative z-10">
                {/* Quote Icon */}
                <div className="text-6xl text-gray-300 mb-6 text-center">
                  <span className="font-serif">"</span>
                </div>

                {/* Testimonial Content */}
                <div className="text-center transition-all duration-500 ease-in-out">
                  <p className="text-xl md:text-2xl text-gray-700 font-montserrat leading-relaxed mb-8 italic">
                    {testimonials[currentTestimonial].quote}
                  </p>
                  
                  {/* Star Rating */}
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <span key={i} className="text-2xl text-yellow-400 animate-pulse" style={{animationDelay: `${i * 0.1}s`}}>
                        ⭐
                      </span>
                    ))}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center justify-center gap-4">
                    <img 
                      src={testimonials[currentTestimonial].avatar} 
                      alt={testimonials[currentTestimonial].name}
                      className="w-16 h-16 rounded-full object-cover shadow-lg ring-4 ring-white"
                    />
                    <div className="text-left">
                      <h4 className="text-lg font-bold text-gray-900 font-kumbh">
                        {testimonials[currentTestimonial].name}
                      </h4>
                      <p className="text-gray-600 font-montserrat">
                        <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {testimonials[currentTestimonial].level}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-8 gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button 
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-blue-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            
            <button 
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-blue-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 font-kumbh mb-2 group-hover:scale-110 transition-transform duration-300">
                98%
              </div>
              <div className="text-gray-600 font-montserrat">Hài lòng</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 font-kumbh mb-2 group-hover:scale-110 transition-transform duration-300">
                4.9
              </div>
              <div className="text-gray-600 font-montserrat">Đánh giá ⭐</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-bold text-pink-600 font-kumbh mb-2 group-hover:scale-110 transition-transform duration-300">
                500+
              </div>
              <div className="text-gray-600 font-montserrat">Reviews</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-bold text-green-600 font-kumbh mb-2 group-hover:scale-110 transition-transform duration-300">
                85%
              </div>
              <div className="text-gray-600 font-montserrat">Tiến bộ nhanh</div>
            </div>
          </div>
        </div>
      </section>
      {/* Pricing/CTA Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-bold font-kumbh text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-6">
              Miễn Phí Cho Tất Cả Tính Năng
            </h2>
            <p className="text-xl text-gray-600 font-montserrat max-w-3xl mx-auto leading-relaxed">
              Trải nghiệm đầy đủ EnglishSmart mà không mất phí. Bắt đầu hành trình học tiếng Anh ngay hôm nay!
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Main CTA Card */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white text-center relative overflow-hidden shadow-2xl">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10">
                <div className="text-6xl mb-6">🎉</div>
                <h3 className="text-3xl md:text-4xl font-bold font-kumbh mb-6">
                  Hoàn Toàn Miễn Phí!
                </h3>
                <p className="text-xl mb-8 opacity-90 font-montserrat max-w-2xl mx-auto">
                  ✅ AI Chat Bot 24/7<br/>
                  ✅ 10,000+ từ vựng<br/>
                  ✅ Gamification hoàn chỉnh<br/>
                  ✅ Progress tracking<br/>
                  ✅ Community access
                </p>

                {/* Sign up form */}
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto">
                  <h4 className="text-2xl font-bold mb-6 font-kumbh">Tham Gia Ngay</h4>
                  
                  <form className="space-y-4">
                    <div>
                      <input
                        type="email"
                        placeholder="Email của bạn"
                        className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 font-montserrat focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-white text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      🚀 Tham Gia Miễn Phí
                    </button>
                  </form>

                  {/* Social Login */}
                  <div className="mt-6">
                    <div className="text-sm opacity-70 mb-4">Hoặc đăng ký với</div>
                    <div className="flex gap-4 justify-center">
                      <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all duration-300">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="text-sm font-semibold">Google</span>
                      </button>
                      <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all duration-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span className="text-sm font-semibold">Facebook</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-sm opacity-70">
                  🔒 Không cần thẻ tín dụng • Hủy bất kỳ lúc nào
                </div>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2 font-kumbh">100% Miễn Phí</h4>
                <p className="text-gray-600 font-montserrat">Không có chi phí ẩn hay phí phát sinh</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2 font-kumbh">Bảo Mật Cao</h4>
                <p className="text-gray-600 font-montserrat">Dữ liệu được mã hóa và bảo vệ an toàn</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2 font-kumbh">Bắt Đầu Ngay</h4>
                <p className="text-gray-600 font-montserrat">Chỉ 30 giây để thiết lập tài khoản</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white py-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-pink-400 rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="text-3xl font-bold font-kumbh mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                🎓 EnglishSmart
              </div>
              <p className="text-gray-300 leading-relaxed font-montserrat mb-6 max-w-md">
                Nền tảng học tiếng Anh thông minh với AI, giúp hàng nghìn người Việt chinh phục tiếng Anh một cách hiệu quả và thú vị.
              </p>
              
              {/* Social Media */}
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12C24.007 5.367 18.641.001.012.001 12.017 0z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-6 font-kumbh">Sản Phẩm</h3>
              <ul className="space-y-3 text-gray-300 font-montserrat">
                <li><a href="#features" className="hover:text-white transition duration-300 hover:translate-x-1 inline-block">Tính năng</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition duration-300 hover:translate-x-1 inline-block">Cách hoạt động</a></li>
                <li><a href="#" className="hover:text-white transition duration-300 hover:translate-x-1 inline-block">Mobile App</a></li>
                <li><a href="#" className="hover:text-white transition duration-300 hover:translate-x-1 inline-block">API</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-xl font-bold mb-6 font-kumbh">Hỗ Trợ</h3>
              <ul className="space-y-3 text-gray-300 font-montserrat">
                <li><a href="#" className="hover:text-white transition duration-300 hover:translate-x-1 inline-block">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-white transition duration-300 hover:translate-x-1 inline-block">Liên hệ</a></li>
                <li><a href="#" className="hover:text-white transition duration-300 hover:translate-x-1 inline-block">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-white transition duration-300 hover:translate-x-1 inline-block">Điều khoản sử dụng</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-center md:text-left font-montserrat">
                &copy; 2024 EnglishSmart. Tất cả quyền được bảo lưu.
              </p>
              
              {/* Trust badges */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-sm font-montserrat">SSL Secured</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  <span className="text-sm font-montserrat">Privacy Protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
