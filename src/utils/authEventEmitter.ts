// Simple event emitter for authentication events
// This allows the API interceptor to trigger events that React components can listen to

type AuthEventListener = () => void;

const listeners: {
  sessionTimeout: AuthEventListener[];
} = {
  sessionTimeout: [],
};

// Flag to prevent multiple session timeout events from firing
let sessionTimeoutEmitted = false;

export const authEventEmitter = {
  on(event: 'sessionTimeout', callback: AuthEventListener) {
    listeners[event].push(callback);
    
    // Return unsubscribe function
    return () => {
      listeners[event] = listeners[event].filter(cb => cb !== callback);
    };
  },

  emit(event: 'sessionTimeout') {
    // Prevent multiple emissions of the same event
    if (event === 'sessionTimeout' && sessionTimeoutEmitted) {
      return;
    }
    
    if (event === 'sessionTimeout') {
      sessionTimeoutEmitted = true;
    }
    
    listeners[event].forEach(callback => callback());
  },

  reset() {
    sessionTimeoutEmitted = false;
    listeners.sessionTimeout = [];
  },

  clear() {
    listeners.sessionTimeout = [];
  },
};
