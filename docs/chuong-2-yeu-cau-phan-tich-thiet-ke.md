# CHƯƠNG 2: CƠ SỞ LÝ THUYẾT VÀ PHÂN TÍCH THIẾT KẾ HỆ THỐNG

## 2.1. Phân tích yêu cầu chức năng và phi chức năng

### 2.1.1. Giới thiệu về hệ thống
Hệ thống EnglishSmart là nền tảng web hỗ trợ học tiếng Anh theo hướng cá nhân hóa, bao gồm các mảng chính: Từ vựng (vocabulary), Ngữ pháp (grammar), Luyện viết (writing) và Diễn đàn (forum) để trao đổi kiến thức. Ứng dụng phục vụ hai nhóm đối tượng chính:
- Người dùng (học viên): học theo các chủ đề/module, theo dõi tiến trình, tương tác trên diễn đàn.
- Quản trị viên (admin): quản lý người dùng, nội dung học tập, hoạt động diễn đàn và báo cáo dữ liệu.

Mục tiêu của hệ thống là cung cấp trải nghiệm học tập mạch lạc, đo lường được (tracking tiến trình), có tương tác cộng đồng, đồng thời đảm bảo an toàn, hiệu năng và khả năng mở rộng.

---

### 2.1.2. Yêu cầu chức năng

#### a) Chức năng dành cho người dùng (khách hàng)
1) Đăng ký tài khoản
- Mô tả: Người dùng tạo tài khoản bằng email/mật khẩu hoặc đăng ký qua OAuth (Google,… nếu được hỗ trợ).
- Luồng cơ bản: Nhập thông tin -> Xác thực hợp lệ -> Tạo tài khoản -> Thông báo thành công.
- Tiêu chí chấp nhận: Thông báo lỗi rõ ràng; không tạo trùng email; mật khẩu được kiểm tra độ mạnh.

2) Đăng nhập
- Mô tả: Người dùng đăng nhập để truy cập các chức năng bảo vệ.
- Luồng cơ bản: Nhập thông tin -> Xác thực -> Nhận token (JWT) -> Điều hướng trang phù hợp.
- Tiêu chí chấp nhận: Lưu phiên an toàn; hết hạn phiên được xử lý bằng cơ chế refresh token (nếu có).

3) Đăng xuất
- Mô tả: Kết thúc phiên làm việc hiện tại.
- Luồng cơ bản: Xóa token/phiên -> Điều hướng về trang công khai.
- Tiêu chí chấp nhận: Sau đăng xuất không thể truy cập trang bảo vệ.

4) Xem thông tin cá nhân
- Mô tả: Xem hồ sơ cơ bản (tên, email, huy hiệu/cấp độ, tiến trình,…).
- Luồng cơ bản: Người dùng truy cập trang Hồ sơ -> Hệ thống lấy dữ liệu và hiển thị.
- Tiêu chí chấp nhận: Dữ liệu hiển thị chính xác, cập nhật theo thời gian thực (hoặc gần thời gian thực).

5) Xem tiến trình và danh sách các module học
- Mô tả: Hiển thị danh sách module (Từ vựng, Ngữ pháp, Viết) và phần trăm hoàn thành.
- Luồng cơ bản: Tải danh sách module -> Tính/nhận tiến trình -> Hiển thị.
- Tiêu chí chấp nhận: Tiến trình phản ánh chính xác số bài đã học/hoàn thành.

6) Xem chi tiết các chủ đề trong từng module
- Mô tả: Xem danh mục chủ đề (topic) trong từng module và nội dung liên quan.
- Luồng cơ bản: Chọn module -> Tải danh sách chủ đề -> Xem chi tiết chủ đề.
- Tiêu chí chấp nhận: Bộ lọc/tìm kiếm chủ đề hoạt động; điều hướng mượt mà.

