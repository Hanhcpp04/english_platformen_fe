import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Save, 
  X, 
  Eye, 
  AlertCircle, 
  CheckCircle2, 
  Image as ImageIcon,
  Code,
  List,
  Heading,
  HelpCircle,
  Clock,
  Edit3,
} from "lucide-react";
import { toast } from "react-toastify";
import ForumHeader from "../../../components/Popups/forum/ForumHeader";
import Breadcrumb from "../../../components/Popups/forum/Breadcrumb";
import RichTextEditor from "../../../components/Popups/forum/RichTextEditor";
import TagSelector from "../../../components/Popups/forum/TagSelector";
import MediaUploader from "../../../components/Popups/forum/MediaUploader";

// Mock data - Replace with API call
const getPostById = (id) => {
  const mockPosts = {
    3: {
      id: 3,
      title: "Tips for improving IELTS Speaking confidence",
      content: "Practice speaking in front of mirror, record yourself and listen back to improve pronunciation. Focus on fluency over accuracy in the beginning...",
      tags: ["IELTS", "Speaking"],
      images: [],
      created_at: "3 ngày trước",
      updated_at: null,
    },
    7: {
      id: 7,
      title: "Common mistakes in English grammar",
      content: "Let's discuss the most common grammar mistakes Vietnamese learners make when learning English...",
      tags: ["Grammar", "Tips"],
      images: ["https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600"],
      created_at: "1 tuần trước",
      updated_at: null,
    },
  };
  return mockPosts[id];
};

