import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileText,
  Settings,
  GraduationCap,
  Layers,
  MessageSquare,
  PenTool,
  FileSpreadsheet,
  Home,
  ChevronRight,
  LogOut,
  Search,
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';

/**
 * Complete Admin Dashboard Preview
 * Strict Minimalist Design - Monochrome/Zinc Colors Only
 * 
 * This is a static preview component showing the complete layout
 * Use this as a visual reference for the design system
 */
const AdminDashboardPreview = () => {
  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard', active: false },
    { title: 'Quản lý User', icon: Users, path: '/admin/users', active: false },
    { title: 'Quản lý Chủ đề', icon: Layers, path: '/admin/topics', active: false },
    { title: 'Quản lý Từ vựng', icon: BookOpen, path: '/admin/vocabulary', active: false },
    { title: 'Quản lý Ngữ pháp', icon: GraduationCap, path: '/admin/grammar', active: true },
    { title: 'Bài học Ngữ pháp', icon: FileText, path: '/admin/grammar-lessons', active: false },
    { title: 'Quản lý Viết', icon: PenTool, path: '/admin/writing', active: false },
    { title: 'Quản lý Forum', icon: MessageSquare, path: '/admin/forum', active: false },
    { title: 'Báo Cáo', icon: FileSpreadsheet, path: '/admin/reports', active: false },
    { title: 'Cài đặt', icon: Settings, path: '/admin/settings', active: false },
  ];

  const sampleData = [
    {
      id: 1,
      name: 'Present Simple',
      description: 'Thì hiện tại đơn - Cách dùng và cấu trúc',
      level: 'Basic',
      status: 'Public',
      date: '15/12/2025'
    },
    {
      id: 2,
      name: 'Present Continuous',
      description: 'Thì hiện tại tiếp diễn',
      level: 'Basic',
      status: 'Public',
      date: '16/12/2025'
    },
    {
      id: 3,
      name: 'Past Perfect',
      description: 'Thì quá khứ hoàn thành - Nâng cao',
      level: 'Advanced',
      status: 'Draft',
      date: '18/12/2025'
    },
    {
      id: 4,
      name: 'Future Forms',
      description: 'Các dạng thì tương lai trong tiếng Anh',
      level: 'Advanced',
      status: 'Public',
      date: '20/12/2025'
    },
    {
      id: 5,
      name: 'Modal Verbs',
      description: 'Động từ khuyết thiếu và cách sử dụng',
      level: 'Basic',
      status: 'Public',
      date: '21/12/2025'
    },
  ];

  return (
    <div className="flex h-screen bg-zinc-50">
      {/* Sidebar - Fixed, w-64 */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col">
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-zinc-200">
          <div>
            <span className="text-lg font-bold text-black">English Smart</span>
            <span className="ml-2 text-xs text-zinc-500 font-normal">Admin</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index} className="relative">
                {/* Black vertical indicator for active item */}
                {item.active && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-black rounded-r" />
                )}
                <a
                  href={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150
                    ${item.active
                      ? 'bg-zinc-100 text-black font-medium'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{item.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info Footer */}
        <div className="border-t border-zinc-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white font-semibold text-sm">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-800 truncate">Admin User</p>
              <p className="text-xs text-zinc-500 truncate">admin@englishsmart.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-zinc-200 h-16 flex items-center justify-between px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm">
            <Home className="w-4 h-4 text-zinc-500" />
            <ChevronRight className="w-4 h-4 text-zinc-300" />
            <span className="text-zinc-500">Admin</span>
            <ChevronRight className="w-4 h-4 text-zinc-300" />
            <span className="text-zinc-900 font-medium">Quản lý Ngữ pháp</span>
          </nav>

          {/* Logout Button */}
          <button className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </header>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto bg-zinc-50 p-8">
          <div className="max-w-full space-y-6">
            {/* Page Title */}
            <div>
              <h1 className="text-2xl font-semibold text-zinc-900">Quản lý Ngữ pháp</h1>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài học..."
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-900 text-zinc-900 placeholder-zinc-400"
                />
              </div>

              {/* Add Button */}
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-md text-sm hover:bg-zinc-800 transition-colors">
                <Plus className="w-4 h-4" />
                + Thêm bài học
              </button>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Tên Bài Học</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Cấp Độ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Trạng Thái</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Ngày Tạo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {sampleData.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-zinc-600">#{item.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-zinc-900">{item.name}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">{item.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-700">
                          {item.level}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.status === 'Public' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">
                            Public
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-600">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600">{item.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white rounded-lg border border-zinc-200 px-6 py-4 flex justify-between items-center">
              <span className="text-sm text-zinc-600">
                Hiển thị 5 / 25 bài học
              </span>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 border border-zinc-200 rounded-md text-sm text-zinc-700 hover:bg-zinc-50 transition-colors">
                  Trước
                </button>
                <span className="px-4 py-2 text-sm text-zinc-700">
                  Trang 1 / 5
                </span>
                <button className="px-4 py-2 border border-zinc-200 rounded-md text-sm text-zinc-700 hover:bg-zinc-50 transition-colors">
                  Sau
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPreview;
