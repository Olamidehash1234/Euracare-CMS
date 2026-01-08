import apiClient from './apiClient';
import { uploadToCloudinary } from './cloudinaryService';

export interface BlogPayload {
  snippet?: {
    title: string;
    cover_image_url?: string;
  };
  page?: {
    content?: {
      [key: string]: any;
    };
    video_link_url?: string;
  };
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
    apiClient.get<{ data: { articles: { articles: BlogResponse[]; meta: any } } }>('/articles/', { params }),

  // Get single blog
  getBlogById: (id: string) =>
    apiClient.get<{ data: BlogResponse }>(`/articles/${id}/`),

  // Create blog
  createBlog: (payload: BlogPayload) =>
    apiClient.post<{ data: BlogResponse }>('/articles/', payload),

  // Update blog
  updateBlog: (id: string, payload: Partial<BlogPayload>) =>
    apiClient.put<{ data: BlogResponse }>(`/articles/${id}`, payload),

  // Delete blog
  deleteBlog: (id: string) =>
    apiClient.delete(`/articles/${id}`),
  // Publish blog
  publishBlog: (id: string) =>
    apiClient.patch(`/articles/${id}/publish`),

  // Bulk delete blogs
  bulkDeleteBlogs: (ids: string[]) =>
    apiClient.post('/blogs/bulk-delete', { ids }),

  // Upload blog cover image to Cloudinary
  uploadBlogCoverImage: async (file: File): Promise<string> => {
    try {
      const response = await uploadToCloudinary(file, 'euracare/blogs');
      return response.secure_url;
    } catch (error) {
      // console.error('[BlogService] Cover image upload error:', error);
      throw error;
    }
  },
};

export default blogService;
