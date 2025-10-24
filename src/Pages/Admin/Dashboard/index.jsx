import React, { useEffect, useState, useRef } from 'react';
import { 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Activity,
  FileText,
  GraduationCap,
  Target,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  // ResponsiveContainer, // no longer used
} from 'recharts';

const AdminDashboard = () => {
  // Dummy Data for Statistics
  
  const stats = [
    {
      title: 'Tổng người dùng',
      value: '2,543',
      change: '+12.5%',
      isIncrease: true,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Số từ vựng',
      value: '4,892',
      change: '+8.2%',
      isIncrease: true,
      icon: BookOpen,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Bài học ngữ pháp',
      value: '328',
      change: '+5.1%',
      isIncrease: true,
      icon: GraduationCap,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Bài tập đang hoạt động',
      value: '1,245',
      change: '-2.4%',
      isIncrease: false,
      icon: Target,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Tổng XP',
      value: '1.2M',
      change: '+18.3%',
      isIncrease: true,
      icon: Award,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'Bài nộp viết',
      value: '892',
      change: '+15.7%',
      isIncrease: true,
      icon: FileText,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
  ];

  
  const userGrowthData = [
    { month: 'Thg 1', users: 1200, active: 980 },
    { month: 'Thg 2', users: 1450, active: 1150 },
    { month: 'Thg 3', users: 1680, active: 1320 },
    { month: 'Thg 4', users: 1920, active: 1580 },
    { month: 'Thg 5', users: 2180, active: 1820 },
    { month: 'Thg 6', users: 2543, active: 2150 },
  ];

 
  const activityData = [
    { name: 'Từ vựng', value: 35, color: '#3b82f6' },
    { name: 'Ngữ pháp', value: 28, color: '#8b5cf6' },
    { name: 'Viết', value: 22, color: '#10b981' },
    { name: 'Bài tập', value: 15, color: '#f59e0b' },
  ];

  // Topic Performance Data (chủ đề sang tiếng Việt)
  const topicPerformanceData = [
    { topic: 'Tiếng Anh Thương mại', completed: 450, inProgress: 120 },
    { topic: 'Du lịch', completed: 380, inProgress: 95 },
    { topic: 'Công nghệ', completed: 320, inProgress: 150 },
    { topic: 'Cuộc sống hàng ngày', completed: 290, inProgress: 80 },
    { topic: 'Ẩm thực', completed: 260, inProgress: 70 },
  ];

  // Recent Activities (nội dung và hành động sang tiếng Việt)
  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'hoàn thành', item: 'Chủ đề Tiếng Anh Thương mại', time: '5 phút trước' },
    { id: 2, user: 'Jane Smith', action: 'đạt được', item: 'Huy hiệu Ngữ pháp', time: '12 phút trước' },
    { id: 3, user: 'Mike Johnson', action: 'đã nộp', item: 'Bài tập viết luận', time: '25 phút trước' },
    { id: 4, user: 'Sarah Wilson', action: 'bắt đầu', item: 'Từ vựng Công nghệ', time: '1 giờ trước' },
    { id: 5, user: 'Tom Brown', action: 'hoàn thành', item: 'Bộ bài tập ngữ pháp', time: '2 giờ trước' },
  ];

  // add mounted flag to avoid rendering ResponsiveContainer before client mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // ChartWrapper: đo chiều rộng container bằng ResizeObserver, render chart khi width > 0
  const ChartWrapper = ({ height = 240, children }) => {
    const ref = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      // set initial width
      setWidth(el.clientWidth || 0);
      const ro = new ResizeObserver(() => {
        if (el) setWidth(el.clientWidth || 0);
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    return (
      <div ref={ref} style={{ width: '100%', height }}>
        {width > 0 ? children(width, height) : <div style={{ width: '100%', height }} />}
      </div>
    );
  };

  return (
    <div className="space-y-4"> {/* giảm khoảng cách từ space-y-6 -> space-y-4 */}
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Bảng điều khiển</h1> {/* text-3xl -> text-2xl, font-bold -> font-semibold */}
          <p className="text-sm text-gray-600 mt-1">Chào mừng trở lại! Đây là những gì đang diễn ra hôm nay.</p> {/* text-sm thay vì default */}
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Xuất dữ liệu
          </button>
          <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            Tạo báo cáo
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* gap-6 -> gap-4 */}
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md transition-shadow" /* p-6 -> p-3 */
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">{stat.title}</p> {/* text-sm -> text-xs */}
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p> {/* text-3xl -> text-2xl, font-bold->font-semibold */}
                <div className="flex items-center gap-1 mt-2 text-xs"> {/* text-sm -> text-xs */}
                  {stat.isIncrease ? (
                    <ArrowUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`font-medium ${stat.isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500">so với tháng trước</span>
                </div>
              </div>
              <div className={`${stat.bgColor} p-2 rounded-lg`}> {/* p-3 -> p-2 */}
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} /> {/* w-6->w-5 */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"> {/* gap-6 -> gap-4 */}
        {/* User Growth Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-4"> {/* p-6 -> p-4 */}
          <div className="flex items-center justify-between mb-4"> {/* mb-6 -> mb-4 */}
            <div>
              <h2 className="text-base font-semibold text-gray-900">Tăng trưởng người dùng</h2> {/* text-lg -> text-base */}
              <p className="text-xs text-gray-600">Tổng và người dùng hoạt động theo thời gian</p> {/* text-sm -> text-xs */}
            </div>
            <Activity className="w-4 h-4 text-gray-400" /> {/* w-5->w-4 */}
          </div>

          <ChartWrapper height={240}>
            {(width, height) => (
              <LineChart width={width} height={height} data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  name="Tổng người dùng"
                />
                <Line
                  type="monotone"
                  dataKey="active"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                  name="Người dùng hoạt động"
                />
              </LineChart>
            )}
          </ChartWrapper>
        </div>

        {/* Activity Distribution Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Phân bổ hoạt động</h2>
              <p className="text-xs text-gray-600">Tương tác người dùng theo loại</p>
            </div>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>

          <ChartWrapper height={240}>
            {(width, height) => (
              <PieChart width={width} height={height}>
                <Pie
                  data={activityData}
                  cx={Math.min(120, width / 2)}
                  cy={height / 2}
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={Math.min(100, Math.floor(Math.min(width, height) / 2) - 10)}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {activityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            )}
          </ChartWrapper>
        </div>
      </div>

      {/* Topic Performance Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Hiệu suất theo chủ đề</h2>
            <p className="text-xs text-gray-600">Hoàn thành vs Đang tiến hành theo chủ đề</p>
          </div>
        </div>

        <ChartWrapper height={240}>
          {(width, height) => (
            <BarChart width={width} height={height} data={topicPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="topic" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="completed" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Hoàn thành" />
              <Bar dataKey="inProgress" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Đang tiến hành" />
            </BarChart>
          )}
        </ChartWrapper>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl border border-gray-200 p-4"> {/* p-6 -> p-4 */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Hoạt động gần đây</h2>
            <p className="text-xs text-gray-600">Hành động và thành tựu gần đây của người dùng</p>
          </div>
          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Xem tất cả</button>
        </div>
        <div className="space-y-3"> {/* space-y-4 -> space-y-3 */}
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  {activity.user.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span>{' '}
                    <span className="text-gray-600">{activity.action}</span>{' '}
                    <span className="font-medium">{activity.item}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
