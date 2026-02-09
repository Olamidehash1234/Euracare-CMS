import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import websocketService from '../services/websocketService';
import notificationService from '../services/notificationService';
import type { WebSocketMessage } from '../services/websocketService';

// Match the NotificationRow type from NotificationList
export interface NotificationRow {
  id: string;
  title: string;
  role?: string;
  message?: string;
  time?: string;
  read?: boolean;
}

interface NotificationContextType {
  notifications: NotificationRow[];
  unreadCount: number;
  isConnected: boolean;
  wsStatus: 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED';
  isLoading: boolean;
  error: string | null;
  addNotification: (notification: NotificationRow) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  connect: (token?: string) => Promise<void>;
  disconnect: () => void;
  loadNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Helper function to convert backend REST API notification to NotificationRow
const mapBackendRestNotification = (notif: any): NotificationRow => {
  return {
    id: notif.id,
    title: notif.event || 'Notification',
    role: notif.module || 'System',
    message: notif.action || 'No details',
    time: new Date(notif.created_at).toLocaleTimeString(),
    read: false,
  };
};

// Helper function to convert WebSocket message to NotificationRow
const mapBackendMessageToNotification = (message: WebSocketMessage): NotificationRow => {
  console.log('🔄 [mapBackendMessageToNotification] Converting message:', message);
  
  // Create a stable ID based on the message content (event + action) to prevent duplicates
  let uniqueId = '';
  if (message.event && message.payload) {
    uniqueId = `${message.event}-${message.payload.action || ''}-${Math.floor(Date.now() / 1000)}`;
  } else if (message.type && message.data) {
    uniqueId = `${message.type}-${JSON.stringify(message.data).substring(0, 50)}-${Math.floor(Date.now() / 1000)}`;
  }
  
  const id = uniqueId || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Handle the backend's event/payload format
  if (message.event && message.payload) {
    const { event, payload } = message as any;
    return {
      id,
      title: event || 'Notification',
      role: payload.module || 'System',
      message: payload.action || 'No details',
      time: new Date().toLocaleTimeString(),
      read: false,
    };
  }
  
  // Fallback for type/data format
  if (message.type && message.data) {
    return {
      id,
      title: message.type,
      message: typeof message.data === 'string' ? message.data : JSON.stringify(message.data),
      time: new Date().toLocaleTimeString(),
      read: false,
    };
  }
  
  // Generic fallback
  return {
    id,
    title: 'New Notification',
    message: JSON.stringify(message),
    time: new Date().toLocaleTimeString(),
    read: false,
  };
};


export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [wsStatus, setWsStatus] = useState<'CONNECTING' | 'CONNECTED' | 'DISCONNECTED'>('DISCONNECTED');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const connectionAttemptedRef = useRef(false);
  const loadInProgressRef = useRef(false);

  console.log('🔌 [NotificationProvider] Rendering, wsStatus:', wsStatus, 'isConnected:', isConnected, 'isLoading:', isLoading);

  // Auto-connect on mount if user has a token
  useEffect(() => {
    const autoConnect = async () => {
      try {
        const token = localStorage.getItem('authToken');
        // Use ref to ensure we only attempt connection once
        if (token && !connectionAttemptedRef.current) {
          connectionAttemptedRef.current = true;
          console.log('🔌 [NotificationProvider] Auto-connecting with stored token...');
          setWsStatus('CONNECTING');
          await websocketService.connect(token);
          console.log('✅ [NotificationProvider] Auto-connect successful');
        }
      } catch (err) {
        console.error('❌ [NotificationProvider] Auto-connect failed:', err);
        setWsStatus('DISCONNECTED');
      }
    };

    autoConnect();
  }, []); // Empty dependency array - only runs once on mount

