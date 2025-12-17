import apiClient from './apiClient';

export interface BlogPayload {
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  author?: string;
  category?: string;
  tags?: string[];
  status?: 'draft' | 'published';
  [key: string]: any;
}

export interface BlogResponse {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  author?: string;
  category?: string;
  tags?: string[];
  status: 'draft' | 'published';
  createdAt?: string;
  updatedAt?: string;
}

const blogService = {
  // Get all blogs
  getAllBlogs: (params?: { page?: number; limit?: number; search?: string; status?: string }) =>
    apiClient.get<{ data: BlogResponse[]; total: number }>('/blogs', { params }),

  // Get single blog
  getBlogById: (id: string) =>
    apiClient.get<{ data: BlogResponse }>(`/blogs/${id}`),

  // Create blog
  createBlog: (payload: BlogPayload) =>
    apiClient.post<{ data: BlogResponse }>('/blogs', payload),

  // Update blog
  updateBlog: (id: string, payload: Partial<BlogPayload>) =>
    apiClient.put<{ data: BlogResponse }>(`/blogs/${id}`, payload),

  // Delete blog
  deleteBlog: (id: string) =>
    apiClient.delete(`/blogs/${id}`),

  // Publish blog
  publishBlog: (id: string) =>
    apiClient.patch(`/blogs/${id}/publish`),

  // Bulk delete blogs
  bulkDeleteBlogs: (ids: string[]) =>
    apiClient.post('/blogs/bulk-delete', { ids }),
};

export default blogService;
