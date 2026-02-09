import { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';

/**
 * Hook to automatically connect WebSocket on component mount
 * and disconnect on unmount
 */
export const useWebSocketConnection = (token?: string, autoConnect = true) => {
  const { isConnected, wsStatus, connect, disconnect } = useNotifications();

  useEffect(() => {
    if (autoConnect && !isConnected) {
      console.log('🔌 Auto-connecting WebSocket...');
      connect(token).catch((err) => {
        console.error('❌ Auto-connect failed:', err);
      });
    }

    // Cleanup on unmount
    return () => {
      if (autoConnect) {
        console.log('🔌 Disconnecting WebSocket on unmount');
        disconnect();
      }
    };
  }, [autoConnect, token, isConnected, connect, disconnect]);

  return {
    isConnected,
    wsStatus,
    connect,
    disconnect,
  };
};

/**
 * Hook to listen for specific notification types
 */
export const useNotificationListener = (
  onNotification: (notification: any) => void,
  type?: string
) => {
  const { notifications } = useNotifications();

  useEffect(() => {
    if (notifications.length === 0) return;

    const latestNotification = notifications[0];
    // Filter by title field instead of type (for NotificationRow)
    if (!type || latestNotification.title === type) {
      onNotification(latestNotification);
    }
  }, [notifications, type, onNotification]);
};

/**
 * Hook to filter notifications by type
 */
export const useNotificationsByType = (type: string) => {
  const { notifications } = useNotifications();
  return notifications.filter(n => n.title === type);
};

/**
 * Hook to get unread notifications
 */
export const useUnreadNotifications = () => {
  const { notifications, unreadCount } = useNotifications();
  return {
    unread: notifications.filter(n => !n.read),
    count: unreadCount,
  };
};
