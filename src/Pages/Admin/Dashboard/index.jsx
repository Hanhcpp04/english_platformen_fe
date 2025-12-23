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
import { getAdminDashboard } from '../../../service/adminService';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await getAdminDashboard();
        console.log('📊 Admin Dashboard Response:', response);
        if (response.code === 1000) {
          console.log('✅ Dashboard data loaded:', response.result);
          console.log('📈 User Growth Data:', response.result?.userGrowthData);
          console.log('📊 Activity Distribution:', response.result?.activityDistribution);
          setDashboardData(response.result);
        } else {
          setError('Không thể tải dữ liệu dashboard');
        }
      } catch (err) {
        console.error('❌ Error fetching dashboard:', err);
        setError('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Map icon names to components
  const iconMap = {
    Users,
    BookOpen,
    GraduationCap,
    Target,
    Award,
    FileText,
  };

  // Map stats data with icons
  const stats = dashboardData?.stats?.map(stat => ({
    ...stat,
    icon: iconMap[stat.icon] || Users,
    bgColor: `bg-${stat.color}-50`,
    iconColor: `text-${stat.color}-600`,
  })) || [];

  const userGrowthData = dashboardData?.userGrowthData || [];
  const activityData = dashboardData?.activityDistribution || [];
  const topicPerformanceData = dashboardData?.topicPerformance || [];
  const recentActivities = dashboardData?.recentActivities || [];

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
          <button className="px-3 py-1 text-xs font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors">
            Tạo báo cáo
          </button>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
        </div>
      )}

      {error && (
        <div className="bg-gray-100 border border-gray-300 text-gray-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {!loading && !error && dashboardData && (
        <>
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
                    <ArrowUp className="w-4 h-4 text-gray-700" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-gray-700" />
                  )}
                  <span className={`font-medium ${stat.isIncrease ? 'text-gray-700' : 'text-gray-700'}`}>
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

          {userGrowthData.length > 0 ? (
          <ChartWrapper height={240}>
            {(width, height) => (
              <LineChart 
                width={width} 
                height={height} 
                data={userGrowthData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#374151"
                  strokeWidth={2}
                  dot={{ fill: '#374151', r: 4 }}
                  name="Tổng người dùng"
                />
                <Line
                  type="monotone"
                  dataKey="active"
                  stroke="#6b7280"
                  strokeWidth={2}
                  dot={{ fill: '#6b7280', r: 4 }}
                  name="Người dùng hoạt động"
                />
              </LineChart>
            )}
          </ChartWrapper>
          ) : (
            <div className="flex items-center justify-center h-60 text-gray-400">
              <p>Chưa có dữ liệu</p>
            </div>
          )}
        </div>

        {/* Activity Distribution Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Phân bổ hoạt động</h2>
              <p className="text-xs text-gray-600">Tương tác người dùng theo loại (30 ngày gần nhất)</p>
            </div>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>

          {activityData.length > 0 ? (
          <ChartWrapper height={280}>
            {(width, height) => {
              const chartWidth = width;
              const chartHeight = height;
              const pieRadius = Math.min(80, Math.floor(Math.min(chartWidth * 0.35, chartHeight * 0.35)));
              const cx = chartWidth * 0.35;
              const cy = chartHeight / 2;
              
              return (
                <PieChart width={chartWidth} height={chartHeight}>
                  <Pie
                    data={activityData}
                    cx={cx}
                    cy={cy}
                    labelLine={false}
                    label={false}
                    outerRadius={pieRadius}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, name]}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    wrapperStyle={{ fontSize: '12px', paddingLeft: '10px' }}
                    formatter={(value, entry) => `${entry.payload.name}: ${entry.payload.value}%`}
                  />
                </PieChart>
              );
            }}
          </ChartWrapper>
          ) : (
            <div className="flex items-center justify-center h-60 text-gray-400">
              <p>Chưa có dữ liệu hoạt động</p>
            </div>
          )}
        </div>
      </div>

      {/* Topic Performance Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Hiệu suất theo chủ đề</h2>
            <p className="text-xs text-gray-600">Top 5 chủ đề được học nhiều nhất</p>
          </div>
        </div>

        {topicPerformanceData.length > 0 && topicPerformanceData[0].topic !== "Chưa có dữ liệu" ? (
        <ChartWrapper height={300}>
          {(width, height) => (
            <BarChart 
              width={width} 
              height={height} 
              data={topicPerformanceData}
              margin={{ top: 5, right: 20, left: 0, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="topic" 
                stroke="#6b7280" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                interval={0}
                style={{ fontSize: '11px' }}
                tick={{ dy: 5 }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="completed" fill="#374151" radius={[8, 8, 0, 0]} name="Hoàn thành" />
              <Bar dataKey="inProgress" fill="#6b7280" radius={[8, 8, 0, 0]} name="Đang tiến hành" />
            </BarChart>
          )}
        </ChartWrapper>
        ) : (
          <div className="flex items-center justify-center h-60 text-gray-400">
            <p>Chưa có dữ liệu học tập theo chủ đề</p>
          </div>
        )}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl border border-gray-200 p-4"> {/* p-6 -> p-4 */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Hoạt động gần đây</h2>
            <p className="text-xs text-gray-600">Hành động và thành tựu gần đây của người dùng</p>
          </div>
          <button className="text-xs text-gray-800 hover:text-gray-900 font-medium">Xem tất cả</button>
        </div>
        <div className="space-y-3"> {/* space-y-4 -> space-y-3 */}
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-semibold text-sm">
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
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
