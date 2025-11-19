import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * Protected Route Component
 * Kiểm tra xem user đã login chưa trước khi cho phép truy cập
 * Nếu chưa login hoặc token không hợp lệ, redirect về trang login
 */
const ProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  
  // Kiểm tra token có tồn tại và hợp lệ không
  const hasValidToken = accessToken && 
                        accessToken !== 'undefined' && 
                        accessToken !== 'null' && 
                        accessToken.trim() !== '';
  
  const hasValidRefreshToken = refreshToken && 
                               refreshToken !== 'undefined' && 
                               refreshToken !== 'null' && 
                               refreshToken.trim() !== '';

  // Nếu không có token hợp lệ, redirect về login
  if (!hasValidToken || !hasValidRefreshToken) {
    toast.warning('Vui lòng đăng nhập để tiếp tục!');
    return <Navigate to="/login" replace />;
  }

  // Nếu có token hợp lệ, cho phép truy cập
  return children;
};

export default ProtectedRoute;
