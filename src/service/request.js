import axios from "axios";
import { toast } from "react-toastify";

const request = axios.create({
    baseURL: "http://localhost:8088/api/v1/"
});

// Biến để track việc refresh token đang diễn ra (tránh gọi nhiều lần)
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request Interceptor - Tự động thêm token vào header
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Xử lý refresh token khi gặp lỗi 401
request.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Kiểm tra nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Nếu request đang là refresh token thì không retry nữa
      if (originalRequest.url.includes('/auth/refresh') || originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/register')) {
        console.error('❌ Refresh token expired or invalid');
        
        // Clear toàn bộ dữ liệu và logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        
        // Dispatch event để UI cập nhật
        window.dispatchEvent(new Event('userLoggedOut'));
        
        // Chỉ hiện toast nếu không phải từ login/register
        if (!originalRequest.url.includes('/auth/login') && !originalRequest.url.includes('/auth/register')) {
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
          
          // Redirect về trang login (tránh redirect khi đang ở trang login)
          if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(error);
      }
      
      // Nếu đang refresh token, thêm request vào queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return request(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      const refreshToken = localStorage.getItem("refreshToken");
      
      if (!refreshToken) {
        console.error('❌ No refresh token available');
        isRefreshing = false;
        
        // Clear data và logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event('userLoggedOut'));
        
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
        window.location.href = '/login';
        
        return Promise.reject(error);
      }
      
      try {
        console.log('🔄 Refreshing access token...');
        
        // Hiển thị thông báo cho user biết đang gia hạn phiên
        toast.info('Đang gia hạn phiên đăng nhập...', { 
          autoClose: 2000,
          hideProgressBar: false 
        });
        
        // Gọi API refresh token
        const response = await axios.post(
          'http://localhost:8088/api/v1/auth/refresh',
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        const result = response.data.result || response.data;
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = result;
        
        if (newAccessToken) {
          console.log('✅ Token refreshed successfully');
          
          // Lưu token mới
          localStorage.setItem("accessToken", newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }
          
          // Hiển thị thông báo thành công
          toast.success('Đã gia hạn phiên đăng nhập thành công!', { 
            autoClose: 2000 
          });
          
          // Cập nhật token cho request hiện tại
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          // Process queue - retry các request đang chờ
          processQueue(null, newAccessToken);
          
          isRefreshing = false;
          
          // Retry request ban đầu với token mới
          return request(originalRequest);
        } else {
          throw new Error('No access token in refresh response');
        }
        
      } catch (refreshError) {
        console.error('❌ Failed to refresh token:', refreshError);
        
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Clear data và logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        
        window.dispatchEvent(new Event('userLoggedOut'));
        
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export { request };