  const loadInitialNotifications = async () => {
    try {
      // Prevent concurrent requests and retries while loading
      if (loadInProgressRef.current) {
        console.log('⏳ [NotificationProvider] Load already in progress, skipping...');
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('⚠️ [NotificationProvider] No auth token found, cannot load notifications');
        setError('Not authenticated');
        setIsLoading(false);
        return;
      }
      
      loadInProgressRef.current = true;
      console.log('📋 [NotificationProvider] Loading notifications from REST API...');
      setIsLoading(true);
      setError(null);
      
      const apiNotifications = await notificationService.getNotifications();
      console.log('✅ [NotificationProvider] Loaded', apiNotifications.length, 'notifications from API');
      
      const mappedNotifications = apiNotifications.map(n => mapBackendRestNotification(n));
      setNotifications(mappedNotifications);
      setIsLoading(false);
    } catch (err: any) {
      console.error('❌ [NotificationProvider] Failed to load notifications:', err);
      
      // Log detailed error information
      if (err.response) {
        console.error('❌ [NotificationProvider] Error Status:', err.response.status);
        console.error('❌ [NotificationProvider] Error Message:', err.response.statusText);
        console.error('❌ [NotificationProvider] Error Data:', err.response.data);
      }
      
      const errorMessage = err.response?.data?.message || (err as Error).message || 'Failed to load notifications';
      setError(errorMessage);
      setIsLoading(false);
    } finally {
      loadInProgressRef.current = false;
    }
  };

  // Handle incoming WebSocket messages
  useEffect(() => {
    console.log('🔌 [NotificationContext] Setting up message listener');
    const unsubscribe = websocketService.onMessage((message: WebSocketMessage) => {
      console.log('📬 [NotificationContext] Raw notification received:', message);

      try {
        const notification = mapBackendMessageToNotification(message);
        console.log('✅ [NotificationContext] Mapped notification:', notification);
        
        setNotifications(prev => {
          // Check if notification already exists to avoid duplicates
          if (prev.some(n => n.id === notification.id)) {
            console.warn('⚠️ [NotificationContext] Duplicate notification ignored');
            return prev;
          }
          console.log('✅ [NotificationContext] Adding notification to state');
          return [notification, ...prev];
        });
      } catch (err) {
        console.error('❌ [NotificationContext] Error processing notification:', err);
      }
    });

    console.log('🔌 [NotificationContext] Message listener mounted');
    return () => {
      console.log('🔌 [NotificationContext] Message listener unmounting (may be React StrictMode)');
      unsubscribe();
    };
  }, []);

  // Handle connection changes
  useEffect(() => {
    console.log('🔌 [NotificationContext] MOUNTING: Setting up connection listener');
    const unsubscribe = websocketService.onConnectionChange((connected: boolean) => {
      console.log('🔗 [NotificationContext] WebSocket connection changed:', connected);
      setIsConnected(connected);
      setWsStatus(connected ? 'CONNECTED' : 'DISCONNECTED');
    });

    console.log('🔌 [NotificationContext] MOUNTED: Connection listener registered');
    return () => {
      console.log('🔌 [NotificationContext] UNMOUNTING: Connection listener unsubscribed');
      unsubscribe();
    };
  }, []);

  const connect = async (token?: string) => {
    try {
      console.log('🔌 [NotificationContext.connect] Starting connection with token:', token ? 'provided' : 'will use localStorage');
      setWsStatus('CONNECTING');
      console.log('🔌 [NotificationContext.connect] Status set to CONNECTING');
      await websocketService.connect(token);
      console.log('✅ [NotificationContext.connect] Connection successful');
    } catch (err) {
      console.error('❌ [NotificationContext.connect] Failed to connect WebSocket:', err);
      setWsStatus('DISCONNECTED');
      throw err;
    }
  };

  const disconnect = () => {
    console.log('🔌 [NotificationContext.disconnect] Disconnecting WebSocket');
    websocketService.disconnect();
    setIsConnected(false);
    setWsStatus('DISCONNECTED');
    console.log('✅ [NotificationContext.disconnect] Disconnection complete');
  };

  const addNotification = (notification: NotificationRow) => {
    console.log('📝 [NotificationContext] Adding notification:', notification);
    setNotifications(prev => {
      if (prev.some(n => n.id === notification.id)) {
        console.warn('⚠️ [NotificationContext] Duplicate notification ignored');
        return prev;
      }
      return [notification, ...prev];
    });
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isConnected,
    wsStatus,
    isLoading,
    error,
    addNotification,
    removeNotification,
    clearNotifications,
    markAsRead,
    markAllAsRead,
    connect,
    disconnect,
    loadNotifications: loadInitialNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Hook to use notifications
 */
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
