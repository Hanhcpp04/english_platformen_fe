import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const learningLinks = [
    { label: 'Từ vựng', href: '/vocabulary' },
    { label: 'Ngữ pháp', href: '/grammar' },
    { label: 'Luyện viết', href: '/writing' },
  ];

  const communityLinks = [
    { label: 'Diễn đàn', href: '/forum' },
    { label: 'Bảng xếp hạng', href: '/leaderboard' },
  ];

  const aboutLinks = [
    { label: 'Về chúng tôi', href: '/about' },
    { label: 'Liên hệ', href: '/contact' },
    { label: 'Điều khoản', href: '/terms' },
    { label: 'Chính sách', href: '/privacy' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'Youtube' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Logo + Tagline */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                English Smart
              </span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Học tiếng Anh thông minh với AI. Nâng cao kỹ năng ngôn ngữ của bạn mọi lúc, mọi nơi.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-primary hover:border-primary hover:shadow-md transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Học tập */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4 relative inline-block">
              Học tập
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
            </h3>
            <ul className="space-y-3">
              {learningLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-600 hover:text-primary text-sm transition-all duration-200 inline-flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-primary rounded-full transition-all duration-200 group-hover:w-2 mr-0 group-hover:mr-2" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Cộng đồng */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4 relative inline-block">
              Cộng đồng
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
            </h3>
            <ul className="space-y-3">
              {communityLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-600 hover:text-primary text-sm transition-all duration-200 inline-flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-primary rounded-full transition-all duration-200 group-hover:w-2 mr-0 group-hover:mr-2" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Về chúng tôi */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4 relative inline-block">
              Về chúng tôi
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
            </h3>
            <ul className="space-y-3 mb-6">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-600 hover:text-primary text-sm transition-all duration-200 inline-flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-primary rounded-full transition-all duration-200 group-hover:w-2 mr-0 group-hover:mr-2" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Newsletter */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600 font-medium">Nhận tin mới nhất</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                />
                <button className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm text-center md:text-left">
              © {currentYear} English Smart. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs text-center md:text-right">
              Made with ❤️ for language learners
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
