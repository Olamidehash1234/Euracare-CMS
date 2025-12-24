import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    // First try to get message from backend response (check multiple paths)
    const backendMessage = 
      error.response?.data?.message || 
      error.response?.data?.error?.message ||
      error.response?.data?.detail?.message;
    const message = backendMessage || error.message || 'An error occurred';
    
    return {
      message,
      status: error.response?.status,
      data: error.response?.data,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'An unknown error occurred',
  };
};

export const getErrorMessage = (error: unknown): string => {
  const apiError = handleApiError(error);
  console.log('[ErrorHandler] API Error:', { message: apiError.message, status: apiError.status });
  if (apiError.data) {
    console.log('[ErrorHandler] Backend response data:', JSON.stringify(apiError.data, null, 2));
  }
  
  const status = apiError.status;
  
  // Try to get backend message first (check multiple paths for different API response formats)
  const backendMsg = 
    apiError.data?.message || 
    apiError.data?.error?.message ||
    apiError.data?.detail?.message;
  if (backendMsg && typeof backendMsg === 'string' && !backendMsg.includes('Request failed')) {
    return backendMsg;
  }
  
  // Map HTTP status codes to user-friendly messages
  const statusCodeMessages: Record<number, string> = {
    400: 'Invalid request. Please check the information you entered and try again.',
    401: 'Your session has expired. Please log in again.',
    403: 'You do not have permission to perform this action.',
    404: 'The resource you are looking for does not exist.',
    409: 'This record already exists. Please check if the data is already in the system.',
    422: 'Some of the information you provided is invalid. Please review and try again.',
    429: 'Too many requests. Please wait a moment and try again.',
    500: 'Server error. Please try again later.',
    502: 'Service temporarily unavailable. Please try again later.',
    503: 'Service temporarily unavailable. Please try again later.',
    504: 'Request timeout. Please try again later.',
  };
  
  if (status && statusCodeMessages[status]) {
    return statusCodeMessages[status];
  }
  
  // Handle network errors
  if (apiError.message === 'Network Error' || apiError.message.includes('ERR_NETWORK')) {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  if (apiError.message.includes('ERR_TIMEOUT')) {
    return 'Request timeout. Please try again.';
  }
  
  // Fallback message
  return 'Something went wrong. Please try again.';
};
