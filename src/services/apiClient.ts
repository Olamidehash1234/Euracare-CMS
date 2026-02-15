import axios, { AxiosError } from 'axios';
import type {AxiosInstance, AxiosResponse} from 'axios';
import { authEventEmitter } from '../utils/authEventEmitter';

// let failedQueue: any[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   
//   isRefreshing = false;
//   failedQueue = [];
// };

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// let isRefreshing = false;

// Flag to track if session has timed out
let isSessionTimedOut = false;

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // If session has timed out, reject all new requests
    if (isSessionTimedOut) {
      return Promise.reject(new Error('Session has expired'));
    }

    // Get token from localStorage if it exists
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - Session timeout
    if (error.response?.status === 401 && !isSessionTimedOut) {
      isSessionTimedOut = true;
      
      // Clear auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');

      // Emit session timeout event for component to handle toast + redirect
      authEventEmitter.emit('sessionTimeout');
    }
    
    // Silent error handling - no console output
    return Promise.reject(error);
  }
);

// Export a way to reset the session timeout status (for login)
export const resetSessionTimeout = () => {
  isSessionTimedOut = false;
};

export default apiClient;
