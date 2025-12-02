import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProfile } from './authService';
import { toast } from 'react-toastify';

function OAuth2RedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const didRunRef = useRef(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (didRunRef.current) return; 
    didRunRef.current = true;
    const handleOAuth2Callback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');

        if (accessToken && refreshToken) {
          // Clear old data first
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          localStorage.removeItem('userEmail');
          
          // Save tokens
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          
          console.log('✅ OAuth2 - Tokens saved, fetching user profile...');
          
          // Fetch user profile
          try {
            const profileRes = await getProfile();
            const userData = profileRes.result || profileRes;
            
            console.log('✅ OAuth2 - User profile fetched:', userData);
            localStorage.setItem('user', JSON.stringify(userData));

            const name = userData.fullname || userData.fullName || userData.username || userData.name || 'Người dùng';
            toast.success(`Đăng nhập thành công, ${name}!`);

            // Dispatch events để Header component cập nhật
            window.dispatchEvent(new Event('userLoggedIn'));
            window.dispatchEvent(new Event('storage'));
            
            // Điều hướng dựa trên role
            const userRole = userData?.role;
            console.log('✅ OAuth2 - User role:', userRole);
            
            // Đợi một chút để đảm bảo events được xử lý
            await new Promise(resolve => setTimeout(resolve, 200));
            
            if (userRole === 'ADMIN') {
              console.log('✅ OAuth2 - Redirecting to admin dashboard...');
              navigate('/admin/dashboard', { replace: true });
            } else {
              console.log('✅ OAuth2 - Redirecting to user dashboard...');
              navigate('/dashboard', { replace: true });
            }
          } catch (profileError) {
            console.error('❌ OAuth2 - Error fetching user profile:', profileError);
            setError('Không thể lấy thông tin người dùng. Đang chuyển hướng...');
            toast.error('Đăng nhập thất bại: không lấy được thông tin người dùng.');
            // Vẫn dispatch event để ít nhất token được nhận biết
            window.dispatchEvent(new Event('userLoggedIn'));
            
            // Fallback về user dashboard nếu không lấy được profile
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 1000);
          }
        } else {
          console.error('❌ OAuth2 - Missing tokens');
          setError('OAuth2 failed: missing access or refresh token.');
          setTimeout(() => {
            navigate('/login?error=oauth_failed', { replace: true });
          }, 2000);
        }
      } catch (err) {
        console.error('❌ OAuth2 - Error:', err);
        setError('Đã xảy ra lỗi trong quá trình đăng nhập.');
        setTimeout(() => {
          navigate('/login?error=oauth_failed', { replace: true });
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuth2Callback();
  }, [location, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-6xl mb-4">❌</div>
          <div className="text-red-600 font-semibold">{error}</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-6xl mb-4 animate-bounce">🔄</div>
          <div className="text-gray-700 font-semibold text-lg mb-2">
            Đang xử lý đăng nhập Google...
          </div>
          <div className="text-gray-500 text-sm">
            Vui lòng chờ trong giây lát
          </div>
          <div className="mt-4">
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-primary animate-progress"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default OAuth2RedirectHandler;
