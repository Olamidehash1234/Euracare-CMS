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
    this.url = import.meta.env.VITE_WS_URL;
    console.log('🔌 [WebSocket constructor] Service initialized');
    console.log('🔌 [WebSocket constructor] WebSocket URL from env:', this.url);
    
    if (!this.url) {
      console.error('❌ [WebSocket constructor] VITE_WS_URL is not set in environment variables!');
    }
  }

  public connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log('🔌 [WebSocket.connect] ====== CONNECTION ATTEMPT STARTED ======');
        console.log('🔌 [WebSocket.connect] Starting connection attempt...');
        console.log('🔌 [WebSocket.connect] Token provided:', token ? 'Yes' : 'No');
        
        // Check if already connected or connecting
        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
          console.log('🔌 [WebSocket.connect] Already connected or connecting. Current readyState:', this.ws.readyState, '(0=CONNECTING, 1=OPEN)');
          resolve();
          return;
        }
        
        // Get token from localStorage if not provided
        const authToken = token || localStorage.getItem('authToken');
        console.log('🔌 [WebSocket.connect] Auth token from storage:', authToken ? `${authToken.substring(0, 20)}...` : 'Not found');
        
        if (!authToken) {
          console.warn('⚠️ [WebSocket.connect] No authentication token available for WebSocket connection');
          console.warn('⚠️ [WebSocket.connect] Make sure you are logged in before calling connect()');
          reject(new Error('No authentication token'));
          return;
        }

        this.accessToken = authToken;
        this.isManualClose = false;

        // Construct WebSocket URL with auth token as query parameter
        const wsUrl = `${this.url}?token=${encodeURIComponent(authToken)}`;
        console.log('🔌 [WebSocket.connect] WebSocket URL:', this.url);
        console.log('🔌 [WebSocket.connect] Full URL with token:', wsUrl.substring(0, 60) + '...');
        
        console.log('🔌 [WebSocket.connect] Attempting to connect to WebSocket...');
        console.log('🔌 [WebSocket.connect] WebSocket.CONNECTING:', WebSocket.CONNECTING);
        console.log('🔌 [WebSocket.connect] WebSocket.OPEN:', WebSocket.OPEN);
        
        this.ws = new WebSocket(wsUrl);
        console.log('🔌 [WebSocket.connect] WebSocket instance created');
        console.log('🔌 [WebSocket.connect] Initial readyState:', this.ws.readyState, '(0=CONNECTING)');

        this.ws.onopen = () => {
          console.log('  [WebSocket.onopen] ====== CONNECTION SUCCESSFUL ======');
          console.log('  [WebSocket.onopen] WebSocket connected successfully');
          console.log('  [WebSocket.onopen] Ready state:', this.ws?.readyState, '(1=OPEN)');
          this.reconnectAttempts = 0;
          this.notifyConnectionHandlers(true);
          resolve();
        };

        this.ws.onmessage = (event) => {
          console.log('📨 [WebSocket.onmessage] Raw message received:', event.data);
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            console.log('📨 [WebSocket.onmessage] Parsed message:', message);
            this.notifyMessageHandlers(message);
          } catch (err) {
            console.error('❌ [WebSocket.onmessage] Error parsing WebSocket message:', err, 'Raw data:', event.data);
          }
        };

        this.ws.onerror = (event) => {
          console.error('❌ [WebSocket.onerror] ====== CONNECTION ERROR ======');
          console.error('❌ [WebSocket.onerror] WebSocket error event:', event);
          console.error('❌ [WebSocket.onerror] Error details:', {
            type: event.type,
            readyState: this.ws?.readyState,
            bubbles: event.bubbles,
            cancelable: event.cancelable
          });
          console.error('❌ [WebSocket.onerror] Make sure:');
          console.error('   1. Backend WebSocket server is running');
          console.error('   2. The URL is reachable and correct');
          console.error('   3. The token is valid');
          console.error('   4. CORS/firewall allows WebSocket connections');
          reject(new Error('WebSocket connection error'));
        };

        this.ws.onclose = (event) => {
          console.log('🔌 [WebSocket.onclose] ====== CONNECTION CLOSED ======');
          console.log('🔌 [WebSocket.onclose] WebSocket disconnected');
          console.log('🔌 [WebSocket.onclose] Close event details:', {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean,
            readyState: this.ws?.readyState
          });
          this.notifyConnectionHandlers(false);

          // Attempt to reconnect if not manually closed
          if (!this.isManualClose && this.reconnectAttempts < this.maxReconnectAttempts) {
            console.log('🔄 [WebSocket.onclose] Will attempt to reconnect...');
            this.scheduleReconnect();
          } else {
            console.log('🔄 [WebSocket.onclose] Will NOT reconnect. Manual close:', this.isManualClose, 'Attempts left:', this.maxReconnectAttempts - this.reconnectAttempts);
          }
        };
        
        console.log('🔌 [WebSocket.connect] All event handlers attached, waiting for connection...');
      } catch (err) {
        console.error('❌ [WebSocket.connect] ====== CONNECTION EXCEPTION ======');
        console.error('❌ [WebSocket.connect] Error creating WebSocket:', err);
        console.error('❌ [WebSocket.connect] Error details:', {
          message: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined
        });
        reject(err);
      }
    });
  }

  /**
   * Disconnect from WebSocket
   */
  public disconnect(): void {
    console.log('🔌 [WebSocket.disconnect] Manually closing WebSocket connection');
    console.log('🔌 [WebSocket.disconnect] Current state:', this.ws ? `Connected (readyState: ${this.ws.readyState})` : 'Not initialized');
    this.isManualClose = true;
    if (this.reconnectTimeout) {
      console.log('🔌 [WebSocket.disconnect] Clearing reconnect timeout');
      clearTimeout(this.reconnectTimeout);
    }
    if (this.ws) {
      console.log('🔌 [WebSocket.disconnect] Closing WebSocket...');
      this.ws.close();
      this.ws = null;
      console.log('  [WebSocket.disconnect] WebSocket closed and nullified');
    } else {
      console.warn('⚠️ [WebSocket.disconnect] WebSocket is null, nothing to disconnect');
    }
  }

  /**
   * Send message to server
   */
  public send(message: WebSocketMessage): void {
    console.log('📤 [WebSocket.send] Attempting to send message:', message);
    console.log('📤 [WebSocket.send] WebSocket state check - ws exists:', this.ws ? 'Yes' : 'No');
    
    if (!this.ws) {
      console.warn('⚠️ [WebSocket.send] WebSocket is null. Cannot send message');
      return;
    }

    console.log('📤 [WebSocket.send] WebSocket readyState:', this.ws.readyState, '(1=OPEN)');
    
    if (this.ws.readyState !== WebSocket.OPEN) {
      console.warn('⚠️ [WebSocket.send] WebSocket is not in OPEN state. Current state:', this.ws.readyState);
      return;
    }

    try {
      const jsonString = JSON.stringify(message);
      this.ws.send(jsonString);
      console.log('  [WebSocket.send] Message sent successfully. Size:', jsonString.length, 'bytes');
    } catch (err) {
      console.error('❌ [WebSocket.send] Error sending WebSocket message:', err);
      console.error('❌ [WebSocket.send] Error details:', {
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined
      });
    }
  }

  /**
   * Subscribe to messages
   */
  public onMessage(handler: MessageHandler): () => void {
    console.log('📋 [WebSocket.onMessage] Registering message handler. Total handlers:', this.messageHandlers.size + 1);
    this.messageHandlers.add(handler);
    console.log('📋 [WebSocket.onMessage] Message handler registered successfully');

    // Return unsubscribe function
    return () => {
      console.log('📋 [WebSocket.onMessage] Unregistering message handler');
      this.messageHandlers.delete(handler);
      console.log('📋 [WebSocket.onMessage] Message handler unregistered. Remaining handlers:', this.messageHandlers.size);
    };
  }

  /**
   * Subscribe to connection changes
   */
  public onConnectionChange(handler: ConnectionHandler): () => void {
    console.log('🔗 [WebSocket.onConnectionChange] Registering connection handler. Total handlers:', this.connectionHandlers.size + 1);
    this.connectionHandlers.add(handler);
    console.log('🔗 [WebSocket.onConnectionChange] Connection handler registered successfully');

    // Return unsubscribe function
    return () => {
      console.log('🔗 [WebSocket.onConnectionChange] Unregistering connection handler');
      this.connectionHandlers.delete(handler);
      console.log('🔗 [WebSocket.onConnectionChange] Connection handler unregistered. Remaining handlers:', this.connectionHandlers.size);
    };
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    const connected = this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    console.log('🔗 [WebSocket.isConnected] Status check - Connected:', connected, 'ws:', this.ws ? 'exists' : 'null', 'readyState:', this.ws?.readyState);
    return connected;
  }

  /**
   * Get connection status
   */
  public getStatus(): 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' {
    if (!this.ws) {
      console.log('📊 [WebSocket.getStatus] Status: DISCONNECTED (ws is null)');
      return 'DISCONNECTED';
    }
    if (this.ws.readyState === WebSocket.CONNECTING) {
      console.log('📊 [WebSocket.getStatus] Status: CONNECTING (readyState = 0)');
      return 'CONNECTING';
    }
    if (this.ws.readyState === WebSocket.OPEN) {
      console.log('📊 [WebSocket.getStatus] Status: CONNECTED (readyState = 1)');
      return 'CONNECTED';
    }
    console.log('📊 [WebSocket.getStatus] Status: DISCONNECTED (readyState =', this.ws.readyState, ')');
    return 'DISCONNECTED';
  }

  /**
   * Notify all message handlers
   */
  private notifyMessageHandlers(message: WebSocketMessage): void {
    console.log(`📨 [WebSocket.notifyMessageHandlers] Notifying ${this.messageHandlers.size} message handler(s)`);
    const handlers = Array.from(this.messageHandlers);
    handlers.forEach((handler, index) => {
      try {
        console.log(`📨 [WebSocket.notifyMessageHandlers] Calling handler ${index + 1}`);
        handler(message);
        console.log(`  [WebSocket.notifyMessageHandlers] Handler ${index + 1} executed successfully`);
      } catch (err) {
        console.error(`❌ [WebSocket.notifyMessageHandlers] Error in handler ${index + 1}:`, err);
      }
    });
  }

  /**
   * Notify all connection handlers
   */
  private notifyConnectionHandlers(isConnected: boolean): void {
    console.log(`🔗 [WebSocket.notifyConnectionHandlers] Notifying ${this.connectionHandlers.size} connection handler(s) - Connected: ${isConnected}`);
    const handlers = Array.from(this.connectionHandlers);
    handlers.forEach((handler, index) => {
      try {
        console.log(`🔗 [WebSocket.notifyConnectionHandlers] Calling handler ${index + 1}`);
        handler(isConnected);
        console.log(`  [WebSocket.notifyConnectionHandlers] Handler ${index + 1} executed successfully`);
      } catch (err) {
        console.error(`❌ [WebSocket.notifyConnectionHandlers] Error in handler ${index + 1}:`, err);
      }
    });
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    console.log('🔄 [WebSocket.scheduleReconnect] Scheduling reconnection attempt');
    console.log('🔄 [WebSocket.scheduleReconnect] Current attempt:', this.reconnectAttempts);
    console.log('🔄 [WebSocket.scheduleReconnect] Max attempts:', this.maxReconnectAttempts);
    console.log('🔄 [WebSocket.scheduleReconnect] Backoff delay:', delay, 'ms');
    console.log(
      `🔄 [WebSocket.scheduleReconnect] Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`
    );

    this.reconnectTimeout = setTimeout(() => {
      console.log('🔄 [WebSocket.scheduleReconnect] Executing reconnection attempt', this.reconnectAttempts);
      if (this.accessToken) {
        console.log('🔄 [WebSocket.scheduleReconnect] Token available, calling connect()');
        this.connect(this.accessToken).catch((err) => {
          console.error('❌ [WebSocket.scheduleReconnect] Reconnection failed:', err);
        });
      } else {
        console.error('❌ [WebSocket.scheduleReconnect] No access token available for reconnection');
      }
    }, delay);
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;