7) Học từ vựng theo chủ đề (flashcard + bài tập)
- Mô tả: Học từ vựng bằng flashcard, kèm bài tập trắc nghiệm/kéo thả/điền từ.
- Luồng cơ bản: Chọn chủ đề -> Học qua flashcard -> Làm bài tập -> Nhận kết quả và cập nhật tiến trình.
- Tiêu chí chấp nhận: Ghi nhận điểm/số lần thử; hỗ trợ ôn lại các từ khó.

8) Học ngữ pháp (lý thuyết và bài tập)
- Mô tả: Xem bài lý thuyết ngữ pháp; làm bài tập tương ứng (trắc nghiệm/điền khuyết,…).
- Luồng cơ bản: Chọn bài học -> Đọc lý thuyết -> Làm bài tập -> Xem kết quả và gợi ý.
- Tiêu chí chấp nhận: Theo dõi hoàn thành từng bài; nhắc nhở những mục chưa hoàn thành.

9) Luyện viết (theo mẫu + viết tự do)
- Mô tả: Luyện viết theo mẫu (prompt/đề bài) hoặc viết tự do, có thể có rubric/hướng dẫn.
- Luồng cơ bản: Chọn dạng luyện viết -> Soạn thảo -> Nộp bài -> Xem phản hồi/hướng dẫn (nếu có).
- Tiêu chí chấp nhận: Lưu nháp; đếm từ; hỗ trợ định dạng cơ bản; theo dõi lần nộp.

10) Xem các bài đăng trên diễn đàn (Forum)
- Mô tả: Xem danh sách bài đăng, phân trang, sắp xếp, lọc theo thẻ/chủ đề.
- Luồng cơ bản: Tải danh sách -> Lọc/sắp xếp -> Xem nhanh nội dung.
- Tiêu chí chấp nhận: Tốc độ tải ổn định; nội dung an toàn (lọc XSS từ phía client và server).

11) Xem chi tiết bài đăng
- Mô tả: Xem toàn bộ nội dung bài, bình luận và tệp đính kèm (nếu có).
- Luồng cơ bản: Chọn bài -> Tải chi tiết + bình luận -> Hiển thị.
- Tiêu chí chấp nhận: Điều hướng quay lại danh sách thuận tiện; giữ trạng thái lọc trước đó.

12) Tương tác bài đăng (thích/bình luận/lưu…)
- Mô tả: Người dùng tương tác với bài (like, comment, bookmark,… tùy chính sách).
- Luồng cơ bản: Núi bấm tương tác -> Gửi yêu cầu -> Cập nhật UI lạc quan -> Đồng bộ máy chủ.
- Tiêu chí chấp nhận: Tránh trùng lặp tương tác; chống spam bình luận ở mức UI.

13) Tải các file trên diễn đàn
- Mô tả: Tải xuống tệp đính kèm của bài đăng (nếu được phép).
- Luồng cơ bản: Kiểm tra quyền -> Tải tệp -> Thông báo hoàn tất hoặc lỗi.
- Tiêu chí chấp nhận: Liên kết tải an toàn; hiển thị dung lượng/loại tệp.

14) Quản lý các bài đăng của bản thân
- Mô tả: Tạo/sửa/xóa bài đăng của người dùng; quản lý danh sách bài cá nhân.
- Luồng cơ bản: Vào trang quản lý -> Xem danh sách -> Tạo/Sửa/Xóa -> Cập nhật UI.
- Tiêu chí chấp nhận: Chỉ chủ sở hữu mới sửa/xóa; cảnh báo khi xóa.

#### b) Chức năng dành cho quản trị viên (admin)
1) Quản lý người dùng
- Mô tả: Xem, tìm kiếm, khóa/mở khóa, đặt lại vai trò/quyền.
- Tiêu chí chấp nhận: Nhật ký thao tác; không tự hạ quyền admin cuối cùng.

