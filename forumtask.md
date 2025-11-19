1. QUẢN LÝ BÀI VIẾT (Forum Posts)
   API Endpoints cần xây dựng:

Tạo bài viết mới (POST /api/posts)

Validate dữ liệu đầu vào (title, content)
Lưu thông tin post vào forum_posts
Xử lý upload media (nếu có) vào forum_post_media
Cộng XP cho user khi tạo bài (+20 XP mặc định)
Return post đã tạo kèm media
Lấy danh sách bài viết (GET /api/posts)

Hỗ trợ phân trang (page, limit)
Filter theo:date range
Sort theo: created_at, likes_count, comments_count, views
Lấy chi tiết bài viết (GET /api/posts/:id)
Lấy thông tin post đầy đủ
Include: user info, all media, stats (likes, comments, views)
Tăng view count (tạo record trong forum_post_views)
Check duplicate view (theo user_id hoặc ip_address trong khoảng thời gian nhất định)

Cập nhật bài viết (PUT /api/posts/:id)

Verify quyền sở hữu (chỉ author hoặc admin)
Update title, content
Xử lý thêm/xóa media
Update updated_at timestamp

Xóa bài viết (DELETE /api/posts/:id)

Verify quyền (chỉ cho tác giả có thể chỉnh sửa )
Soft delete: set is_active = FALSE
Hoặc hard delete: CASCADE sẽ xóa luôn comments, media, views

Like bài viết (POST /api/posts/:id/like)
    thêm vào forum_post_likes (cần thêm vào schema)
2.QUẢN LÝ BÌNH LUẬN (Forum Comments)
API Endpoints:
Tạo comment (POST /api/posts/:postId/comments)
Validate post_id tồn tại
Validate parent_id nếu là reply (check cùng post_id)
Lưu comment
Tăng comments_count trong forum_posts
Lấy comments của post (GET /api/posts/:postId/comments)
Lấy comments theo cấu trúc tree (parent-child)
Phân trang cho top-level comments
Include: user info, likes_count, reply count
Sort theo: created_at, likes_count


Cập nhật comment (PUT /api/comments/:id)

Verify ownership
Update content only
Update timestamp


Xóa comment (DELETE /api/comments/:id)

Verify ownership hoặc admin
Soft delete hoặc hard delete
Giảm comments_count của post
Xử lý comments con (cascade delete hoặc set parent_id = NULL)
Like/Unlike comment (POST /api/comments/:id/like)
Tương tự post likes
Update likes_count
3. QUẢN LÝ MEDIA
Logic cần xử lý:

Upload media (POST /api/media/upload)

Validate file type (image: jpg, png, gif / file: pdf, docx, etc.)
Validate file size (max 10MB cho ảnh, 50MB cho file)
Upload lên cloud storage (AWS S3, Cloudinary, etc.) nếu m biết up lên cloud
Tạo thumbnail cho ảnh
Lưu metadata vào forum_post_media


Xóa media (DELETE /api/media/:id)

Verify ownership (post owner)
Xóa file trên cloud storage
Xóa record trong database


Optimize media khi lấy post

Lazy load images
Return thumbnail_url cho danh sách
Return full URL cho chi tiết
4. QUẢN LÝ VIEWS
Logic tracking:

Record view:

Mỗi lần user xem post → insert vào forum_post_views
Check duplicate trong 24h (same user_id/ip_address + post_id)
Update view count realtime hoặc dùng batch job