import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useTokenExpiry = (expiryHours = 1) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const createdAt = localStorage.getItem('token_created_at');

    if (!token || !createdAt) {
      localStorage.removeItem('token');
      localStorage.removeItem('token_created_at');
      navigate('/login', { replace: true });
      return;
    }

    const now = Date.now();
    const tokenAge = now - Number(createdAt);
    const expiryTime = expiryHours * 60 * 60 * 1000; 

    if (tokenAge > expiryTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('token_created_at');
      toast.warning('Token muddati tugagan. Iltimos, qayta tizimga kiring.');
      navigate('/login', { replace: true });
    }
  }, [navigate, expiryHours]);
};
