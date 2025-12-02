import React, { useState, useEffect } from 'react';
import { 
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  MessageSquare,
  Star,
  Filter,
  Download,
  User
} from 'lucide-react';

const WritingManagement = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [searchQuery, statusFilter, submissions]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      // Mock data - Replace with actual API call
      setTimeout(() => {
        const mockSubmissions = [
          {
            id: 1,
            userId: 1,
            username: 'johndoe',
            userFullname: 'John Doe',
            taskTitle: 'Argumentative Essay',
            taskType: 'Essay',
            content: 'In today\'s digital age, technology has become an integral part of our lives...',
            wordCount: 350,
            status: 'pending',
            score: null,
            feedback: null,
            submittedAt: '2024-11-20T10:30:00',
            reviewedAt: null,
            reviewedBy: null
          },
          {
            id: 2,
            userId: 2,
            username: 'janesmith',
            userFullname: 'Jane Smith',
            taskTitle: 'Descriptive Writing',
            taskType: 'Paragraph',
            content: 'The old library stood at the corner of Main Street, its weathered brick walls...',
            wordCount: 180,
            status: 'reviewed',
            score: 8.5,
            feedback: 'Good use of descriptive language. Consider varying sentence structure more.',
            submittedAt: '2024-11-19T14:20:00',
            reviewedAt: '2024-11-20T09:15:00',
            reviewedBy: 'Teacher Admin'
          },
          {
            id: 3,
            userId: 3,
            username: 'mikejohnson',
            userFullname: 'Mike Johnson',
            taskTitle: 'Opinion Essay',
            taskType: 'Essay',
            content: 'Social media has revolutionized the way we communicate...',
            wordCount: 420,
            status: 'reviewed',
            score: 7.0,
            feedback: 'Clear arguments but needs more supporting evidence. Good structure overall.',
            submittedAt: '2024-11-18T16:45:00',
            reviewedAt: '2024-11-19T11:30:00',
            reviewedBy: 'Teacher Admin'
          },
          {
            id: 4,
            userId: 4,
            username: 'sarahwilson',
            userFullname: 'Sarah Wilson',
            taskTitle: 'Narrative Writing',
            taskType: 'Story',
            content: 'It was a dark and stormy night when everything changed...',
            wordCount: 280,
            status: 'pending',
            score: null,
            feedback: null,
            submittedAt: '2024-11-20T08:15:00',
            reviewedAt: null,
            reviewedBy: null
          },
          {
            id: 5,
            userId: 5,
            username: 'tombrown',
            userFullname: 'Tom Brown',
            taskTitle: 'Compare and Contrast',
            taskType: 'Essay',
            content: 'While both methods have their merits, there are distinct differences...',
            wordCount: 390,
            status: 'pending',
            score: null,
            feedback: null,
            submittedAt: '2024-11-20T11:00:00',
            reviewedAt: null,
            reviewedBy: null
          }
        ];
        setSubmissions(mockSubmissions);
        setFilteredSubmissions(mockSubmissions);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setLoading(false);
    }
  };

  const filterSubmissions = () => {
    let filtered = submissions;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.userFullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.taskTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSubmissions(filtered);
  };

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
    setShowDetailModal(true);
  };

  const handleReview = (submissionId, score, feedback) => {
    setSubmissions(submissions.map(s =>
      s.id === submissionId
        ? {
            ...s,
            status: 'reviewed',
            score,
            feedback,
            reviewedAt: new Date().toISOString(),
            reviewedBy: 'Current Admin'
          }
        : s
    ));
    setShowDetailModal(false);
  };

  const stats = [
    {
      label: 'Tổng bài nộp',
      value: submissions.length,
      icon: FileText,
      color: 'blue'
    },
    {
      label: 'Chờ chấm',
      value: submissions.filter(s => s.status === 'pending').length,
      icon: Clock,
      color: 'yellow'
    },
    {
      label: 'Đã chấm',
      value: submissions.filter(s => s.status === 'reviewed').length,
      icon: CheckCircle,
      color: 'green'
    },
    {
      label: 'Điểm TB',
      value: (submissions
        .filter(s => s.score)
        .reduce((sum, s) => sum + s.score, 0) /
        submissions.filter(s => s.score).length || 0).toFixed(1),
      icon: Star,
      color: 'purple'
    }
  ];

  const DetailModal = () => {
    const [reviewScore, setReviewScore] = useState(selectedSubmission?.score || '');
    const [reviewFeedback, setReviewFeedback] = useState(selectedSubmission?.feedback || '');

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Chi tiết bài nộp</h2>
            <button
              onClick={() => setShowDetailModal(false)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <XCircle className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Submission Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Học viên</div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                    {selectedSubmission?.userFullname.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{selectedSubmission?.userFullname}</div>
                    <div className="text-xs text-gray-500">@{selectedSubmission?.username}</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Bài tập</div>
                <div className="text-sm font-medium text-gray-900">{selectedSubmission?.taskTitle}</div>
                <div className="text-xs text-gray-500">{selectedSubmission?.taskType}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Thời gian nộp</div>
                <div className="text-sm text-gray-900">
                  {new Date(selectedSubmission?.submittedAt).toLocaleString('vi-VN')}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Số từ</div>
                <div className="text-sm font-medium text-gray-900">{selectedSubmission?.wordCount} từ</div>
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Nội dung bài viết:</div>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-900 leading-relaxed">
                {selectedSubmission?.content}
              </div>
            </div>

            {/* Review Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="text-sm font-medium text-gray-700 mb-4">
                {selectedSubmission?.status === 'reviewed' ? 'Kết quả chấm' : 'Chấm điểm'}
              </div>
              
              {selectedSubmission?.status === 'reviewed' ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="text-xs text-gray-600">Điểm số</div>
                      <div className="text-lg font-semibold text-gray-900">{selectedSubmission.score}/10</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Nhận xét</div>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900">
                      {selectedSubmission.feedback}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Chấm bởi {selectedSubmission.reviewedBy} lúc {new Date(selectedSubmission.reviewedAt).toLocaleString('vi-VN')}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Điểm số (0-10)</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={reviewScore}
                      onChange={(e) => setReviewScore(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
                      placeholder="Nhập điểm..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Nhận xét</label>
                    <textarea
                      value={reviewFeedback}
                      onChange={(e) => setReviewFeedback(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
                      placeholder="Nhập nhận xét chi tiết..."
                      rows={4}
                    />
                  </div>
                  <button
                    onClick={() => handleReview(selectedSubmission.id, parseFloat(reviewScore), reviewFeedback)}
                    disabled={!reviewScore || !reviewFeedback}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Hoàn thành chấm điểm
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-56">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header + Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Quản lý Writing</h1>
          <p className="text-sm text-gray-500 mt-0.5">Chấm điểm và quản lý bài viết</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm học viên hoặc bài tập..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md w-64 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="pending">Chờ chấm</option>
              <option value="reviewed">Đã chấm</option>
            </select>
          </div>

          <button className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Xuất
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-3 bg-white border border-gray-200 rounded-md px-3 py-2 min-w-[160px]">
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

      {/* Submissions Table */}
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Học viên</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Bài tập</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Số từ</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Trạng thái</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Điểm</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Thời gian</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                        {submission.userFullname.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{submission.userFullname}</div>
                        <div className="text-xs text-gray-500">@{submission.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">{submission.taskTitle}</div>
                    <div className="text-xs text-gray-500">{submission.taskType}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900">{submission.wordCount}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                      submission.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {submission.status === 'pending' ? (
                        <><Clock className="w-3 h-3" /> Chờ chấm</>
                      ) : (
                        <><CheckCircle className="w-3 h-3" /> Đã chấm</>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {submission.score ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-900">{submission.score}/10</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Chưa chấm</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(submission.submittedAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleViewDetails(submission)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Eye className="w-4 h-4" />
                      {submission.status === 'pending' ? 'Chấm điểm' : 'Xem'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex items-center justify-between text-sm">
          <div className="text-gray-600">
            Hiển thị <span className="font-medium text-gray-900">{filteredSubmissions.length}</span> / <span className="font-medium">{submissions.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 text-sm border border-gray-200 rounded hover:bg-gray-100">Trước</button>
            <button className="px-2 py-1 text-sm bg-blue-600 text-white rounded">1</button>
            <button className="px-2 py-1 text-sm border border-gray-200 rounded hover:bg-gray-100">Tiếp</button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredSubmissions.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900 mb-1">Không tìm thấy bài nộp</h3>
          <p className="text-sm text-gray-600">Thử điều chỉnh bộ lọc hoặc tìm kiếm</p>
        </div>
      )}

      {showDetailModal && selectedSubmission && <DetailModal />}
    </div>
  );
};

export default WritingManagement;
