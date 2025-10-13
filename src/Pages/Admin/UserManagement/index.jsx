import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
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

  // State for Add/Edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formUser, setFormUser] = useState({
    username: '',
    fullname: '',
    email: '',
    role: 'USER',
    totalXp: 0,
    level: 1,
    isActive: true,
  });

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

  // Open Add modal
  const openAddUser = () => {
    setEditingUserId(null);
    setFormUser({
      username: '',
      fullname: '',
      email: '',
      role: 'USER',
      totalXp: 0,
      level: 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  // Open Edit modal
  const openEditUser = (user) => {
    setEditingUserId(user.id);
    setFormUser({
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      totalXp: user.totalXp,
      level: user.level,
      isActive: user.isActive,
    });
    setIsModalOpen(true);
  };

  // Save Add or Update
  const handleSaveUser = () => {
    if (editingUserId == null) {
      // Add new
      const newUser = {
        id: Date.now(),
        username: formUser.username || `user${Date.now()}`,
        fullname: formUser.fullname || 'Người dùng mới',
        email: formUser.email || '',
        role: formUser.role,
        totalXp: Number(formUser.totalXp) || 0,
        level: Number(formUser.level) || 1,
        isActive: !!formUser.isActive,
        createdAt: new Date().toISOString().split('T')[0],
        lastActive: 'Vừa xong',
      };
      setUsers((prev) => [newUser, ...prev]);
    } else {
      // Update existing
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUserId ? { ...u, ...formUser } : u
        )
      );
    }
    setIsModalOpen(false);
  };

  // Toggle active/inactive
  const handleToggleActive = (userId) => {
    setUsers((prev) => prev.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
  };

  // Delete user
  const handleDeleteUser = (userId) => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;
    setUsers((prev) => prev.filter(u => u.id !== userId));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="text-gray-600 mt-1">Quản lý và theo dõi tất cả người dùng trong hệ thống</p>
        </div>
        <button
          onClick={openAddUser}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm người dùng
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`bg-${stat.color}-50 p-3 rounded-lg`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên, email hoặc tên tài khoản..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="USER">Người dùng</option>
              <option value="ADMIN">Quản trị</option>
            </select>
          </div>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Xuất
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cấp / XP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hoạt động gần đây
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {user.fullname.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.fullname}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {user.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {user.role === 'ADMIN' ? 'Quản trị' : 'Người dùng'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Cấp {user.level}</div>
                    <div className="text-sm text-gray-500">{user.totalXp.toLocaleString()} XP</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {/* view action, placeholder */}}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Xem"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditUser(user)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        title="Sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(user.id)}
                        className={`px-2 py-1 text-xs rounded ${user.isActive ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}
                        title={user.isActive ? 'Tắt kích hoạt' : 'Bật kích hoạt'}
                      >
                        {user.isActive ? 'Tắt' : 'Bật'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Xóa"
                      >
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
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">{filteredUsers.length}</span> trên tổng số{' '}
              <span className="font-medium">{users.length}</span> người dùng
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                Trước
              </button>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                1
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                2
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                Tiếp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add / Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white rounded-lg p-6 z-10 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{editingUserId ? 'Cập nhật người dùng' : 'Thêm người dùng'}</h3>
            <div className="space-y-3">
              <input
                value={formUser.fullname}
                onChange={(e) => setFormUser({ ...formUser, fullname: e.target.value })}
                placeholder="Họ và tên"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                value={formUser.username}
                onChange={(e) => setFormUser({ ...formUser, username: e.target.value })}
                placeholder="Tên tài khoản"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                value={formUser.email}
                onChange={(e) => setFormUser({ ...formUser, email: e.target.value })}
                placeholder="Email"
                className="w-full px-3 py-2 border rounded"
              />
              <div className="flex gap-2">
                <select
                  value={formUser.role}
                  onChange={(e) => setFormUser({ ...formUser, role: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded"
                >
                  <option value="USER">Người dùng</option>
                  <option value="ADMIN">Quản trị</option>
                </select>
                <input
                  type="number"
                  value={formUser.level}
                  onChange={(e) => setFormUser({ ...formUser, level: Number(e.target.value) })}
                  className="w-20 px-3 py-2 border rounded"
                  placeholder="Cấp"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!formUser.isActive}
                    onChange={(e) => setFormUser({ ...formUser, isActive: e.target.checked })}
                  />
                  <span className="text-sm">Hoạt động</span>
                </label>
                <input
                  type="number"
                  value={formUser.totalXp}
                  onChange={(e) => setFormUser({ ...formUser, totalXp: Number(e.target.value) })}
                  className="px-3 py-2 border rounded"
                  placeholder="Tổng XP"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded border">Hủy</button>
                <button onClick={handleSaveUser} className="px-4 py-2 bg-blue-600 text-white rounded">Lưu</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
