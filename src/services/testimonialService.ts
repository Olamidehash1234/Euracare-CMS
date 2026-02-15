import apiClient from './apiClient';

export interface TestimonialPayload {
  title: string;
  patient_name: string;
  service: string;
  video_url: string;
  thumbnail_url?: string;
}

export interface TestimonialResponse {
  id: string;
  title: string;
  patient_name: string;
  service: string;
  video_url: string;
  thumbnail_url?: string;
  createdAt?: string;
  updatedAt?: string;
}

const testimonialService = {
  // Get all testimonials
  getAllTestimonials: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<{ data: { testimonials: TestimonialResponse[]; meta?: any } }>('/testimonials', { params }),

  // Get single testimonial by ID
  getTestimonialById: (id: string) =>
    apiClient.get<{ data: { testimonial: TestimonialResponse } }>(`/testimonials/${id}`),

  // Create testimonial
  createTestimonial: (payload: TestimonialPayload) =>
    apiClient.post<{ data: TestimonialResponse }>('/testimonials/', payload),

  // Update testimonial
  updateTestimonial: (id: string, payload: Partial<TestimonialPayload>) =>
    apiClient.put<{ data: TestimonialResponse }>(`/testimonials/${id}`, payload),

  // Delete testimonial
  deleteTestimonial: (id: string) =>
    apiClient.delete(`/testimonials/${id}/`),

  // Bulk delete testimonials
  bulkDeleteTestimonials: (ids: string[]) =>
    apiClient.post('/testimonials/bulk-delete', { ids }),
};

export default testimonialService;
