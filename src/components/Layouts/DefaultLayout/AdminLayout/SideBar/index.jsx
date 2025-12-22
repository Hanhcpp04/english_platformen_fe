import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Library, 
  FileText,
  ClipboardList,
  Award,
  Settings,
  ChevronLeft,
  GraduationCap,
  Layers,
  MessageSquare,
  PenTool,
  FileSpreadsheet
} from 'lucide-react';
import { getProfile } from '../../../../../service/authService';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
    },
    {
      title: 'Quản lý User',
      icon: Users,
      path: '/admin/users',
    },
    {
      title: 'Quản lý Chủ đề',
      icon: Layers,
      path: '/admin/topics',
    },
    {
      title: 'Quản lý Từ vựng',
      icon: BookOpen,
      path: '/admin/vocabulary',
    },
    {
      title: 'Quản lý Ngữ pháp',
      icon: GraduationCap,
      path: '/admin/grammar',
    },
    {
      title: 'Bài học Ngữ pháp',
      icon: FileText,
      path: '/admin/grammar-lessons',
    },
    {
      title: 'Quản lý Viết',
      icon: PenTool,
      path: '/admin/writing',
    },
    {
      title: 'Quản lý Forum',
      icon: MessageSquare,
      path: '/admin/forum',
    },
    {
      title: 'Báo Cáo',
      icon: FileSpreadsheet,
      path: '/admin/reports',
    },
    {
      title: 'Cài đặt',
      icon: Settings,
      path: '/admin/settings',
    },
  ];

  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await getProfile();
        if (mounted && res && res.code === 1000 && res.result) {
          setProfile(res.result);
        }
      } catch (err) {
        console.error('Failed to load profile for sidebar', err);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const getInitials = (name) => {
    if (!name) return 'A';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Strict Minimalist Design */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          flex flex-col
          w-64 bg-white border-r border-zinc-200
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section - Minimalist Design */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-zinc-200">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div>
              <span className="text-lg font-bold text-black">English Smart</span>
              <span className="ml-2 text-xs text-zinc-500 font-normal">Admin</span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu - Strict Minimalist */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = isActiveLink(item.path);
              return (
                <li key={item.path} className="relative">
                  {/* Black vertical indicator for active item */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-black rounded-r" />
                  )}
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150
                      ${isActive
                        ? 'bg-zinc-100 text-black font-medium'
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info Section - Minimalist Footer */}
        <div className="border-t border-zinc-200 p-4">
          <div className="flex items-center gap-3">
            {profile?.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.username || profile.fullname}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white font-semibold text-sm">
                {getInitials(profile?.fullname || profile?.username)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-800 truncate">
                {profile?.fullname || profile?.username || 'Admin User'}
              </p>
              <p className="text-xs text-zinc-500 truncate">{profile?.email || 'admin@englishsmart.com'}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