2) Quản lý huy hiệu (badges)
- Mô tả: Tạo/sửa/xóa huy hiệu; gắn huy hiệu theo tiêu chí (điểm, tiến trình,…).
- Tiêu chí chấp nhận: Hiển thị huy hiệu đúng với điều kiện đạt.

3) Quản lý cấp độ (levels)
- Mô tả: Định nghĩa cấp độ học (A1–C2 hoặc nội bộ); quy tắc lên cấp.
- Tiêu chí chấp nhận: Tự động cập nhật cấp độ khi đủ điều kiện.

4) Quản lý chủ đề từ vựng
- Mô tả: CRUD chủ đề; cấu trúc nội dung; gán thẻ.
- Tiêu chí chấp nhận: Xác thực dữ liệu; kiểm tra trùng lặp.

5) Quản lý bài tập từ vựng
- Mô tả: Tạo/sửa/xóa bộ câu hỏi; ngân hàng câu hỏi; mức độ khó.
- Tiêu chí chấp nhận: Tiền xem (preview) câu hỏi; ngẫu nhiên hóa đáp án.

6) Quản lý từ vựng
- Mô tả: CRUD từ vựng, nghĩa, phiên âm, ví dụ, hình/âm thanh (nếu có).
- Tiêu chí chấp nhận: Chuẩn hóa dữ liệu; hỗ trợ nhập hàng loạt (CSV,… nếu có).

7) Quản lý chủ đề ngữ pháp
- Mô tả: CRUD chủ đề ngữ pháp; liên kết bài học.
- Tiêu chí chấp nhận: Không tạo trùng tiêu đề trong cùng phạm vi.

8) Quản lý bài học ngữ pháp
- Mô tả: CRUD bài học; nội dung lý thuyết + media.
- Tiêu chí chấp nhận: Trình soạn thảo an toàn; xem trước nội dung.

9) Quản lý bài tập ngữ pháp
- Mô tả: CRUD ngân hàng bài tập; gán vào bài học/chủ đề.
- Tiêu chí chấp nhận: Kiểm thử logic chấm điểm; thống kê kết quả.

10) Quản lý chủ đề viết
- Mô tả: CRUD đề bài; rubric/chấm điểm hướng dẫn (nếu có).
- Tiêu chí chấp nhận: Phân loại theo kỹ năng (Task 1/2, essay types,… nếu áp dụng).

11) Quản lý diễn đàn + thông báo
- Mô tả: Duyệt/xóa bài, quản lý bình luận; khi có bài mới, gửi thông báo đến quản trị viên hoặc kênh giám sát.
- Tiêu chí chấp nhận: Cấu hình kênh thông báo (email/webhook/nhật ký); kiểm soát spam.

12) Báo cáo dữ liệu
- Mô tả: Thống kê người dùng, tiến trình, mức độ hoàn thành, mức độ tương tác diễn đàn.
- Tiêu chí chấp nhận: Bộ lọc thời gian/chủ đề; xuất dữ liệu (CSV) nếu cần.

---

### 2.1.3. Yêu cầu phi chức năng
1) Tính ổn định
- Mục tiêu: Hệ thống hoạt động ổn định với tỉ lệ uptime ≥ 99.5%.
- Giải pháp: Giám sát lỗi (Sentry/Logging); cơ chế retry hợp lý ở frontend; fallback UI.
- Chỉ số: Tỉ lệ lỗi JS, số lần reload bắt buộc, số sự cố nghiêm trọng/tháng.

2) Tính bảo mật
- Mục tiêu: Bảo vệ dữ liệu và phiên người dùng.
- Giải pháp: JWT + refresh token; lưu trữ an toàn (HttpOnly/secure nếu dùng cookie); chống XSS/CSRF; mã hóa kênh (HTTPS); tuân thủ OWASP Top 10.
- Chỉ số: Không có lỗ hổng mức High/Critical; 0 sự cố rò rỉ dữ liệu.

