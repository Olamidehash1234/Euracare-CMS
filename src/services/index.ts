// Export all API services for easy importing
export { default as apiClient } from './apiClient';
export { default as authService } from './authService';
export { default as doctorService } from './doctorService';
export { default as blogService } from './blogService';
export { default as serviceService } from './serviceService';
export { default as adminService } from './adminService';
export { default as teamService } from './teamService';
export { default as roleService } from './roleService';
export { default as activityLogService } from './activityLogService';
export { default as notificationService } from './notificationService';
export { default as overviewService } from './overviewService';
export { default as testimonialService } from './testimonialService';
export { handleApiError, getErrorMessage } from './errorHandler';
export { uploadToCloudinary, getOptimizedUrl } from './cloudinaryService';

// Export types
export type * from './authService';
export type * from './doctorService';
export type * from './blogService';
export type * from './serviceService';
export type * from './adminService';
export type * from './teamService';
export type * from './cloudinaryService';
export type * from './roleService';
export type * from './activityLogService';
export type * from './notificationService';
export type * from './overviewService';
export type * from './testimonialService';
