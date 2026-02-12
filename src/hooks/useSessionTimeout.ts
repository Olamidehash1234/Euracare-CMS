import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authEventEmitter } from '../utils/authEventEmitter';

interface UseSessionTimeoutProps {
  onSessionTimeout?: () => void;
}

/**
 * Hook to handle session timeout events
 * Shows a toast message and redirects to login when session expires (401 error)
 */
export const useSessionTimeout = ({ onSessionTimeout }: UseSessionTimeoutProps = {}) => {
  const navigate = useNavigate();
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Subscribe to session timeout events
    unsubscribeRef.current = authEventEmitter.on('sessionTimeout', () => {
      // Call custom callback if provided
      if (onSessionTimeout) {
        onSessionTimeout();
      }

      // Redirect to login page after a short delay to allow toast to display
      // Use ref to ensure only one timeout is scheduled
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        navigate('/auth/login', { replace: true });
      }, 1000);
    });

    // Cleanup: unsubscribe on unmount and clear any pending timeouts
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [navigate, onSessionTimeout]);
};