3) Tính khả dụng (Usability)
- Mục tiêu: Dễ dùng, nhất quán, hỗ trợ i18n khi cần.
- Giải pháp: Điều hướng rõ ràng; phản hồi thao tác; hướng dẫn/breadcrumb; kiểm tra khả dụng với người dùng thử.
- Chỉ số: Thời gian hoàn thành tác vụ chính < 3 phút; tỉ lệ bỏ quy trình < 10%.

4) Tương thích thiết bị
- Mục tiêu: Hoạt động tốt trên desktop/tablet/mobile, trình duyệt hiện đại.
- Giải pháp: Responsive với Tailwind CSS; kiểm thử trên Chrome/Edge/Firefox/Safari.
- Chỉ số: Điểm Lighthouse ≥ 90 cho Accessibility/Best Practices trên thiết bị mục tiêu.

5) Hiệu năng
- Mục tiêu: Tối ưu tốc độ tải và tương tác.
- Giải pháp: Code-splitting với Vite/React; cache API; lazy-load; tối ưu ảnh.
- Chỉ số: LCP ≤ 2.5s; TTI ≤ 3s; p95 API < 400ms trên mạng băng thông trung bình.

6) Khả năng mở rộng
- Mục tiêu: Dễ mở rộng tính năng/nội dung và tải người dùng.
- Giải pháp: Kiến trúc module hóa; tách service; phân trang/virtualization cho danh sách lớn.
- Chỉ số: Thêm chủ đề/bài học mới không cần chỉnh sửa code cũ; tải 1k–5k người dùng đồng thời (phụ thuộc back-end) không suy giảm lớn.

7) Khả năng bảo trì
- Mục tiêu: Mã dễ đọc, có chuẩn lint/format, tách biệt tầng gọi API.
- Giải pháp: ESLint, Prettier; tách `service/*` cho API; `ProtectedRoute` cho bảo vệ trang; tài liệu README.
- Chỉ số: Tỉ lệ bug hồi quy thấp; PR review < 1 ngày làm việc.

---

### 2.1.4. Giả định và ràng buộc
- Có dịch vụ back-end cung cấp API theo tài liệu đi kèm (`FORUM_API_DOCUMENTATION.md`, `grammar_api_requirements.md`, …).
- Xác thực sử dụng JWT/OAuth2; một số chức năng phụ thuộc vào vai trò (RBAC).
- Dữ liệu lớn (bài, bình luận, từ vựng) được phân trang từ phía server.
- Hạ tầng triển khai và SLA do phía back-end/DevOps quyết định; front-end tuân thủ chuẩn API và thực hành bảo mật UI.

### 2.1.5. Ngoài phạm vi (Out of scope – FE)
- Thuật toán chấm điểm nâng cao bằng AI/NLP (nếu có) được xử lý phía server.
- Lưu trữ tệp lớn và quét virus là trách nhiệm dịch vụ lưu trữ/back-end.
- Thông báo push real-time phụ thuộc hạ tầng (WebSocket/SignalR/FCM) do back-end cung cấp.

---

### 2.1.6. Dấu vết sang hiện thực (Traceability – tham chiếu mã nguồn)
- Bảo vệ trang: `src/components/ProtectedRoute.jsx`.
- Luồng xác thực/OAuth: `src/service/authService.js`, `src/service/OAuth2RedirectHandler.jsx`, `src/hooks/useTokenRefresh.js`.
- Học Ngữ pháp/Từ vựng/Viết: `src/Pages/User/Grammar/*`, `src/service/grammarService.js`; `src/Pages/User/Vocabulary/*`, `src/service/vocabularyService.js`; `src/Pages/User/Writing/*`, `src/service/writingService.js`.
- Diễn đàn: `src/Pages/User/Forum/*`, `src/service/postService.js`.
- Bố cục và điều hướng: `src/components/Layouts/*`, `src/Pages/*`.

Tài liệu này là nền tảng để thiết kế chi tiết UI/UX, API contract và kế hoạch kiểm thử trong các chương/ mục tiếp theo.