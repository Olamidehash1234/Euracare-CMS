import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import type { ReactNode } from 'react';
import websocketService from '../services/websocketService';
import notificationService from '../services/notificationService';
import type { WebSocketMessage } from '../services/websocketService';
import { formatNotificationTime } from '../utils/dateFormatter';

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
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  bulkDeleteNotifications: (ids: string[]) => Promise<void>;
  connect: (token?: string) => Promise<void>;
  disconnect: () => void;
  loadNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Helper function to convert backend REST API notification to NotificationRow
const mapBackendRestNotification = (notif: any): NotificationRow => {
  // Extract title from module (e.g., "Job-module" → "Career")
  const extractModuleTitle = (module: string): string => {
    if (!module) return 'Notification';
    
    // Special mapping for Job-module
    if (module.toLowerCase() === 'job-module') {
      return 'Careers';
    }
    
    // Remove "-module" suffix if present and capitalize
    const title = module.replace(/-module$/i, '').replace(/-/g, ' ');
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  return {
    id: notif.id,
    title: extractModuleTitle(notif.module),
    role: notif.module ? notif.module.replace(/-/g, ' ').toLowerCase() : 'System',
    message: notif.action || 'No details',
    time: formatNotificationTime(notif.created_at),
    read: notif.read || false,
  };
};

// Helper function to convert WebSocket message to NotificationRow
const mapBackendMessageToNotification = (message: WebSocketMessage): NotificationRow => {
  console.log('🔄 [mapBackendMessageToNotification] Converting message:', message);
  
  // First, try to use the real ID from the backend if available
  let id = '';
  
  // Check if payload has an id (MongoDB ObjectId from backend)
  if (message.payload?.id) {
    id = message.payload.id;
    console.log('🔄 [mapBackendMessageToNotification] Using real ID from payload:', id);
  } 
  // Check if data has an id (MongoDB ObjectId from backend)
  else if (message.data?.id) {
    id = message.data.id;
    console.log('🔄 [mapBackendMessageToNotification] Using real ID from data:', id);
  }
  // Otherwise create a synthetic ID (fallback for older messages without ID)
  else {
    if (message.event && message.payload) {
      id = `${message.event}-${message.payload.action || ''}-${Math.floor(Date.now() / 1000)}`;
    } else if (message.type && message.data) {
      id = `${message.type}-${JSON.stringify(message.data).substring(0, 50)}-${Math.floor(Date.now() / 1000)}`;
    } else {
      id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    console.log('🔄 [mapBackendMessageToNotification] Using synthetic ID:', id);
  }
  
  // Handle the backend's event/payload format with module/action
  if (message.event && message.payload) {
    const { event, payload } = message as any;
    return {
      id,
      title: event || 'Notification',
      role: payload.module || 'System',
      message: payload.action || 'No details',
      time: formatNotificationTime(payload.created_at || new Date().toISOString()),
      read: false,
    };
  }
  
  // Fallback for type/data format with module/action
  if (message.type && message.data) {
    const data = message.data as any;
    return {
      id,
      title: message.type,
      role: data.module || 'System',
      message: data.action || (typeof message.data === 'string' ? message.data : JSON.stringify(message.data)),
      time: formatNotificationTime(data.created_at || new Date().toISOString()),
      read: false,
    };
  }
  
  // Generic fallback
  return {
    id,
    title: 'New Notification',
    message: JSON.stringify(message),
    time: formatNotificationTime(new Date().toISOString()),
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

  const markAsRead = async (id: string) => {
    try {
      console.log('📖 [NotificationContext] Marking notification as read:', id);
      // Find the notification to log details
      const notif = notifications.find(n => n.id === id);
      if (notif) {
        console.log('📖 [NotificationContext] Found notification:', notif.title, notif.message);
      } else {
        console.warn('⚠️ [NotificationContext] Notification not found in state:', id);
      }
      
      // Call backend API to mark as read
      await notificationService.markAsRead(id);
      
      // Update local state
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
      console.log('✅ [NotificationContext] Notification marked as read');
    } catch (err) {
      console.error('❌ [NotificationContext] Error marking notification as read:', err);
      throw err;
    }
  };

  const markAllAsRead = async () => {
    try {
      console.log('📖 [NotificationContext] Marking all notifications as read...');
      // Call backend API to mark all as read
      await notificationService.markAllAsRead();
      
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      console.log('✅ [NotificationContext] All notifications marked as read');
    } catch (err) {
      console.error('❌ [NotificationContext] Error marking all notifications as read:', err);
      throw err;
    }
  };

  const bulkDeleteNotifications = async (ids: string[]) => {
    try {
      console.log('🗑️ [NotificationContext] Bulk deleting notifications:', ids);
      // Call backend API to bulk delete
      await notificationService.bulkDeleteNotifications(ids);
      
      // Update local state - remove deleted notifications
      setNotifications(prev => prev.filter(n => !ids.includes(n.id)));
      console.log('✅ [NotificationContext] Notifications deleted');
    } catch (err) {
      console.error('❌ [NotificationContext] Error bulk deleting notifications:', err);
      throw err;
    }
  };

  // Calculate unread count efficiently using useMemo - best practice for expensive calculations
  const unreadCount = useMemo(() => {
    const count = notifications.filter(n => !n.read).length;
    console.log('📊 [NotificationContext] Unread count recalculated:', count);
    return count;
  }, [notifications]);

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
    bulkDeleteNotifications,
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
