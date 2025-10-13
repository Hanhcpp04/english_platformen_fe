# Admin Dashboard - English Smart Platform

## Tổng Quan

Giao diện quản trị chuyên nghiệp cho nền tảng học tiếng Anh English Smart, được xây dựng với React, Tailwind CSS và các thư viện hiện đại.

## Cấu Trúc Dự Án

```
src/
├── components/
│   └── Layouts/
│       └── DefaultLayout/
│           └── AdminLayout/
│               ├── index.jsx          # Layout chính
│               ├── Header/
│               │   └── index.jsx      # Header với search, notifications, user menu
│               ├── SideBar/
│               │   └── index.jsx      # Sidebar navigation menu
│               └── Footer/
│                   └── index.jsx      # Footer đơn giản
└── Pages/
    └── Admin/
        ├── index.jsx                  # Admin routes wrapper
        ├── Dashboard/
        │   └── index.jsx              # Dashboard với thống kê và biểu đồ
        ├── UserManagement/
        │   └── index.jsx              # Quản lý người dùng
        ├── TopicVocabManagement/
        │   └── index.jsx              # Quản lý chủ đề từ vựng/ngữ pháp
        └── VocabManagement/
            └── index.jsx              # Quản lý từ vựng chi tiết
```

## Tính Năng Chính

### 1. **Dashboard (Trang Tổng Quan)**
- 📊 6 thẻ thống kê (Users, Vocabulary, Grammar, Exercises, XP, Writing)
- 📈 Biểu đồ tăng trưởng người dùng (Line Chart)
- 🥧 Biểu đồ phân bổ hoạt động (Pie Chart)
- 📊 Biểu đồ hiệu suất chủ đề (Bar Chart)
- 🕐 Danh sách hoạt động gần đây

### 2. **User Management (Quản Lý Người Dùng)**
- 👥 Danh sách người dùng với bảng chi tiết
- 🔍 Tìm kiếm và lọc theo vai trò (Admin/User)
- 📊 Thống kê nhanh: Total users, Active users, Admins, Total XP
- ⚙️ Thao tác: Xem, Sửa, Xóa người dùng
- 📄 Phân trang

### 3. **Topic Management (Quản Lý Chủ Đề)**
- 📚 Tab chuyển đổi giữa Vocabulary và Grammar topics
- 🔍 Tìm kiếm chủ đề
- 📊 Thống kê: Số topics, số từ, tổng XP
- ⚙️ Thao tác: Xem, Sửa, Xóa, Kích hoạt/Tắt chủ đề
- 🎨 Hiển thị dạng card grid

### 4. **Vocabulary Management (Quản Lý Từ Vựng)**
- 📖 Danh sách từ vựng chi tiết
- 🔍 Tìm kiếm và lọc theo chủ đề
- 🔊 Hiển thị media (Audio, Image)
- 📝 Thông tin: English word, Vietnamese, Pronunciation, Word type
- ⚙️ Thao tác: Xem, Sửa, Xóa từ vựng

### 5. **Layout Components**

#### **Sidebar**
- 🎨 Màu xám đậm (gray-800) với hover effects
- 📱 Responsive: Thu gọn trên mobile với overlay
- 🔗 Menu items với icons (Lucide React)
- 👤 Thông tin admin ở cuối sidebar

#### **Header**
- 🔍 Search bar (ẩn trên mobile)
- 🔔 Notifications dropdown với badge
- 👤 User menu dropdown
- 📱 Mobile menu toggle button

#### **Footer**
- ⚖️ Copyright và version info
- 🔗 Quick links (Help, Documentation)

## Công Nghệ Sử Dụng

- **React 19** - UI Framework
- **React Router DOM 7** - Routing
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons
- **Recharts 3** - Charts/Graphs
- **React Toastify** - Notifications
- **Vite 7** - Build tool

## Routes

```
/admin/dashboard         - Dashboard tổng quan
/admin/users            - Quản lý người dùng
/admin/topics           - Quản lý chủ đề (Vocab/Grammar)
/admin/vocabulary       - Quản lý từ vựng
/admin/grammar          - Quản lý ngữ pháp (TODO)
/admin/exercises        - Quản lý bài tập (TODO)
/admin/writing          - Quản lý writing (TODO)
/admin/badges           - Quản lý huy hiệu (TODO)
/admin/settings         - Cài đặt (TODO)
```

## Cách Chạy Dự Án

1. **Cài đặt dependencies:**
```bash
npm install
```

2. **Chạy development server:**
```bash
npm run dev
```

3. **Truy cập:**
```
http://localhost:5173/admin/dashboard
```

## Phong Cách Thiết Kế

### Màu Sắc
- **Background chính**: `bg-gray-50` - Xám nhạt
- **Sidebar**: `bg-gray-800` - Xám đậm
- **Cards/Tables**: `bg-white` với border `border-gray-200`
- **Primary color**: `bg-blue-600` (buttons, active states)
- **Success**: `bg-green-600`
- **Warning**: `bg-yellow-600`
- **Danger**: `bg-red-600`

### Typography
- **Headings**: Font-bold, text-gray-900
- **Body text**: text-gray-600
- **Secondary text**: text-gray-500

### Spacing & Layout
- **Container padding**: `p-6`
- **Card spacing**: `space-y-6`
- **Grid gaps**: `gap-4` đến `gap-6`
- **Border radius**: `rounded-lg` (8px) hoặc `rounded-xl` (12px)

### Shadows
- **Cards**: `shadow-sm` hover `shadow-lg`
- **Dropdowns**: `shadow-lg`
- **Modals**: `shadow-2xl`

## Dữ Liệu Mẫu (Dummy Data)

Hiện tại tất cả các trang đang sử dụng dữ liệu mẫu (mock data). Để kết nối với API thật:

1. Tạo service files trong `src/service/`
2. Import axios từ `src/service/request.js`
3. Replace các hàm fetch data với API calls
4. Xử lý loading states và error handling

## Tính Năng Cần Phát Triển

- [ ] Trang Grammar Management
- [ ] Trang Exercise Management
- [ ] Trang Writing Categories Management
- [ ] Trang Badges Management
- [ ] Trang Settings
- [ ] Form modal cho Add/Edit operations
- [ ] Confirmation dialogs cho Delete operations
- [ ] Export data functionality
- [ ] Advanced filtering và sorting
- [ ] Bulk operations
- [ ] Real-time data với websockets
- [ ] Permission-based access control

## Responsive Design

- **Desktop (lg: 1024px+)**: Full sidebar luôn hiển thị
- **Tablet (md: 768px+)**: Sidebar có thể toggle
- **Mobile (< 768px)**: Sidebar slide-in với overlay, simplified header

## Best Practices

1. **Component Structure**: Mỗi page là một component độc lập
2. **State Management**: Sử dụng React useState hooks
3. **Styling**: Tailwind utility classes, tránh custom CSS
4. **Icons**: Lucide React cho consistency
5. **Naming**: PascalCase cho components, camelCase cho variables
6. **File Organization**: Group by feature/page

## Credits

Developed for English Smart Platform
Built with ❤️ using React + Tailwind CSS
