import apiClient from './apiClient';

export interface ServicePayload {
  name: string;
  description?: string;
  image?: string;
  price?: number;
  duration?: string;
  [key: string]: any;
}

export interface ServiceResponse {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price?: number;
  duration?: string;
  createdAt?: string;
  updatedAt?: string;
}

const serviceService = {
  // Get all services
  getAllServices: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<{ data: ServiceResponse[]; total: number }>('/services', { params }),

  // Get single service
  getServiceById: (id: string) =>
    apiClient.get<{ data: ServiceResponse }>(`/services/${id}`),

  // Create service
  createService: (payload: ServicePayload) =>
    apiClient.post<{ data: ServiceResponse }>('/services', payload),

  // Update service
  updateService: (id: string, payload: Partial<ServicePayload>) =>
    apiClient.put<{ data: ServiceResponse }>(`/services/${id}`, payload),

  // Delete service
  deleteService: (id: string) =>
    apiClient.delete(`/services/${id}`),

  // Bulk delete services
  bulkDeleteServices: (ids: string[]) =>
    apiClient.post('/services/bulk-delete', { ids }),
};

export default serviceService;
