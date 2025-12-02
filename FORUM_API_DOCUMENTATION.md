# Forum API Documentation

## Tổng quan
Tài liệu này mô tả các API endpoints cần thiết cho chức năng Forum trong hệ thống EnglishSmart. Các API được thiết kế dựa trên database schema và yêu cầu từ Frontend components.

---

## 1. Posts APIs

### 1.1. Lấy danh sách bài viết
**Endpoint:** `GET /api/forum/posts`

**Query Parameters:**
```javascript
{
  page: number,              // Số trang (mặc định: 1)
  limit: number,             // Số bài viết mỗi trang (mặc định: 10)
  search: string,            // Từ khóa tìm kiếm (tùy chọn)
  dateFilter: string,        // Filter: "all" | "today" | "week" | "month"
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    posts: [
      {
        id: number,
        user_id: number,
        title: string,
        content: string,
        likes_count: number,
        comments_count: number,
        views: number,              // Từ bảng forum_post_views
        is_active: boolean,
        created_at: string,
        updated_at: string,
        author: {
          id: number,
          username: string,
          fullname: string,
          avatar: string
        },
        tags: [string],             // Từ content hoặc metadata
        images: [                    // Từ bảng forum_post_media
          {
            id: number,
            url: string,
            thumbnail_url: string,
            file_name: string
          }
        ],
        files: [                     // Từ bảng forum_post_media
          {
            id: number,
            url: string,
            file_name: string,
            file_size: number,
            mime_type: string
          }
        ],
        hasLiked: boolean,          // Kiểm tra user hiện tại đã like chưa
        hasBookmarked: boolean      // Kiểm tra user đã bookmark chưa
      }
    ],
    pagination: {
      currentPage: number,
      totalPages: number,
      totalPosts: number,
      hasNext: boolean,
      hasPrev: boolean
    }
  }
}
```

---

### 1.2. Lấy chi tiết bài viết
**Endpoint:** `GET /api/forum/posts/:postId`

**Response:**
```javascript
{
  success: true,
  data: {
    id: number,
    user_id: number,
    title: string,
    content: string,
    likes_count: number,
    comments_count: number,
    views: number,
    xp_reward: number,
    is_active: boolean,
    created_at: string,
    updated_at: string,
    author: {
      id: number,
      username: string,
      fullname: string,
      avatar: string,
      total_xp: number
    },
    tags: [string],
    images: [
      {
        id: number,
        url: string,
        thumbnail_url: string,
        file_name: string,
        media_type: string
      }
    ],
    files: [
      {
        id: number,
        url: string,
        file_name: string,
        file_size: number,
        mime_type: string
      }
    ],
    hasLiked: boolean,
    hasBookmarked: boolean
  }
}
```

**Side Effect:**
- Tự động tăng view count trong bảng `forum_post_views`
- Lưu thông tin: user_id (nếu có), ip_address, viewed_at

---

### 1.3. Tạo bài viết mới
**Endpoint:** `POST /api/forum/posts`

**Headers:**
```javascript
{
  "Authorization": "Bearer {token}",
  "Content-Type": "multipart/form-data"
}
```

**Request Body (FormData):**
```javascript
{
  title: string,              // Tùy chọn, có thể null
  content: string,            // Bắt buộc
  tags: [string],             // Mảng các tag (tối đa 5)
  images: [File],             // Mảng file ảnh (tối đa 4)
  files: [File]               // Mảng file đính kèm (tối đa 5)
}
```

**Response:**
```javascript
{
  success: true,
  message: "Tạo bài viết thành công",
  data: {
    id: number,
    user_id: number,
    title: string,
    content: string,
    likes_count: 0,
    comments_count: 0,
    xp_reward: 20,
    is_active: true,
    created_at: string,
    media: [
      {
        id: number,
        media_type: "image" | "file",
        url: string,
        file_name: string
      }
    ]
  }
}
```

**Business Logic:**
1. Validate user đã đăng nhập
2. Validate content không rỗng
3. Upload images/files lên storage (AWS S3 / Cloud Storage)
4. Tạo bản ghi trong `forum_posts`
5. Tạo bản ghi trong `forum_post_media` cho mỗi file
6. Cộng XP cho user (20 XP)
7. Cập nhật `user_daily_stats` (forum_posts +1, xp_earned +20)

---

### 1.4. Chỉnh sửa bài viết
**Endpoint:** `PUT /api/forum/posts/:postId`

**Headers:**
```javascript
{
  "Authorization": "Bearer {token}",
  "Content-Type": "multipart/form-data"
}
```

**Request Body (FormData):**
```javascript
{
  content: string,            // Bắt buộc
  tags: [string],             // Mảng các tag
  images: [File],             // Mảng file ảnh mới
  files: [File],              // Mảng file mới
  existingMediaIds: [number], // IDs của media giữ lại
  removedMediaIds: [number]   // IDs của media cần xóa
}
```

