import { request } from "../service/request";
import { toast } from "react-toastify";
// register
export const register = async ({ fullName, username, email, password }) => {
  try {
    const res = await request.post("auth/register", { fullName, username, email, password });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
export const login = async ({ email, password }) => {
  try {
    const res = await request.post("auth/login", { email, password });
    console.log('✅ Login response:', res.data); 
    
    const result = res.data.result || res.data;
    const { accessToken, refreshToken, ...userData } = result;

    if (accessToken && refreshToken) {
      // Clear old data first
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      
      // Save new data
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      
      // Lưu user data (tất cả fields ngoại trừ accessToken và refreshToken)
      if (userData && Object.keys(userData).length > 0) {
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('✅ User saved to localStorage:', userData);
        console.log('✅ Token saved:', accessToken.substring(0, 20) + '...');
      } else {
        console.warn('⚠️ No user data found in response');
      }
      
      // Đợi một chút để đảm bảo localStorage được ghi hoàn toàn
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Dispatch custom event để Header component cập nhật
      console.log('✅ Dispatching userLoggedIn event...');
      window.dispatchEvent(new Event('userLoggedIn'));
      window.dispatchEvent(new Event('storage'));
      
      return userData;
    } else {
      throw new Error('Invalid login response: missing tokens');
    }
  } catch (err) {
    console.error('❌ Login error:', err); 
    throw err.response?.data || err;
  }
};
export const loginWithGoogle = () => {
  window.location.href = `http://localhost:8088/api/v1/oauth2/authorization/google`;
};


export const handleGoogleRedirect = () => {
  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get("accessToken");
  const refreshToken = params.get("refreshToken");

  if (accessToken && refreshToken) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    
    window.dispatchEvent(new Event('userLoggedIn'));
    
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  toast.info('Hẹn gặp lại bạn vào ngày mai nhé !');
  window.dispatchEvent(new Event('userLoggedOut'));
};

export const getProfile = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log('📡 getProfile - Calling /auth/me with token:', token ? token.substring(0, 30) + '...' : 'NO TOKEN');
    
    const res = await request.get("auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('✅ getProfile - Response:', res.data);
    return res.data;
  } catch (err) {
    console.error('❌ getProfile - Error:', {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data
    });
    throw err.response?.data || err;
  }
};

export const updateProfile = async (userData) => {
  try {
    const res = await request.put("user/profile", userData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const getUserStats = async () => {
  try {
    const res = await request.get("user/stats", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};