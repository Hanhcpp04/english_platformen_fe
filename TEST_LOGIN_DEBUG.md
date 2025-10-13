# 🧪 Test Login Flow - Debug Guide

## 📋 Các bước test:

### 1️⃣ **Clear localStorage trước khi test**
Mở Console trong browser (F12) và chạy:
```javascript
localStorage.clear();
console.log("✅ LocalStorage cleared");
location.reload();
```

### 2️⃣ **Đăng nhập và xem Console logs**

#### A. **Đăng nhập thường (Email/Password):**
Sau khi đăng nhập, bạn sẽ thấy các logs theo thứ tự:

```
🔐 Starting login...
✅ Login response: {code: 1000, message: "Success", result: {...}}
✅ User saved to localStorage: {id: 1, email: "...", fullName: "...", ...}
✅ Token saved: eyJhbGciOiJIUzI1NiJ9...
✅ Dispatching userLoggedIn event...
✅ Login successful, user data: {id: 1, email: "...", ...}
🔍 Header - Raw data: {token: "...", userStr: "..."}
🔍 Header - Login status: {hasValidToken: true, hasValidUser: true, newLoginStatus: true}
👤 UserAvatar - Loading user data...
👤 UserAvatar - Raw data: {userStr: "...", token: "..."}
✅ UserAvatar - Parsed user data: {id: 1, email: "...", fullName: "...", ...}
🔄 Navigating to dashboard...
```

#### B. **Đăng nhập bằng Google OAuth:**
Sau khi redirect từ Google, bạn sẽ thấy:
```
✅ OAuth2 - Received tokens
✅ OAuth2 - Tokens saved, fetching user profile...
✅ OAuth2 - User profile fetched: {id: ..., email: ..., fullName: ..., ...}
✅ OAuth2 - Redirecting to dashboard...
🔍 Header - Raw data: {token: "...", userStr: "..."}
🔍 Header - Login status: {hasValidToken: true, hasValidUser: true, newLoginStatus: true}
👤 UserAvatar - Loading user data...
✅ UserAvatar - Parsed user data: {...}
```

### 3️⃣ **Kiểm tra localStorage**
```javascript
console.log("Token:", localStorage.getItem('accessToken'));
console.log("User:", JSON.parse(localStorage.getItem('user')));
```

### 4️⃣ **Kiểm tra UI**
- ✅ Header phải hiển thị avatar/tên người dùng
- ✅ Không còn hiển thị nút "Đăng nhập" và "Bắt đầu học"
- ✅ Click vào avatar hiển thị dropdown menu
- ✅ Dropdown có thông tin: tên, email, level, coins

### 5️⃣ **Test Logout**
- Click "Đăng xuất" trong dropdown
- Header phải quay về trạng thái chưa đăng nhập
- Console sẽ hiển thị:
```
🔍 Header - Login status: {hasValidToken: false, hasValidUser: false, newLoginStatus: false}
```

## 🐛 Nếu vẫn lỗi:

### Scenario 1: Không thấy avatar sau khi login
**Kiểm tra:**
```javascript
// Trong Console:
console.log("Has Token?", !!localStorage.getItem('accessToken'));
console.log("Has User?", !!localStorage.getItem('user'));
console.log("User Data:", JSON.parse(localStorage.getItem('user')));
```

### Scenario 2: Loading spinner không biến mất
**Nguyên nhân:** UserAvatar component bị stuck ở loading state
**Fix:** Check console xem có lỗi parsing JSON không

### Scenario 3: Event không được trigger
**Kiểm tra:**
```javascript
// Test manual trigger:
window.dispatchEvent(new Event('userLoggedIn'));
```

## 📊 Expected Data Structure:

### localStorage.accessToken:
```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJoYWhvYW5nYW5oQGdtYWlsLmNvbSIsIlJPTEUiOiJST0xFX1VTRVIiLCJ0eXBlIjoiQUNDRVNTIiwiaWF0IjoxNzYwMTc4MjAyLCJleHAiOjE3NjAyNjQ2MDJ9...
```

### localStorage.user:
```json
{
  "id": 1,
  "email": "hahoanganh@gmail.com",
  "avatar": null,
  "fullName": "Hà Hoàng Anh",
  "name": "Hà Hoàng Anh",
  "role": "USER",
  "totalXp": 0,
  "active": true
}
```

## ✅ Success Criteria:
- [ ] Console logs đầy đủ theo flow
- [ ] localStorage có đủ token và user data
- [ ] Header hiển thị avatar/tên
- [ ] Dropdown menu hoạt động
- [ ] Logout thành công