**Response:**
```javascript
{
  success: true,
  message: "Cập nhật bài viết thành công",
  data: {
    id: number,
    content: string,
    tags: [string],
    images: [...],
    files: [...],
    updated_at: string
  }
}
```

**Business Logic:**
1. Validate user là chủ bài viết
2. Xóa media cũ nếu có trong `removedMediaIds`
3. Upload media mới
4. Cập nhật bản ghi `forum_posts`
5. Cập nhật `updated_at`

---

### 1.5. Xóa bài viết
**Endpoint:** `DELETE /api/forum/posts/:postId`

**Headers:**
```javascript
{
  "Authorization": "Bearer {token}"
}
```

**Response:**
```javascript
{
  success: true,
  message: "Xóa bài viết thành công"
}
```

**Business Logic:**
1. Validate user là chủ bài viết hoặc admin
2. Soft delete: set `is_active = false`
3. Hoặc hard delete: xóa bản ghi và cascade delete media, comments

---

### 1.6. Lấy bài viết của user
**Endpoint:** `GET /api/forum/users/:userId/posts`

**Query Parameters:**
```javascript
{
  page: number,
  limit: number
}
```

**Response:** Giống như 1.1 (danh sách bài viết)

---

## 2. Comments APIs

### 2.1. Lấy comments của bài viết
**Endpoint:** `GET /api/forum/posts/:postId/comments`

**Query Parameters:**
```javascript
{
  sortBy: "latest" | "oldest" | "most_liked"
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    comments: [
      {
        id: number,
        post_id: number,
        user_id: number,
        parent_id: number | null,
        content: string,
        likes_count: number,
        is_active: boolean,
        created_at: string,
        updated_at: string,
        author: {
          id: number,
          username: string,
          fullname: string,
          avatar: string
        },
        hasLiked: boolean,
        replies: [                    // Đệ quy, cấu trúc giống comment cha
          {
            id: number,
            content: string,
            author: {...},
            replies: [...]
          }
        ]
      }
    ]
  }
}
```

**Business Logic:**
- Lấy tất cả comments có `post_id` = postId và `is_active` = true
- Sắp xếp theo thời gian
- Xây dựng cây đệ quy dựa trên `parent_id`
- Kiểm tra `hasLiked` cho user hiện tại

---

### 2.2. Tạo comment mới
**Endpoint:** `POST /api/forum/posts/:postId/comments`

**Headers:**
```javascript
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Request Body:**
```javascript
{
  content: string,            // Bắt buộc
  parent_id: number | null    // null nếu là comment gốc, có giá trị nếu reply
}
```

**Response:**
```javascript
{
  success: true,
  message: "Tạo bình luận thành công",
  data: {
    id: number,
    post_id: number,
    user_id: number,
    parent_id: number | null,
    content: string,
    likes_count: 0,
    is_active: true,
    created_at: string,
    author: {
      id: number,
      username: string,
      fullname: string,
      avatar: string
    }
  }
}
```

**Business Logic:**
1. Validate user đã đăng nhập
2. Validate post tồn tại và active
3. Nếu có `parent_id`, validate comment cha tồn tại
4. Tạo bản ghi trong `forum_comments`
5. Tăng `comments_count` trong `forum_posts`
6. Cập nhật `user_daily_stats` (forum_comments +1)

---

### 2.3. Chỉnh sửa comment
**Endpoint:** `PUT /api/forum/comments/:commentId`

**Headers:**
```javascript
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Request Body:**
```javascript
{
  content: string             // Bắt buộc
}
```

**Response:**
```javascript
{
  success: true,
  message: "Cập nhật bình luận thành công",
  data: {
    id: number,
    content: string,
    updated_at: string
  }
}
```

---

### 2.4. Xóa comment
**Endpoint:** `DELETE /api/forum/comments/:commentId`

**Headers:**
```javascript
{
  "Authorization": "Bearer {token}"
}
```

**Response:**
```javascript
{
  success: true,
  message: "Xóa bình luận thành công"
}
```

**Business Logic:**
1. Validate user là chủ comment hoặc admin
2. Soft delete: set `is_active = false`
3. Giảm `comments_count` trong `forum_posts`
4. Nếu có replies, xử lý cascade (xóa hoặc giữ lại)

---

## 3. Interactions APIs

### 3.1. Like/Unlike bài viết
**Endpoint:** `POST /api/forum/posts/:postId/like`

**Headers:**
```javascript
{
  "Authorization": "Bearer {token}"
}
```

**Response:**
```javascript
{
  success: true,
  message: "Đã thích bài viết" | "Đã bỏ thích",
  data: {
    hasLiked: boolean,
    likes_count: number
  }
}
```

**Business Logic:**
1. Kiểm tra user đã like chưa (bảng phụ hoặc tracking trong user_activities)
2. Nếu chưa like: tăng `likes_count` trong `forum_posts`
3. Nếu đã like: giảm `likes_count`
4. Toggle trạng thái like

