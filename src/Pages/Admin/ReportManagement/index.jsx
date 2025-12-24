import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Calendar,
  Filter,
  TrendingUp,
  Users,
  BookOpen,
  PenTool,
  MessageSquare,
  BarChart3,
  Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';
import * as adminService from '../../../service/adminService';

const ReportManagement = () => {
  const [loading, setLoading] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [reportType, setReportType] = useState('OVERALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateGrouping, setDateGrouping] = useState('DAY');
  const [availableReportTypes, setAvailableReportTypes] = useState([]);

  // Report type configurations với icon và mô tả
  const reportTypeConfigs = {
    'OVERALL': {
      label: 'Tổng Quan Hệ Thống',
      icon: BarChart3,
      color: 'blue',
      description: '5 sheets đầy đủ với biểu đồ Pie Chart & Stacked Bar Chart'
    },
    'USER_ACTIVITY': {
      label: 'Hoạt Động Người Dùng',
      icon: Users,
      color: 'green',
      description: 'Dashboard + User Performance với Pie Chart phân bố level'
    },
    'WRITING': {
      label: 'Phân Tích Writing',
      icon: PenTool,
      color: 'pink',
      description: 'AI scores chi tiết với Stacked Bar Chart (top 20)'
    },
    'VOCABULARY': {
      label: 'Phân Tích Retention',
      icon: BookOpen,
      color: 'purple',
      description: 'Funnel analysis cho vocabulary topics'
    },
    'GRAMMAR': {
      label: 'Học Ngữ Pháp',
      icon: TrendingUp,
      color: 'orange',
      description: 'Phân tích tiến độ học ngữ pháp'
    },
    'FORUM': {
      label: 'Diễn Đàn',
      icon: MessageSquare,
      color: 'indigo',
      description: 'Thống kê hoạt động diễn đàn'
    }
  };

  // Fetch report types từ backend
  useEffect(() => {
    const fetchReportTypes = async () => {
      try {
        setLoadingTypes(true);
        const response = await adminService.getReportTypes();
        
        if (response.code === 1000 && response.result) {
          // Map backend types với configs
          const types = response.result.map(type => ({
            value: type,
            ...reportTypeConfigs[type]
          }));
          setAvailableReportTypes(types);
          
          // Set default report type nếu OVERALL có trong danh sách
          if (response.result.includes('OVERALL')) {
            setReportType('OVERALL');
          } else if (response.result.length > 0) {
            setReportType(response.result[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching report types:', error);
        toast.error('Không thể tải danh sách loại báo cáo');
        // Fallback to default types nếu API lỗi
        setAvailableReportTypes([
          { value: 'OVERALL', ...reportTypeConfigs['OVERALL'] },
          { value: 'USER_ACTIVITY', ...reportTypeConfigs['USER_ACTIVITY'] },
          { value: 'WRITING', ...reportTypeConfigs['WRITING'] },
          { value: 'VOCABULARY', ...reportTypeConfigs['VOCABULARY'] }
        ]);
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchReportTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExportReport = async () => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.error('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
      return;
    }

    setLoading(true);
    try {
      const blob = await adminService.exportExcelReport({
        reportType,
        startDate: startDate || null,
        endDate: endDate || null,
        dateGrouping
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `BaoCao_${reportType}_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Xuất báo cáo thành công!');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Lỗi khi xuất báo cáo: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDateRange = (range) => {
    const today = new Date();
    let start = new Date();

    switch (range) {
      case 'today':
        start = today;
        break;
      case 'week':
        start.setDate(today.getDate() - 7);
        break;
      case 'month':
        start.setMonth(today.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(today.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(today.getFullYear() - 1);
        break;
      default:
        start = null;
    }

    if (start) {
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    } else {
      setStartDate('');
      setEndDate('');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileSpreadsheet className="w-8 h-8 text-gray-700" />
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Báo Cáo</h1>
        </div>
        <p className="text-gray-600">Xuất báo cáo chi tiết về hoạt động hệ thống</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Report Types */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-700" />
              Chọn Loại Báo Cáo
            </h2>
            
            {loadingTypes ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-700" />
                <span className="ml-3 text-gray-600">Đang tải loại báo cáo...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableReportTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = reportType === type.value;
                  
                  return (
                    <button
                      key={type.value}
                      onClick={() => setReportType(type.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-gray-700 bg-gray-100'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? 'bg-gray-200' : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            isSelected ? 'text-gray-800' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className={`font-semibold ${
                            isSelected ? 'text-gray-900' : 'text-gray-900'
                          }`}>
                            {type.label}
                          </h3>
                          <p className="text-xs text-gray-600 mt-1">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Date Range Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-700" />
              Khoảng Thời Gian
            </h2>

            {/* Quick Date Range Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => handleQuickDateRange('all')}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Tất cả
              </button>
              <button
                onClick={() => handleQuickDateRange('today')}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Hôm nay
              </button>
              <button
                onClick={() => handleQuickDateRange('week')}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                7 ngày
              </button>
              <button
                onClick={() => handleQuickDateRange('month')}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                30 ngày
              </button>
              <button
                onClick={() => handleQuickDateRange('quarter')}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                3 tháng
              </button>
              <button
                onClick={() => handleQuickDateRange('year')}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                1 năm
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Settings & Export */}
        <div className="space-y-6">
          {/* Date Grouping */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-700" />
              Nhóm Theo
            </h2>
            
            <div className="space-y-2">
              {[
                { value: 'DAY', label: 'Ngày' },
                { value: 'MONTH', label: 'Tháng' },
                { value: 'YEAR', label: 'Năm' }
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="dateGrouping"
                    value={option.value}
                    checked={dateGrouping === option.value}
                    onChange={(e) => setDateGrouping(e.target.value)}
                    className="w-4 h-4 text-gray-700"
                  />
                  <span className="text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Export Button */}
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Xuất Báo Cáo Excel</h3>
            <p className="text-gray-300 text-sm mb-4">
              File Excel Enterprise-grade với biểu đồ, màu sắc Corporate Blue và format chuyên nghiệp
            </p>
            
            <button
              onClick={handleExportReport}
              disabled={loading}
              className="w-full bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang xuất...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Xuất Excel
                </>
              )}
            </button>
          </div>

          {/* Info Card */}
          <div className="bg-gray-100 rounded-xl p-4 border border-gray-300">
            <h4 className="font-semibold text-gray-900 mb-2">💡 Lưu ý</h4>
            <ul className="text-sm text-gray-800 space-y-1">
              <li>• <strong>Enterprise Edition v2.0</strong></li>
              <li>• Corporate Blue theme chuyên nghiệp</li>
              <li>• Biểu đồ tương tác (Pie & Bar Charts)</li>
              <li>• Zebra striping dễ đọc</li>
              <li>• Format số: 1,000 XP, 85.50%</li>
              <li>• Ready-to-print, no gridlines</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportManagement;
