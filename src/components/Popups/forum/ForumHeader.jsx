import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, User, LogOut, FileText, Bookmark, Settings, ChevronDown } from "lucide-react";

export default function   ForumHeader() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const menuRef = useRef(null);

  // Mock current user
  const currentUser = {
    name: "Nguyễn Văn A",
    username: "nguyenvana",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  };

  // Mock search suggestions
  const searchSuggestions = [
    "How to improve IELTS Writing",
    "Grammar tips for beginners",
    "Best resources for learning English",
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/forum?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchSuggestions(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/forum"
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors shrink-0"
        >
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="font-heading font-bold text-xl hidden sm:block text-dark-primary">
            Forum
          </span>
        </Link>

        

        {/* Right Side: Notifications + User Menu */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} className="text-gray-600" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                {notifications}
              </span>
            )}
          </button>

          {/* User Avatar + Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <ChevronDown size={16} className="text-gray-600 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-fade-in">
                <div className="p-3 border-b border-gray-100">
                  <div className="font-semibold text-dark-primary">{currentUser.name}</div>
                  <div className="text-sm text-gray-500">@{currentUser.username}</div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-body"
                  >
                    <User size={16} /> My Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/forum/me");
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-body"
                  >
                    <FileText size={16} /> My Posts
                  </button>
                  <button
                    onClick={() => {
                      navigate("/forum/saved");
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-body"
                  >
                    <Bookmark size={16} /> Saved Posts
                  </button>
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-body"
                  >
                    <Settings size={16} /> Settings
                  </button>
                </div>
                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={() => {
                      // Handle logout
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm text-red-600 font-body"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
