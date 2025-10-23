// src/hooks/useAutoLogout.ts
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseAutoLogoutOptions {
  inactivityMinutes?: number;
  tokenExpiryMinutes?: number;
}

export const useAutoLogout = ({
  inactivityMinutes = 1,
  tokenExpiryMinutes = 30,
}: UseAutoLogoutOptions = {}) => {
  const navigate = useNavigate();
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tokenExpiryTimerRef = useRef<NodeJS.Timeout | null>(null);

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expiry');
    navigate('/login', { replace: true });
  };

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      logout();
    }, inactivityMinutes * 60 * 1000);
  };

  const startTokenExpiryTimer = () => {
    // Token saqlanganda uning expiry vaqtini ham saqlaymiz
    const tokenExpiry = localStorage.getItem('token_expiry');

    if (tokenExpiry) {
      const expiryTime = new Date(tokenExpiry).getTime();
      const currentTime = new Date().getTime();
      const timeUntilExpiry = expiryTime - currentTime;

      if (timeUntilExpiry > 0) {
        tokenExpiryTimerRef.current = setTimeout(() => {
          logout();
        }, timeUntilExpiry);
      } else {
        // Token allaqachon eskirgan bo'lsa
        logout();
      }
    } else {
      // Agar token_expiry yo'q bo'lsa, default vaqt bilan timer o'rnatamiz
      tokenExpiryTimerRef.current = setTimeout(() => {
        logout();
      }, tokenExpiryMinutes * 60 * 1000);
    }
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    const handleActivity = () => resetInactivityTimer();

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    resetInactivityTimer();
    startTokenExpiryTimer();

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (tokenExpiryTimerRef.current) {
        clearTimeout(tokenExpiryTimerRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  return { logout };
};
