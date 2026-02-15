export interface WebSocketMessage {
  type?: string;
  data?: any;
  event?: string;
  payload?: any;
  timestamp?: string;
}

export interface WebSocketNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
}

type MessageHandler = (message: WebSocketMessage) => void;
type ConnectionHandler = (isConnected: boolean) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private messageHandlers: Set<MessageHandler> = new Set();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private isManualClose = false;
  private accessToken: string | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.url = import.meta.env.VITE_WS_URL || 'wss://euracare-cms-backend-mco8l.ondigitalocean.app/api/v1/notification/ws';
  }

  public connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        
        // Check if already connected or connecting
        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
          resolve();
          return;
        }
        
        // Get token from localStorage if not provided
        const authToken = token || localStorage.getItem('authToken');
        
        if (!authToken) {
          reject(new Error('No authentication token'));
          return;
        }

        this.accessToken = authToken;
        this.isManualClose = false;

        // Construct WebSocket URL with auth token as query parameter
        const wsUrl = `${this.url}?token=${encodeURIComponent(authToken)}`;
        
        
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          this.notifyConnectionHandlers(true);
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.notifyMessageHandlers(message);
          } catch (err) {
          }
        };

        this.ws.onerror = (_event) => {
          reject(new Error('WebSocket connection error'));
        };

        this.ws.onclose = (_event) => {
          this.notifyConnectionHandlers(false);

          // Attempt to reconnect if not manually closed
          if (!this.isManualClose && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          } else {
          }
        };
        
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Disconnect from WebSocket
   */
  public disconnect(): void {
    this.isManualClose = true;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    } else {
    }
  }

  /**
   * Send message to server
   */
  public send(message: WebSocketMessage): void {
    
    if (!this.ws) {
      return;
    }

    
    if (this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    try {
      const jsonString = JSON.stringify(message);
      this.ws.send(jsonString);
    } catch (err) {
    }
  }

  /**
   * Subscribe to messages
   */
  public onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);

    // Return unsubscribe function
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  /**
   * Subscribe to connection changes
   */
  public onConnectionChange(handler: ConnectionHandler): () => void {
    this.connectionHandlers.add(handler);

    // Return unsubscribe function
    return () => {
      this.connectionHandlers.delete(handler);
    };
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    const connected = this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    return connected;
  }

  /**
   * Get connection status
   */
  public getStatus(): 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' {
    if (!this.ws) {
      return 'DISCONNECTED';
    }
    if (this.ws.readyState === WebSocket.CONNECTING) {
      return 'CONNECTING';
    }
    if (this.ws.readyState === WebSocket.OPEN) {
      return 'CONNECTED';
    }
    return 'DISCONNECTED';
  }

  /**
   * Notify all message handlers
   */
  private notifyMessageHandlers(message: WebSocketMessage): void {
    const handlers = Array.from(this.messageHandlers);
    handlers.forEach((handler, _index) => {
      try {
        handler(message);
      } catch (err) {
      }
    });
  }

  /**
   * Notify all connection handlers
   */
  private notifyConnectionHandlers(isConnected: boolean): void {
    const handlers = Array.from(this.connectionHandlers);
    handlers.forEach((handler, _index) => {
      try {
        handler(isConnected);
      } catch (err) {
      }
    });
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff


    this.reconnectTimeout = setTimeout(() => {
      if (this.accessToken) {
        this.connect(this.accessToken).catch((_err) => {
        });
      } else {
      }
    }, delay);
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;