---

### 3.2. Like/Unlike comment
**Endpoint:** `POST /api/forum/comments/:commentId/like`

**Headers:**
```javascript
{
  "Authorization": "Bearer {token}"
}
```

**Response:**
```javascript
{
  success: true,
  message: "Đã thích bình luận" | "Đã bỏ thích",
  data: {
    hasLiked: boolean,
    likes_count: number
  }
}
```

---

### 3.3. Bookmark bài viết
**Endpoint:** `POST /api/forum/posts/:postId/bookmark`

**Headers:**
```javascript
{
  "Authorization": "Bearer {token}"
}
```

**Response:**
```javascript
{
  success: true,
  message: "Đã lưu bài viết" | "Đã bỏ lưu",
  data: {
    hasBookmarked: boolean
  }
}
```

**Business Logic:**
- Tạo/xóa bản ghi trong bảng user_bookmarks (cần tạo thêm)
- Hoặc lưu trong user_activities

---

## 4. Statistics & Analytics APIs

### 4.1. Lấy thống kê forum
**Endpoint:** `GET /api/forum/stats`

**Response:**
```javascript
{
  success: true,
  data: {
    totalPosts: number,
    totalComments: number,
    totalMembers: number,        // Số user có ít nhất 1 post
    todayActive: number,          // Số user active hôm nay
    popularTopics: [
      {
        name: string,
        count: number
      }
    ]
  }
}
```

---

### 4.2. Lấy bài viết trending/nổi bật
**Endpoint:** `GET /api/forum/posts/trending`

**Query Parameters:**
```javascript
{
  limit: number,                  // Mặc định: 10
  timeRange: "day" | "week" | "month"
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    trendingPosts: [
      {
        id: number,
        title: string,
        content: string,
        likes_count: number,
        comments_count: number,
        views: number,
        author: {...},
        created_at: string
      }
    ]
  }
}
```

**Business Logic:**
- Sắp xếp theo công thức: (likes_count * 2 + comments_count * 1.5 + views * 0.1)
- Lọc theo timeRange

---

## 5. Search & Filter APIs

### 5.1. Tìm kiếm bài viết
**Endpoint:** `GET /api/forum/search`

**Query Parameters:**
```javascript
{
  q: string,                    // Từ khóa tìm kiếm
  type: "posts" | "users" | "all",
  page: number,
  limit: number
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    posts: [...],               // Nếu type = "posts" hoặc "all"
    users: [...],               // Nếu type = "users" hoặc "all"
    pagination: {...}
  }
}
```

---

## 6. Media APIs

### 6.1. Upload media
**Endpoint:** `POST /api/forum/media/upload`

**Headers:**
```javascript
{
  "Authorization": "Bearer {token}",
  "Content-Type": "multipart/form-data"
}
```

**Request Body:**
```javascript
{
  files: [File],
  type: "image" | "file"
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    uploadedFiles: [
      {
        url: string,
        thumbnail_url: string,      // Chỉ có nếu là image
        file_name: string,
        file_size: number,
        mime_type: string
      }
    ]
  }
}
```

---

## 7. User Activities APIs

### 7.1. Lấy hoạt động của user
**Endpoint:** `GET /api/forum/users/:userId/activities`

**Query Parameters:**
```javascript
{
  type: "posts" | "comments" | "all",
  page: number,
  limit: number
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    activities: [
      {
        type: "post" | "comment",
        id: number,
        content: string,
        created_at: string,
        post: {...},              // Nếu type = "comment"
        likes_count: number,
        comments_count: number    // Nếu type = "post"
      }
    ],
    pagination: {...}
  }
}
```

---

## Notes về Implementation

### Authentication & Authorization
- Tất cả API cần authentication (trừ GET public posts) phải có header `Authorization: Bearer {token}`
- Validate token và lấy thông tin user từ JWT
- Kiểm tra quyền sở hữu khi edit/delete

### File Upload
- Sử dụng cloud storage (AWS S3, Cloudinary, Firebase Storage)
- Validate file type và size
  - Images: jpg, png, gif (max 5MB mỗi file)
  - Files: pdf, doc, docx, txt (max 10MB mỗi file)
- Tạo thumbnail cho images
- Lưu URL vào database

### Performance Optimization
- Implement pagination cho tất cả list APIs
- Cache thống kê forum (Redis)
- Optimize query với proper indexes
- Lazy load images/media

### XP & Gamification
- Mỗi post mới: +20 XP
- Mỗi comment: +5 XP
- Post được like: +2 XP cho tác giả
- Cập nhật `user_daily_stats` và `total_xp` trong bảng `users`

### Error Handling
Tất cả response lỗi có format:
```javascript
{
  success: false,
  message: string,
  errors: [
    {
      field: string,
      message: string
    }
  ]
}
```

### Rate Limiting
- Tạo post: 10 posts/hour
- Tạo comment: 50 comments/hour
- Like/Unlike: 100 actions/hour
