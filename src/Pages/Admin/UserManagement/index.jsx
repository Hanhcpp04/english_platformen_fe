import React, { useState, useEffect } from 'react';
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
  Eye,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';
import * as adminService from '../../../service/adminService';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [editingUser, setEditingUser] = useState(null);

  // Fetch users từ API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllUsers(currentPage, pageSize);
      if (response.code === 1000 && response.result) {
        setUsers(response.result.content || []);
        setTotalPages(response.result.totalPages || 0);
        setTotalElements(response.result.totalElements || 0);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize]);

  // Toggle active/inactive
  const handleToggleActive = async (userId, currentStatus) => {
    const status = currentStatus ? 'delete' : 'restore';
    try {
      const response = await adminService.deleteOrRestoreUser(userId, status);
      if (response.code === 1000) {
        toast.success(currentStatus ? 'Đã vô hiệu hóa tài khoản' : 'Đã khôi phục tài khoản');
        fetchUsers(); // Refresh data
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Không thể cập nhật trạng thái tài khoản');
    }
  };

  // Update role
  const handleUpdateRole = async (userId, newRole) => {
    try {
      const response = await adminService.updateUserRole(userId, newRole);
      if (response.code === 1000) {
        toast.success('Đã cập nhật vai trò người dùng');
        fetchUsers(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Không thể cập nhật vai trò');
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const stats = [
    { label: 'Tổng người dùng', value: totalElements, icon: User, color: 'blue' },
    { label: 'Người dùng hoạt động', value: users.filter(u => u.isActive).length, icon: Shield, color: 'green' },
    { label: 'Quản trị viên', value: users.filter(u => u.role === 'ADMIN').length, icon: Shield, color: 'purple' },
    { label: 'Tổng XP', value: users.reduce((acc, u) => acc + (u.totalXp || 0), 0).toLocaleString(), icon: Award, color: 'yellow' },
  ];

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
          <button
            onClick={fetchUsers}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
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
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.fullname || user.username}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Crect width="32" height="32" fill="%233b82f6"/%3E%3Ctext x="50%25" y="50%25" fill="white" font-size="16" text-anchor="middle" dy=".3em"%3E' + (user.fullname?.charAt(0) || user.username?.charAt(0) || '?') + '%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                          {user.fullname?.charAt(0) || user.username?.charAt(0) || '?'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{user.fullname || user.username}</div>
                        <div className="text-xs text-gray-500 truncate">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border-0 ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      <option value="USER">Người dùng</option>
                      <option value="ADMIN">Quản trị</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <div className="text-sm text-gray-900">Cấp {user.levelNumber || 1}</div>
                    <div className="text-xs text-gray-500">{user.levelName || 'Newbie'}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{(user.totalXp || 0).toLocaleString()} XP</div>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '-'}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(user.id, user.isActive)}
                        className={`px-2 py-1 text-xs rounded ${user.isActive ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                        title={user.isActive ? 'Vô hiệu hóa' : 'Khôi phục'}
                        disabled={loading}
                      >
                        {user.isActive ? 'Vô hiệu hóa' : 'Khôi phục'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination (compact) */}
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex items-center justify-between text-sm">
          <div className="text-gray-600">
            Hiển thị <span className="font-medium text-gray-900">{filteredUsers.length}</span> / <span className="font-medium">{totalElements}</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0 || loading}
              className="px-2 py-1 text-sm border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <span className="px-3 py-1 text-sm">
              Trang {currentPage + 1} / {totalPages || 1}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage >= totalPages - 1 || loading}
              className="px-2 py-1 text-sm border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tiếp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
