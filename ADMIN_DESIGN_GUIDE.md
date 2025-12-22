# Admin Dashboard - Strict Minimalist Design

## Overview
A clean, professional Admin Dashboard with strict minimalist design using React and Tailwind CSS.

## Design Philosophy
- **Style**: Strict Minimalism, Monochrome, Clean, Professional
- **NO** Blue, **NO** Purple, **NO** Vibrant colors
- **Color Palette**: Zinc/Neutral tones only

## Color Palette

### Backgrounds
- `bg-zinc-50` (#FAFAFA) - Main app background
- `bg-white` (#FFFFFF) - Sidebar and card backgrounds

### Text Colors
- `text-zinc-900` (#18181B) - Primary headings
- `text-zinc-800` (#27272A) - Dark text
- `text-zinc-600` - Secondary text
- `text-zinc-500` (#71717A) - Tertiary text
- `text-zinc-400` - Placeholder text

### Borders
- `border-zinc-200` (#E4E4E7) - Subtle borders

### Action Colors
- `bg-zinc-900` (#18181B) - Primary action buttons
- `hover:bg-zinc-800` - Button hover state
- `bg-zinc-100` - Active sidebar items

## Layout Structure

### 1. Sidebar (Fixed, w-64)
- White background with right border
- Logo: "English Smart" (Bold, Black) + "Admin" badge (Gray)
- Navigation with Vietnamese labels
- Active state: Light gray background + black vertical indicator on left
- User profile footer with avatar circle

### 2. Header
- White background with bottom border
- Breadcrumbs on left (Home > Current Page)
- Logout button on right

### 3. Main Content
- Light gray background (bg-zinc-50)
- 8px padding (p-8)
- Full width content area

## Components Created/Updated

### AdminLayout
**File**: `src/components/Layouts/DefaultLayout/AdminLayout/index.jsx`
- Updated to use `bg-zinc-50` for main content area
- Increased padding to `p-8`

### AdminSidebar
**File**: `src/components/Layouts/DefaultLayout/AdminLayout/SideBar/index.jsx`
**Features**:
- Fixed width: `w-64`
- White background with `border-r border-zinc-200`
- Logo area: Bold "English Smart" + small "Admin" badge
- Navigation items with icons from Lucide React
- Active state styling:
  - Background: `bg-zinc-100`
  - Text: `text-black font-medium`
  - Black vertical indicator on left edge
- User profile footer

### AdminHeader
**File**: `src/components/Layouts/DefaultLayout/AdminLayout/Header/index.jsx`
**Features**:
- Clean breadcrumb navigation
- Logout button on right
- Minimal, flat design
- No search bar, no notifications (keeping it clean)

### GrammarManagementMinimal (Sample Page)
**File**: `src/Pages/Admin/GrammarManagement/GrammarManagementMinimal.jsx`
**Features**:
- Page title: "Quản lý Ngữ pháp" (H1, semibold)
- Toolbar with:
  - Search input (left)
  - Primary action button "+ Thêm bài học" (right, black background)
- Clean data table with:
  - Header: Light gray background, uppercase labels
  - Rows: Hover effect, border-bottom
  - Columns: ID, Tên Bài Học, Cấp Độ, Trạng Thái, Ngày Tạo, Hành Động
  - Badges:
    - Level: Gray background (Basic/Advanced)
    - Status: Subtle green for Public, gray for Draft
- Modal dialog with clean styling

## Badge Styling
```jsx
// Level Badge (Gray)
<span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-700">
  Basic
</span>

// Status Badge - Public (Subtle Green)
<span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">
  Public
</span>

// Status Badge - Draft (Gray)
<span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-600">
  Draft
</span>
```

## Button Styling
```jsx
// Primary Button (Black)
<button className="px-4 py-2 bg-zinc-900 text-white rounded-md text-sm hover:bg-zinc-800">
  + Thêm bài học
</button>

// Secondary Button (Outline)
<button className="px-4 py-2 border border-zinc-200 rounded-md text-sm text-zinc-700 hover:bg-zinc-50">
  Hủy
</button>

// Icon Button
<button className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded">
  <Edit2 className="w-4 h-4" />
</button>
```

## Input Styling
```jsx
// Search Input
<input 
  type="text"
  placeholder="Tìm kiếm..."
  className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-900 text-zinc-900 placeholder-zinc-400"
/>
```

## Table Styling
```jsx
// Table Container
<div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
  <table className="w-full">
    <thead>
      <tr className="bg-zinc-50 border-b border-zinc-200">
        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">
          Column Name
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-zinc-200">
      <tr className="hover:bg-zinc-50 transition-colors">
        <td className="px-6 py-4 text-sm text-zinc-600">Content</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Usage

### To use the new minimal design:

1. **For new pages**: Import and use `GrammarManagementMinimal` as a template
2. **AdminLayout**: Already updated with zinc colors
3. **Sidebar**: Already updated with minimalist design and black active indicator
4. **Header**: Already updated with breadcrumbs

### Example Route Setup:
```jsx
import GrammarManagementMinimal from './GrammarManagement/GrammarManagementMinimal';

// In routes:
<Route path="/grammar" element={<GrammarManagementMinimal />} />
```

## Navigation Menu Items

1. Dashboard
2. Quản lý User
3. Quản lý Chủ đề
4. Quản lý Từ vựng
5. Quản lý Ngữ pháp (Active example)
6. Bài học Ngữ pháp
7. Quản lý Viết
8. Quản lý Forum
9. Báo Cáo
10. Cài đặt

## Key Features

✅ Strict monochrome zinc/neutral color palette
✅ NO blue or purple colors
✅ Clean, professional aesthetic
✅ Black vertical indicator for active menu items
✅ Subtle shadows (`shadow-sm`) on cards
✅ Rounded corners (`rounded-lg`) on cards and buttons
✅ Plenty of whitespace for "gọn gàng" appearance
✅ Responsive design (mobile-friendly sidebar)
✅ Data table with hover effects
✅ Clean modal dialogs
✅ Pagination controls

## Icons
Using **Lucide React** for all icons:
- `LayoutDashboard`, `Users`, `BookOpen`, etc.
- 4px or 5px size (`w-4 h-4` or `w-5 h-5`)

## Best Practices

1. **Always use zinc colors**: Never introduce blue or purple
2. **Keep it minimal**: Avoid unnecessary decorative elements
3. **Use proper spacing**: Maintain whitespace with padding (`p-4`, `p-6`, `p-8`)
4. **Subtle shadows**: Only use `shadow-sm` for very subtle depth
5. **Black for primary actions**: `bg-zinc-900` for important buttons
6. **Gray for secondary actions**: `border-zinc-200` for outline buttons

---

**Design Status**: ✅ Complete
**Tested**: Ready for production
**Framework**: React + Tailwind CSS + Lucide React Icons
