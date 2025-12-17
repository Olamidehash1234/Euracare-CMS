/**
 * API Configuration Utilities
 * Handles environment variables and API configuration
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://euracare-cms-backend-mco8l.ondigitalocean.app',
  API_VERSION: import.meta.env.VITE_API_VERSION || 'v1',
  FULL_API_URL: `${import.meta.env.VITE_API_BASE_URL || 'https://euracare-cms-backend-mco8l.ondigitalocean.app'}/api/${import.meta.env.VITE_API_VERSION || 'v1'}`,
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Token storage key
  TOKEN_KEY: 'authToken',
  
  // User storage key
  USER_KEY: 'currentUser',
};

/**
 * Check if API is in development mode
 */
export const isDevelopment = () => import.meta.env.DEV;

/**
 * Check if API is in production mode
 */
export const isProduction = () => import.meta.env.PROD;

/**
 * Get stored auth token
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(API_CONFIG.TOKEN_KEY);
};

/**
 * Set auth token
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem(API_CONFIG.TOKEN_KEY, token);
};

/**
 * Remove auth token
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem(API_CONFIG.TOKEN_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Get stored user data
 */
export const getStoredUser = () => {
  const userJson = localStorage.getItem(API_CONFIG.USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

/**
 * Set user data
 */
export const setStoredUser = (user: any): void => {
  localStorage.setItem(API_CONFIG.USER_KEY, JSON.stringify(user));
};

/**
 * Clear user data
 */
export const clearStoredUser = (): void => {
  localStorage.removeItem(API_CONFIG.USER_KEY);
};

/**
 * Clear all auth data
 */
export const clearAuthData = (): void => {
  removeAuthToken();
  clearStoredUser();
};
