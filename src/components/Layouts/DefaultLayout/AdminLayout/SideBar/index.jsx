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
  Layers
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
      title: 'User Management',
      icon: Users,
      path: '/admin/users',
    },
    {
      title: 'Topic Management',
      icon: Layers,
      path: '/admin/topics',
    },
    {
      title: 'Vocabulary',
      icon: BookOpen,
      path: '/admin/vocabulary',
    },
    {
      title: 'Grammar Lessons',
      icon: GraduationCap,
      path: '/admin/grammar',
    },
    {
      title: 'Exercise Management',
      icon: ClipboardList,
      path: '/admin/exercises',
      subItems: [
        { title: 'Vocabulary Exercises', path: '/admin/exercises/vocabulary' },
        { title: 'Grammar Exercises', path: '/admin/exercises/grammar' },
      ]
    },
    {
      title: 'Writing Categories',
      icon: FileText,
      path: '/admin/writing',
    },
    {
      title: 'Badges',
      icon: Award,
      path: '/admin/badges',
    },
    {
      title: 'Settings',
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
          className="fixed inset-0 bg-black bg-opacity-30 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          flex flex-col
          ${collapsed ? 'w-20' : 'w-64'} bg-white text-slate-800
          transform transition-all duration-300 ease-in-out overflow-x-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className={`flex items-center justify-between ${collapsed ? 'h-12 px-3' : 'h-16 px-6'} bg-white border-b border-gray-200 transition-all`}>
          <Link to="/admin/dashboard" className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2'} group`}>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 transition-transform duration-300 group-hover:scale-110">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div className={`${collapsed ? 'hidden' : ''}`}>
              <span className="text-lg font-bold text-slate-800 block">English Smart</span>
              <span className="text-xs text-slate-500">Admin Panel</span>
            </div>
          </Link>
          
          {/* Collapse/Expand sidebar button (visible on all screens) */}
          <div className="flex items-center">
            <button
              onClick={() => setCollapsed((s) => !s)}
              className="text-slate-500 hover:text-slate-800 p-1 rounded"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : 'rotate-0'}`} />
            </button>

            {/* Close button for mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-slate-500 hover:text-slate-800 ml-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  title={collapsed ? item.title : undefined}
                  className={`
                    flex items-center ${collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5'}
                    rounded-lg transition-all duration-200
                    ${isActiveLink(item.path)
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 text-current ${collapsed ? '' : ''}`} />
                  <span className={`${collapsed ? 'hidden' : 'font-medium'}`}>{item.title}</span>
                </Link>
                
                {/* Sub-menu items (hidden when collapsed) */}
                {item.subItems && !collapsed && isActiveLink(item.path) && (
                  <ul className="ml-8 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.path}>
                        <Link
                          to={subItem.path}
                          className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                            transition-all duration-200
                            ${location.pathname === subItem.path
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
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

        {/* User Info Section */}
        <div className={`p-4 border-t border-gray-200 bg-white ${collapsed ? 'p-3' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              A
            </div>
            <div className={`flex-1 min-w-0 ${collapsed ? 'hidden' : ''}`}>
              <p className="text-sm font-medium text-slate-800 truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">admin@englishsmart.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
