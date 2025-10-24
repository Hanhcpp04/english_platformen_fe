import React, { useState } from 'react';
import { 
  Search, 
  Edit, 
  MoreVertical,
  Shield,
  User,
  Mail,
  Calendar,
  Award,
  Filter,
  Download,
  Eye
} from 'lucide-react';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  

  // Replace static users array with stateful users so we can modify it
  const [users, setUsers] = useState([
    {
      id: 1,
      username: 'johndoe',
      email: 'john.doe@example.com',
      fullname: 'John Doe',
      role: 'USER',
      totalXp: 12450,
      level: 5,
      isActive: true,
      createdAt: '2024-01-15',
      lastActive: '2 hours ago',
    },
    {
      id: 2,
      username: 'janesmith',
      email: 'jane.smith@example.com',
      fullname: 'Jane Smith',
      role: 'USER',
      totalXp: 8920,
      level: 4,
      isActive: true,
      createdAt: '2024-02-20',
      lastActive: '5 minutes ago',
    },
    {
      id: 3,
      username: 'admin',
      email: 'admin@englishsmart.com',
      fullname: 'Admin User',
      role: 'ADMIN',
      totalXp: 0,
      level: 0,
      isActive: true,
      createdAt: '2023-12-01',
      lastActive: 'Just now',
    },
    {
      id: 4,
      username: 'mikejohnson',
      email: 'mike.johnson@example.com',
      fullname: 'Mike Johnson',
      role: 'USER',
      totalXp: 15680,
      level: 6,
      isActive: false,
      createdAt: '2024-01-08',
      lastActive: '2 days ago',
    },
    {
      id: 5,
      username: 'sarahwilson',
      email: 'sarah.wilson@example.com',
      fullname: 'Sarah Wilson',
      role: 'USER',
      totalXp: 6540,
      level: 3,
      isActive: true,
      createdAt: '2024-03-12',
      lastActive: '1 hour ago',
    },
  ]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const stats = [
    { label: 'Tổng người dùng', value: users.length, icon: User, color: 'blue' },
    { label: 'Người dùng hoạt động', value: users.filter(u => u.isActive).length, icon: Shield, color: 'green' },
    { label: 'Quản trị viên', value: users.filter(u => u.role === 'ADMIN').length, icon: Shield, color: 'purple' },
    { label: 'Tổng XP', value: users.reduce((acc, u) => acc + u.totalXp, 0).toLocaleString(), icon: Award, color: 'yellow' },
  ];

  // Toggle active/inactive
  const handleToggleActive = (userId) => {
    setUsers((prev) => prev.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
  };

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Quản lý người dùng</h1>
          <p className="text-sm text-gray-500 mt-0.5">Tổng quan & quản lý nhanh</p>
        </div>

        {/* Toolbar (search + filter + export) */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm tên, email, tài khoản..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md w-64 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="USER">Người dùng</option>
              <option value="ADMIN">Quản trị</option>
            </select>
          </div>

          <button className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Xuất
          </button>
        </div>
      </div>

      {/* Compact Stats (single row, small cards) */}
      <div className="flex flex-wrap gap-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-3 bg-white border border-gray-200 rounded-md px-3 py-2 min-w-[180px]">
            <div className={`p-2 rounded-md bg-${stat.color}-50`}>
              <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
            </div>
            <div>
              <div className="text-xs text-gray-500">{stat.label}</div>
              <div className="text-sm font-semibold text-gray-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table (compact) */}
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Người dùng</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Vai trò</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Cấp / XP</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Trạng thái</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Hoạt động</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                        {user.fullname.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{user.fullname}</div>
                        <div className="text-xs text-gray-500 truncate">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {user.role === 'ADMIN' ? 'Quản trị' : 'Người dùng'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="text-sm text-gray-900">Cấp {user.level}</div>
                    <div className="text-xs text-gray-500">{user.totalXp.toLocaleString()} XP</div>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-500">{user.lastActive}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-blue-600 hover:text-blue-900" title="Xem">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-gray-900" title="Sửa">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(user.id)}
                        className={`px-2 py-1 text-xs rounded ${user.isActive ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}
                        title={user.isActive ? 'Tắt kích hoạt' : 'Bật kích hoạt'}
                      >
                        {user.isActive ? 'Tắt' : 'Bật'}
                      </button>
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination (compact) */}
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex items-center justify-between text-sm">
          <div className="text-gray-600">Hiển thị <span className="font-medium text-gray-900">{filteredUsers.length}</span> / <span className="font-medium">{users.length}</span></div>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 text-sm border border-gray-200 rounded hover:bg-gray-100">Trước</button>
            <button className="px-2 py-1 text-sm bg-blue-600 text-white rounded">1</button>
            <button className="px-2 py-1 text-sm border border-gray-200 rounded hover:bg-gray-100">2</button>
            <button className="px-2 py-1 text-sm border border-gray-200 rounded hover:bg-gray-100">Tiếp</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
