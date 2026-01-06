import { useState, useEffect } from 'react';
import Header from '../../components/commonComponents/Header';
import SearchBar from '../../components/commonComponents/SearchBar';
import NotFound from '../../components/commonComponents/NotFound';
import BlogsTable from '../../components/Blogs/BlogsTable';
import CreateBlogForm from './CreateBlogForm';
import type { BlogPayload } from './CreateBlogForm';
import type { BlogType } from '../../components/Blogs/BlogsTable';
import { blogService } from '@/services';
import Toast from '@/components/GlobalComponents/Toast';
import LoadingSpinner from '@/components/commonComponents/LoadingSpinner';

const sampleBlogsInitial: BlogType[] = [
  // { id: 1, title: 'World Heart Day – Protecting What Matters Most', image: '/image/services/doctor.jpg', publishedAt: new Date().toISOString(), category: 'Cardiology' },
  // { id: 2, title: 'Advances in Radiology', image: '/image/services/doctor.jpg', publishedAt: new Date().toISOString(), category: 'Radiology' },
  // { id: 3, title: 'Patient Stories: Recovery and Care', image: '/image/services/doctor.jpg', publishedAt: new Date().toISOString(), category: 'Patient Care' },
];

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<BlogType[]>(sampleBlogsInitial);
  const [showCreate, setShowCreate] = useState(false);
  const [editBlog, setEditBlog] = useState<BlogPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingBlogData, setIsFetchingBlogData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'loading'; show: boolean }>({
    message: '',
    type: 'success',
    show: false,
  });

  const showToast = (message: string, type: 'success' | 'error' | 'loading') => {
    setToast({ message, type, show: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Fetch blogs on mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('[BlogsPage] Fetching blogs...');
      const response = await blogService.getAllBlogs();
      console.log('[BlogsPage] Raw API response:', response);

      // API returns: response.data.data.articles.articles = [...]
      const blogsData = response?.data?.data?.articles?.articles || [];

      console.log('[BlogsPage] Parsed blogs data:', blogsData);

      if (!Array.isArray(blogsData)) {
        throw new Error('Invalid response format: expected array of blogs');
      }

      // Transform API response to match BlogType interface
      const transformedBlogs: BlogType[] = blogsData.map((blog: any) => ({
        id: blog.id || blog._id,
        title: blog.snippet?.title || blog.title || 'Untitled',
        image: blog.snippet?.cover_image_url || blog.image || '/image/services/doctor.jpg',
        publishedAt: blog.createdAt || new Date().toISOString(),
        category: blog.category || 'General',
      }));

      setBlogs(transformedBlogs);
      console.log('[BlogsPage] Blogs loaded:', transformedBlogs);
    } catch (err: any) {
      console.error('[BlogsPage] Error fetching blogs:', err);
      let errorMessage = 'Failed to load blogs';

      if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to perform this action';
      } else if (err.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (blog: BlogType) => {
    console.log('[BlogsPage] Viewing blog:', blog);
  };

  const handleEdit = async (blog: BlogType) => {
    try {
      setIsFetchingBlogData(true);
      console.log('[BlogsPage] Attempting to fetch full blog data for ID:', blog.id);

      // Fetch full blog data by ID
      const response = await blogService.getBlogById(blog.id.toString());
      // Extract blog from nested response structure - API returns response.data.data.article
      const fullBlog = (response.data?.data as any)?.article || response.data?.data;

      if (fullBlog) {
        console.log('[BlogsPage] Full blog data loaded:', fullBlog);

        setEditBlog({
          blogId: blog.id.toString(),
          snippet: {
            title: (fullBlog as any).snippet?.title || (fullBlog as any).title || '',
            cover_image_url: (fullBlog as any).snippet?.cover_image_url || (fullBlog as any).image || '',
          },
          page: {
            content: {
              additionalProp1: (fullBlog as any).page?.content?.additionalProp1 || '',
            },
            video_link_url: (fullBlog as any).page?.video_link_url || '',
          },
          video_link_url: (fullBlog as any).page?.video_link_url || '',
        });
        setShowCreate(true);
      }
    } catch (err: any) {
      console.error('[BlogsPage] Error fetching blog details:', err);
      let errorMessage = 'Failed to load blog details for editing';

      if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to perform this action';
      } else if (err.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsFetchingBlogData(false);
    }
  };

  const handleDelete = async (blog: BlogType) => {
    try {
      console.log('[BlogsPage] Deleting blog with ID:', blog.id);
      await blogService.deleteBlog(blog.id.toString());
      console.log('[BlogsPage] Blog deleted successfully');

      // Remove the deleted blog from the list
      setBlogs(blogs.filter(b => b.id !== blog.id));

      // Show success toast
      showToast('Blog deleted successfully! ✅', 'success');
    } catch (err: any) {
      console.error('[BlogsPage] Error deleting blog:', err);
      let errorMessage = 'Failed to delete blog';

      if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to perform this action';
      } else if (err.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      showToast(errorMessage, 'error');
    }
  };

  const handleSave = async (payload: BlogPayload) => {
    setIsLoading(true);
    showToast(editBlog ? 'Updating blog...' : 'Creating blog...', 'loading');

    try {
      console.log('[BlogsPage] Submitting blog payload:', payload);

      if (editBlog && editBlog.blogId) {
        // Update blog
        console.log('[BlogsPage] Updating blog with ID:', editBlog.blogId);
        const response = await blogService.updateBlog(editBlog.blogId, payload);
        console.log('[BlogsPage] Blog updated successfully:', response);
        showToast('Blog updated successfully! ✅', 'success');
        
        // Update local state
        setBlogs(prev => prev.map(b => (b.id === editBlog.blogId ? { 
          ...b, 
          title: payload.snippet?.title || b.title,
          image: payload.snippet?.cover_image_url || b.image,
        } : b)));
      } else {
        // Create blog
        console.log('[BlogsPage] Creating new blog...');
        const response = await blogService.createBlog(payload);
        console.log('[BlogsPage] Blog created successfully:', response);
        
        showToast('Blog created successfully! ✅', 'success');

        // Update local state
        setBlogs(prev => [
          ...prev,
          {
            id: response?.data?.data?.id || Date.now(),
            title: payload.snippet?.title || 'New Blog',
            image: payload.snippet?.cover_image_url || '/image/services/doctor.jpg',
            publishedAt: new Date().toISOString(),
            category: 'General',
          },
        ]);
      }

      // Close form after delay
      setTimeout(() => {
        setShowCreate(false);
        setEditBlog(null);
        // Refetch blogs after save
        fetchBlogs();
      }, 1500);
    } catch (error: any) {
      console.error('[BlogsPage] Error saving blog:', error);
      console.error('[BlogsPage] Error status:', error?.response?.status);
      console.error('[BlogsPage] Error data:', error?.response?.data);
      console.error('[BlogsPage] Full error response:', JSON.stringify(error?.response?.data, null, 2));
      
      let errorMessage = 'Failed to save blog';
      if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to perform this action';
      } else if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.errors) {
        errorMessage = JSON.stringify(error.response.data.errors);
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const hasBlogs = blogs.length > 0;

  if (showCreate || editBlog) {
    return (
      <section>
        <Header title="Blogs & Articles" />
        {isFetchingBlogData && <LoadingSpinner heightClass="fixed inset-0 h-screen" />}
        <div className="p-[16px] lg:p-[40px]" style={{ opacity: isFetchingBlogData ? 0.5 : 1, pointerEvents: isFetchingBlogData ? 'none' : 'auto' }}>
          <CreateBlogForm
            mode={editBlog ? 'edit' : 'create'}
            initialData={editBlog || undefined}
            isLoading={isLoading}
            isLoadingData={isFetchingBlogData}
            onSave={handleSave}
            onClose={() => {
              setShowCreate(false);
              setEditBlog(null);
            }}
            blogId={editBlog?.blogId}
          />
        </div>
        <Toast 
          message={toast.message} 
          type={toast.type} 
          show={toast.show} 
          onHide={hideToast} 
        />
      </section>
    );
  }

  return (
    <section>
      <Header title="Blogs & Articles" />
      <div className="p-[16px] lg:p-[40px]">
        <div className="bg-white rounded-[14px] p-6 lg:px-[20px] lg:py-[23px] shadow-sm border border-gray-200">
          <div className="flex items-center flex-col lg:flex-row gap-[20px] justify-between mb-[22px]">
            <button onClick={() => setShowCreate(true)} className="flex items-center order-1 lg:order-2 ml-auto lg:ml-0 lg:w-auto gap-2 px-6 py-[9px] lg:py-[13px] lg:px-[20px] rounded-full bg-[#0C2141] text-white text-sm font-medium">
              <span className="text-lg">+</span> Add New Blog
            </button>

            <div className="flex items-center w-full lg:w-1/2 order-2 lg:order-1">
              <SearchBar placeholder="Search for a Blog" />
            </div>
          </div>

          {hasBlogs ? (
            <BlogsTable
              blogs={blogs}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : isLoading ? (
            <LoadingSpinner heightClass="py-[200px]" />
          ) : error ? (
            <NotFound
              title="Error Loading Blogs"
              description={error}
              imageSrc="/not-found.png"
              ctaText="Try Again"
              onCta={fetchBlogs}
            />
          ) : (
            <NotFound
              title="No Blogs Yet"
              description={`It looks like you haven't added any blogs yet. Once added, they'll appear here for you to manage.`}
              imageSrc="/not-found.png"
              ctaText="Add New Blog"
              onCta={() => setShowCreate(true)}
            />
          )}
        </div>
      </div>
      <Toast 
        message={toast.message} 
        type={toast.type} 
        show={toast.show} 
        onHide={hideToast} 
      />
    </section>
  );
};

export default BlogsPage;