export default function EditPostPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [originalPost, setOriginalPost] = useState(null);

  // Load post data
  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoadingPost(true);
        // TODO: Replace with actual API call
        const post = getPostById(postId);
        
        if (!post) {
          toast.error("Không tìm thấy bài viết!");
          navigate("/forum/my-posts");
          return;
        }

        setOriginalPost(post);
        setTitle(post.title);
        setContent(post.content);
        setTags(post.tags);
        setFiles(post.images || []);
        setLoadingPost(false);
      } catch (error) {
        toast.error("Có lỗi khi tải bài viết!");
        navigate("/forum/my-posts");
      }
    };

    if (postId) {
      loadPost();
    }
  }, [postId, navigate]);

  // Track changes for unsaved warning
  useEffect(() => {
    if (originalPost) {
      const hasChanges = 
        title !== originalPost.title ||
        content !== originalPost.content ||
        JSON.stringify(tags) !== JSON.stringify(originalPost.tags) ||
        files.length !== (originalPost.images?.length || 0);
      setIsDirty(hasChanges);
    }
  }, [title, content, tags, files, originalPost]);

  // Real-time validation
  useEffect(() => {
    const errors = {};
    if (title && title.length < 10) {
      errors.title = "Tiêu đề phải có ít nhất 10 ký tự";
    }
    if (content && content.length < 20) {
      errors.content = "Nội dung phải có ít nhất 20 ký tự";
    }
    if (isDirty && tags.length === 0) {
      errors.tags = "Vui lòng chọn ít nhất 1 tag";
    }
    setValidationErrors(errors);
  }, [title, content, tags, isDirty]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề!");
      return;
    }
    if (title.length < 10) {
      toast.error("Tiêu đề phải có ít nhất 10 ký tự!");
      return;
    }
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung!");
      return;
    }
    if (content.length < 20) {
      toast.error("Nội dung phải có ít nhất 20 ký tự!");
      return;
    }
    if (tags.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 tag!");
      return;
    }

    setLoading(true);
    try {
      // TODO: Call API to update post
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("Cập nhật bài viết thành công!");
      setIsDirty(false);
      navigate("/forum/my-posts");
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm("Bạn có thay đổi chưa lưu. Bạn có chắc muốn hủy?")) {
        navigate("/forum/my-posts");
      }
    } else {
      navigate("/forum/my-posts");
    }
  };

  const isFormValid = () => {
    return title.length >= 10 && content.length >= 20 && tags.length > 0;
  };

  if (loadingPost) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* <ForumHeader /> */}
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải bài viết...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <ForumHeader /> */}

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Breadcrumb items={["Forum", "Bài viết của tôi", "Chỉnh sửa bài viết"]} />

        {/* Header Section */}
        <div className="mb-6">
          <h1 className="font-heading font-bold text-3xl text-gray-900 mb-2 flex items-center gap-3">
            <Edit3 size={32} className="text-primary-600" />
            Chỉnh sửa bài viết
          </h1>
          <p className="text-gray-600 font-body">
            Cập nhật nội dung bài viết của bạn
            {originalPost?.created_at && (
              <span className="ml-2 text-sm">
                • Đăng {originalPost.created_at}
                {originalPost?.updated_at && ` • Sửa lần cuối ${originalPost.updated_at}`}
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Editor Panel - 3/4 width */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Title Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <label className="mb-3 font-semibold text-gray-900 font-body flex items-center gap-2">
                  <Heading size={18} className="text-primary-600" />
                  Tiêu đề bài viết <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full border ${
                    validationErrors.title ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-600'
                  } rounded-lg px-4 py-3.5 text-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all font-body placeholder:text-gray-400`}
                  placeholder="VD: How to improve English speaking skills effectively?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                />
                <div className="flex items-center justify-between mt-2">
                  {validationErrors.title ? (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {validationErrors.title}
                    </span>
                  ) : title.length >= 10 ? (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Tiêu đề hợp lệ
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">
                      Tiêu đề rõ ràng, cụ thể giúp bạn nhận được câu trả lời tốt hơn
                    </span>
                  )}
                  <span className="text-xs text-gray-500 font-medium">
                    {title.length}/200
                  </span>
                </div>
              </div>

              {/* Tags Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <label className="mb-3 font-semibold text-gray-900 font-body flex items-center gap-2">
                  <List size={18} className="text-primary-600" />
                  Chọn tags <span className="text-red-500">*</span>
                </label>
                <TagSelector
                  selectedTags={tags}
                  onChange={setTags}
                  maxTags={5}
                />
                {validationErrors.tags && (
                  <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {validationErrors.tags}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Thêm tối đa 5 tags để phân loại bài viết (VD: IELTS, Grammar, Vocabulary...)
                </p>
              </div>

              {/* Content Editor Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-semibold text-gray-900 font-body flex items-center gap-2">
                    <Code size={18} className="text-primary-600" />
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                  >
                    <Eye size={14} />
                    {showPreview ? "Chỉnh sửa" : "Xem trước"}
                  </button>
                </div>
                
                {!showPreview ? (
                  <>
                    <RichTextEditor
                      value={content}
                      onChange={setContent}
                      placeholder="Nhập nội dung chi tiết... Hỗ trợ Markdown và formatting"
                      maxLength={10000}
                    />
                    {validationErrors.content && (
                      <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {validationErrors.content}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="prose prose-sm max-w-none border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[300px]">
                    <div className="text-gray-700 font-body whitespace-pre-wrap">
                      {content || "Chưa có nội dung..."}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    Viết chi tiết, dễ hiểu. Sử dụng ví dụ nếu có thể
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {content.length}/10,000
                  </span>
                </div>
              </div>

              {/* Media Uploader Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <label className="mb-3 font-semibold text-gray-900 font-body flex items-center gap-2">
                  <ImageIcon size={18} className="text-primary-600" />
                  Tệp đính kèm <span className="text-gray-500 font-normal text-sm">(tùy chọn)</span>
                </label>
                <MediaUploader files={files} onChange={setFiles} maxFiles={5} />
                <p className="text-xs text-gray-500 mt-2">
                  Hỗ trợ ảnh, video, tài liệu. Tối đa 5 tệp, mỗi tệp &lt; 10MB
                </p>
              </div>

              {/* Action Buttons - Sticky Bottom */}
              <div className="sticky bottom-0 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {isDirty ? (
                      <span className="text-xs text-amber-600 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg">
                        <Clock size={14} />
                        Bạn có thay đổi chưa lưu
                      </span>
                    ) : (
                      <span className="text-xs text-green-600 flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-lg">
                        <CheckCircle2 size={14} />
                        Không có thay đổi
                      </span>
                    )}
                    {!isFormValid() && (
                      <span className="text-xs text-red-600 flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg">
                        <AlertCircle size={14} />
                        Form chưa hợp lệ
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={loading}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 font-body"
                    >
                      <X size={18} />
                      Hủy
                    </button>

                    <button
                      type="submit"
                      disabled={loading || !isFormValid() || !isDirty}
                      className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-body shadow-md"
                    >
                      <Save size={18} />
                      {loading ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar - Tips & Status */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              
              {/* Edit Tips Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 font-heading">
                  <HelpCircle size={20} className="text-blue-600" />
                  Tips chỉnh sửa
                </h3>
                <ul className="space-y-2.5 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Cập nhật thông tin mới nhất và chính xác</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Sửa lỗi chính tả và ngữ pháp</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Thêm ví dụ hoặc hình ảnh minh họa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Cải thiện cấu trúc và định dạng</span>
                  </li>
                </ul>
              </div>

              {/* Form Status Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-3 font-heading">
                  Trạng thái
                </h3>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tiêu đề</span>
                    {title.length >= 10 ? (
                      <CheckCircle2 size={16} className="text-green-600" />
                    ) : (
                      <AlertCircle size={16} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tags</span>
                    {tags.length > 0 ? (
                      <CheckCircle2 size={16} className="text-green-600" />
                    ) : (
                      <AlertCircle size={16} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Nội dung</span>
                    {content.length >= 20 ? (
                      <CheckCircle2 size={16} className="text-green-600" />
                    ) : (
                      <AlertCircle size={16} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Thay đổi</span>
                    {isDirty ? (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded font-medium">
                        Chưa lưu
                      </span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                        Đã lưu
                      </span>
                    )}
                  </div>
                </div>
                
                {isFormValid() && isDirty && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                      <CheckCircle2 size={16} />
                      <span className="font-medium">Sẵn sàng cập nhật!</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Original Post Info */}
              {originalPost && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-3 font-heading">
                    Thông tin bài viết
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-primary-600" />
                      <span>Đăng: {originalPost.created_at}</span>
                    </div>
                    {originalPost.updated_at && (
                      <div className="flex items-center gap-2">
                        <Edit3 size={14} className="text-blue-600" />
                        <span>Sửa: {originalPost.updated_at}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Preview */}
              {(title || content) && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 font-heading">
                    <Eye size={18} className="text-primary-600" />
                    Preview nhanh
                  </h3>
                  
                  {title && (
                    <h4 className="font-bold text-base text-gray-900 mb-2 line-clamp-2">
                      {title}
                    </h4>
                  )}
                  
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded-md text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {content && (
                    <p className="text-xs text-gray-600 line-clamp-4">
                      {content}
                    </p>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
