import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Send, 
  Save, 
  X, 
  Eye, 
  AlertCircle, 
  CheckCircle2, 
  Image as ImageIcon,
  Link as LinkIcon,
  Code,
  List,
  Heading,
  Bold,
  Italic,
  Quote,
  HelpCircle
} from "lucide-react";
import { toast } from "react-toastify";
import ForumHeader from "../../../components/Popups/forum/ForumHeader";
import Breadcrumb from "../../../components/Popups/forum/Breadcrumb";
import RichTextEditor from "../../../components/Popups/forum/RichTextEditor";
import TagSelector from "../../../components/Popups/forum/TagSelector";
import MediaUploader from "../../../components/Popups/forum/MediaUploader";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Track changes for unsaved warning
  useEffect(() => {
    if (title || content || tags.length > 0 || files.length > 0) {
      setIsDirty(true);
    }
  }, [title, content, tags, files]);

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
      // TODO: Call API to create post
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("Đăng bài thành công!");
      setIsDirty(false);
      navigate("/forum");
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    // TODO: Save to localStorage or API
    localStorage.setItem(
      "forumPostDraft",
      JSON.stringify({ title, content, tags, files })
    );
    toast.success("Đã lưu bản nháp!");
    setIsDirty(false);
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm("Bạn có thay đổi chưa lưu. Bạn có chắc muốn hủy?")) {
        navigate("/forum");
      }
    } else {
      navigate("/forum");
    }
  };

  const isFormValid = () => {
    return title.length >= 10 && content.length >= 20 && tags.length > 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <ForumHeader /> */}

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Breadcrumb items={["Forum", "Tạo bài viết mới"]} />

        {/* Header Section */}
        <div className="mb-6">
          <h1 className="font-heading font-bold text-3xl text-gray-900 mb-2">
            Tạo bài viết mới
          </h1>
          <p className="text-gray-600 font-body">
            Chia sẻ kiến thức, đặt câu hỏi hoặc thảo luận với cộng đồng English Learners
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Editor Panel - 3/4 width */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Title Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <label className="block mb-3 font-semibold text-gray-900 font-body flex items-center gap-2">
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
                <label className="block mb-3 font-semibold text-gray-900 font-body flex items-center gap-2">
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
                <label className="block mb-3 font-semibold text-gray-900 font-body flex items-center gap-2">
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
                    {!isFormValid() && (
                      <span className="text-xs text-amber-600 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg">
                        <AlertCircle size={14} />
                        Vui lòng điền đầy đủ thông tin bắt buộc
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
                      type="button"
                      onClick={handleSaveDraft}
                      disabled={loading}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 font-body"
                    >
                      <Save size={18} />
                      Lưu nháp
                    </button>

                    <button
                      type="submit"
                      disabled={loading || !isFormValid()}
                      className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-body shadow-md"
                    >
                      <Send size={18} />
                      {loading ? "Đang đăng..." : "Đăng bài"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar - Tips & Guidelines */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              
              {/* Writing Tips Card */}
              <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl border border-primary-200 p-5">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 font-heading">
                  <HelpCircle size={20} className="text-primary-600" />
                  Hướng dẫn viết bài
                </h3>
                <ul className="space-y-2.5 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Tiêu đề rõ ràng, mô tả chính xác nội dung</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Chọn tags phù hợp để phân loại chủ đề</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Nội dung chi tiết, dễ hiểu với ví dụ cụ thể</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Sử dụng formatting để làm nổi bật ý chính</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Đính kèm hình ảnh/tài liệu nếu cần thiết</span>
                  </li>
                </ul>
              </div>

              {/* Form Status Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-3 font-heading">
                  Trạng thái form
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
                    <span className="text-gray-600">Tệp đính kèm</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {files.length}/5
                    </span>
                  </div>
                </div>
                
                {isFormValid() && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                      <CheckCircle2 size={16} />
                      <span className="font-medium">Sẵn sàng đăng bài!</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Community Guidelines */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-3 font-heading">
                  Quy tắc cộng đồng
                </h3>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">•</span>
                    <span>Tôn trọng ý kiến của người khác</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">•</span>
                    <span>Không spam hoặc quảng cáo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">•</span>
                    <span>Nội dung phù hợp với chủ đề học tiếng Anh</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">•</span>
                    <span>Không sử dụng ngôn từ không phù hợp</span>
                  </li>
                </ul>
              </div>

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
