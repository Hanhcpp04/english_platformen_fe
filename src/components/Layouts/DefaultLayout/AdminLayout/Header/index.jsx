import React from 'react';
import { Menu, LogOut, Home, ChevronRight } from 'lucide-react';
import { getProfile } from '../../../../../service/authService';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../../../../service/authService';
import { toast } from 'react-toastify';

const AdminHeader = ({ toggleSidebar }) => {
  const [userProfile, setUserProfile] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getProfile();
        if (response.code === 1000 && response.result) {
          setUserProfile(response.result);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Đăng xuất thành công');
    navigate('/login');
  };

  // Generate breadcrumbs from path
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbMap = {
      'admin': 'Admin',
      'dashboard': 'Dashboard',
      'users': 'Quản lý User',
      'topics': 'Quản lý Chủ đề',
      'vocabulary': 'Quản lý Từ vựng',
      'grammar': 'Quản lý Ngữ pháp',
      'grammar-lessons': 'Bài học Ngữ pháp',
      'writing': 'Quản lý Viết',
      'forum': 'Quản lý Forum',
      'reports': 'Báo Cáo',
      'settings': 'Cài đặt'
    };

    return pathSegments.map(segment => breadcrumbMap[segment] || segment);
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="bg-white border-b border-zinc-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
      {/* Left Section - Breadcrumbs */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm">
          <Home className="w-4 h-4 text-zinc-500" />
          <ChevronRight className="w-4 h-4 text-zinc-300" />
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <span className={`${index === breadcrumbs.length - 1 ? 'text-zinc-900 font-medium' : 'text-zinc-500'}`}>
                {crumb}
              </span>
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="w-4 h-4 text-zinc-300" />
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right Section - Logout Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors"
          title="Đăng xuất"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden md:inline text-sm">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
