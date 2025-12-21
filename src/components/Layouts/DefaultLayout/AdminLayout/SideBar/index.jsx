import React, { useState } from 'react';
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

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

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

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-opacity-20 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar (compact styles) */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          flex flex-col
          ${collapsed ? 'w-16' : 'w-56'} bg-white text-slate-800
          transform transition-all duration-300 ease-in-out overflow-x-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section (compact) */}
        <div className={`flex items-center justify-between ${collapsed ? 'h-12 px-2' : 'h-14 px-4'} bg-white border-b border-gray-200 transition-all`}>
          <Link to="/admin/dashboard" className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} group`}>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-md p-2">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div className={`${collapsed ? 'hidden' : ''}`}>
              <span className="text-sm font-semibold text-slate-800 block">English Smart</span>
              <span className="text-xs text-slate-400">Admin</span>
            </div>
          </Link>
          
          {/* Collapse/Expand + Mobile close */}
          <div className="flex items-center">
            <button
              onClick={() => setCollapsed((s) => !s)}
              className="text-slate-500 hover:text-slate-800 p-1 rounded"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Mở rộng' : 'Thu gọn'}
            >
              <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : 'rotate-0'}`} />
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-slate-500 hover:text-slate-800 ml-2"
              title="Đóng"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Menu (compact spacing, smaller font) */}
        <nav className="flex-1 overflow-y-auto py-3 px-1">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  title={collapsed ? item.title : undefined}
                  className={`
                    flex items-center ${collapsed ? 'justify-center px-1 py-2' : 'gap-3 px-3 py-2'}
                    rounded-md transition-colors duration-150 text-sm
                    ${isActiveLink(item.path)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                    }
                  `}
                >
                  <item.icon className="w-4 h-4" />
                  <span className={`${collapsed ? 'hidden' : 'font-medium text-sm'}`}>{item.title}</span>
                </Link>
                
                {/* Sub-menu items (hidden when collapsed) */}
                {item.subItems && !collapsed && isActiveLink(item.path) && (
                  <ul className="ml-6 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.path}>
                        <Link
                          to={subItem.path}
                          className={`
                            flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-slate-600
                            transition-colors duration-150
                            ${location.pathname === subItem.path
                              ? 'bg-blue-100 text-blue-700'
                              : 'hover:bg-blue-50 hover:text-blue-600'
                            }
                          `}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info Section (compact) */}
        <div className={`border-t border-gray-200 bg-white ${collapsed ? 'p-2' : 'p-3'}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              A
            </div>
            <div className={`flex-1 min-w-0 ${collapsed ? 'hidden' : ''}`}>
              <p className="text-sm font-medium text-slate-800 truncate">Admin User</p>
              <p className="text-xs text-slate-400 truncate">admin@englishsmart.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
