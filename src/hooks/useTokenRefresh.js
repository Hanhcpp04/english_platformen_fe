import { useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * Custom hook để tự động refresh token trước khi hết hạn
 * Sử dụng JWT decode để kiểm tra thời gian hết hạn
 */
const useTokenRefresh = () => {
  const refreshTimeoutRef = useRef(null);
  const isRefreshingRef = useRef(false);

  // Hàm decode JWT token để lấy expiry time
  const decodeToken = useCallback((token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('❌ Error decoding token:', error);
      return null;
    }
  }, []);

  // Hàm refresh token
  const refreshAccessToken = useCallback(async () => {
    if (isRefreshingRef.current) {
      console.log('⏳ Token refresh already in progress, skipping...');
      return;
    }

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.log('❌ No refresh token found');
      return;
    }

    try {
      isRefreshingRef.current = true;
      console.log('🔄 Proactively refreshing token before expiry...');

      const response = await axios.post(
        'http://localhost:8088/api/v1/auth/refresh',
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const result = response.data.result || response.data;
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = result;

      if (newAccessToken) {
        localStorage.setItem('accessToken', newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        console.log('✅ Token refreshed proactively');
        
        // Schedule next refresh
        scheduleTokenRefresh(newAccessToken);
      }
    } catch (error) {
      console.error('❌ Failed to refresh token proactively:', error);
      
      // Nếu refresh token cũng hết hạn, logout user
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('userLoggedOut'));
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
        window.location.href = '/login';
      }
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  // Hàm lên lịch refresh token
  const scheduleTokenRefresh = useCallback(
    (token) => {
      // Clear timeout cũ nếu có
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      const decoded = decodeToken(token);
      if (!decoded || !decoded.exp) {
        console.log('⚠️ Cannot decode token or no expiry time found');
        return;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const expiryTime = decoded.exp;
      const timeUntilExpiry = expiryTime - currentTime;

      console.log('📅 Token info:', {
        expiresAt: new Date(expiryTime * 1000).toLocaleString(),
        timeUntilExpiry: `${Math.floor(timeUntilExpiry / 60)} minutes`,
      });

      // Refresh token trước 5 phút khi sắp hết hạn
      // Hoặc ngay lập tức nếu còn ít hơn 5 phút
      const refreshBuffer = 5 * 60; // 5 minutes in seconds
      const refreshTime = Math.max(timeUntilExpiry - refreshBuffer, 0);

      if (refreshTime <= 0) {
        console.log('⚠️ Token expires soon or already expired, refreshing now...');
        refreshAccessToken();
      } else {
        console.log(
          `⏰ Scheduling token refresh in ${Math.floor(refreshTime / 60)} minutes`
        );
        refreshTimeoutRef.current = setTimeout(() => {
          refreshAccessToken();
        }, refreshTime * 1000);
      }
    },
    [decodeToken, refreshAccessToken]
  );

  // Setup token refresh scheduling khi component mount
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken) {
      scheduleTokenRefresh(accessToken);
    }

    // Listen for login events to restart scheduling
    const handleUserLoggedIn = () => {
      const newToken = localStorage.getItem('accessToken');
      if (newToken) {
        scheduleTokenRefresh(newToken);
      }
    };

    // Listen for logout events to clear scheduling
    const handleUserLoggedOut = () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };

    window.addEventListener('userLoggedIn', handleUserLoggedIn);
    window.addEventListener('userLoggedOut', handleUserLoggedOut);

    // Cleanup
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      window.removeEventListener('userLoggedIn', handleUserLoggedIn);
      window.removeEventListener('userLoggedOut', handleUserLoggedOut);
    };
  }, [scheduleTokenRefresh]);

  return null;
};

export default useTokenRefresh;
