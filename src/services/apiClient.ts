import axios, { AxiosError } from 'axios';
import type {AxiosInstance, AxiosResponse} from 'axios';

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
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'https://euracare-cms-backend-mco8l.ondigitalocean.app'}/api/${import.meta.env.VITE_API_VERSION || 'v1'}`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// let isRefreshing = false;

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
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
    // const originalRequest = error.config as any;

    // Handle 401 errors with token refresh attempt
    // if (error.response?.status === 401) {
    //   // Only redirect to login if it's NOT a login request itself
    //   const isLoginRequest = originalRequest?.url?.includes('/auth/login');
    //   const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh');
    //   
    //   if (isLoginRequest || isRefreshRequest) {
    //     // Let login/refresh errors propagate
    //     return Promise.reject(error);
    //   }
    //
    //   // Check if refresh token exists
    //   const refreshToken = localStorage.getItem('refreshToken');
    //   if (!refreshToken) {
    //     // No refresh token - must login
    //     localStorage.removeItem('authToken');
    //     localStorage.removeItem('refreshToken');
    //     localStorage.removeItem('currentUser');
    //     window.location.href = '/auth/login';
    //     return Promise.reject(error);
    //   }
    //
    //   // If not already refreshing, attempt to refresh token
    //   if (!isRefreshing) {
    //     isRefreshing = true;
    //
    //     return new Promise((resolve, reject) => {
    //       axios
    //         .post(
    //           `${import.meta.env.VITE_API_BASE_URL || 'https://euracare-cms-backend-mco8l.ondigitalocean.app'}/api/${import.meta.env.VITE_API_VERSION || 'v1'}/auth/refresh`,
    //           { refresh_token: refreshToken }
    //         )
    //         .then(({ data }) => {
    //           const newAccessToken = data.data?.access_token;
    //           if (newAccessToken) {
    //             localStorage.setItem('authToken', newAccessToken);
    //             apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
    //             originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    //             processQueue(null, newAccessToken);
    //             resolve(apiClient(originalRequest));
    //           } else {
    //             processQueue(error, null);
    //             localStorage.removeItem('authToken');
    //             localStorage.removeItem('refreshToken');
    //             localStorage.removeItem('currentUser');
    //             window.location.href = '/auth/login';
    //             reject(error);
    //           }
    //         })
    //         .catch((err) => {
    //           processQueue(err, null);
    //           localStorage.removeItem('authToken');
    //           localStorage.removeItem('refreshToken');
    //           localStorage.removeItem('currentUser');
    //           window.location.href = '/auth/login';
    //           reject(err);
    //         });
    //     });
    //   } else {
    //     // Already refreshing - queue the request
    //     return new Promise((resolve, reject) => {
    //       failedQueue.push({
    //         resolve: (token: string) => {
    //           originalRequest.headers.Authorization = `Bearer ${token}`;
    //           resolve(apiClient(originalRequest));
    //         },
    //         reject: (err: any) => reject(err),
    //       });
    //     });
    //   }
    // }
    
    if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      // console.error('Access Denied:', error.response.data);
    }

    if (error.response?.status === 404) {
      // console.error('Resource not found');
    }

    if (error.response?.status === 500) {
      // console.error('Server error');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
