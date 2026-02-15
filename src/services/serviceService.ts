import apiClient from './apiClient';
import { uploadToCloudinary } from './cloudinaryService';

export interface ServicePayload {
  snippet?: {
    service_name?: string;
    service_description?: string;
    cover_image_url?: string;
  };
  page?: {
    banner_image_url?: string;
    service_overview?: string;
    video_url?: string;
    conditions_we_treat?: string[];
    test_and_diagnostics?: string[];
    treatments_and_procedures?: string[];
  };
  [key: string]: any;
}

export interface ServiceResponse {
  id: string;
  snippet?: {
    service_name?: string;
    service_description?: string;
    cover_image_url?: string;
  };
  page?: {
    banner_image_url?: string;
    service_overview?: string;
    video_url?: string;
    conditions_we_treat?: string[];
    test_and_diagnostics?: string[];
    treatments_and_procedures?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
}

// Wrapper interfaces for API responses
export interface GetServiceByIdResponse {
  success: boolean;
  data: {
    service: ServiceResponse;
  };
}

const serviceService = {
  // Get all services
  getAllServices: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<{ data: { services: ServiceResponse[] }; total: number }>('/services/', { params }),

  // Get single service
  getServiceById: (id: string) => {
    const response = apiClient.get<GetServiceByIdResponse>(`/services/${id}/`);
    return response;
  },

  // Create service
  createService: (payload: ServicePayload) =>
    apiClient.post<{ data: ServiceResponse }>('/services/', payload),

  // Update service
  updateService: (id: string, payload: Partial<ServicePayload>) =>
    apiClient.patch<{ data: ServiceResponse }>(`/services/${id}`, payload),

  // Delete service
  deleteService: (id: string) =>
    apiClient.delete(`/services/${id}`),

  // Bulk delete services
  bulkDeleteServices: (ids: string[]) =>
    apiClient.post('/services/bulk-delete', { ids }),

  // Upload service cover image to Cloudinary
  uploadServiceCoverImage: async (file: File): Promise<string> => {
    try {
      const response = await uploadToCloudinary(file, 'euracare/services/cover');
      return response.secure_url;
    } catch (error) {
      throw error;
    }
  },

  // Upload service banner image to Cloudinary
  uploadServiceBannerImage: async (file: File): Promise<string> => {
    try {
      const response = await uploadToCloudinary(file, 'euracare/services/banner');
      return response.secure_url;
    } catch (error) {
      throw error;
    }
  },
};

export default serviceService;
