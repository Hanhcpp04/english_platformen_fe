import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPage from './index';

const ProtectedLandingPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('accessToken'); 
        
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);
    return <LandingPage />;
};

export default ProtectedLandingPage;
