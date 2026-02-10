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
  const [searchTerm, setSearchTerm] = useState('');
  
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

  const getFilteredBlogs = () => {
    if (!searchTerm.trim()) {
      return blogs;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    return blogs.filter(blog =>
      blog.title?.toLowerCase().includes(lowercaseSearch) ||
      blog.category?.toLowerCase().includes(lowercaseSearch)
    );
  };

  // Fetch blogs on mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await blogService.getAllBlogs();

      // API returns: response.data.data.articles.articles = [...]
      const blogsData = response?.data?.data?.articles?.articles || [];

      if (!Array.isArray(blogsData)) {
        throw new Error('Invalid response format: expected array of blogs');
      }

      // Transform API response to match BlogType interface
      const transformedBlogs: BlogType[] = blogsData.map((blog: any) => ({
        id: blog.id || blog._id,
        title: blog.snippet?.title || blog.title || 'Untitled',
        image: blog.snippet?.cover_image_url || blog.image || '/image/services/doctor.jpg',
        publishedAt: blog.created_at || blog.createdAt || new Date().toISOString(),
        category: blog.page?.category || blog.category || 'General',
      }));

      setBlogs(transformedBlogs);
    } catch (err: any) {
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



  const handleEdit = async (blog: BlogType) => {
    try {
      setIsFetchingBlogData(true);
      showToast('Loading blog details...', 'loading');

      // Fetch full blog data by ID
      const response = await blogService.getBlogById(blog.id.toString());
      // Extract blog from nested response structure - API returns response.data.data.article
      const fullBlog = (response.data?.data as any)?.article || response.data?.data;

      if (fullBlog) {

        const editData: BlogPayload = {
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
            category: (fullBlog as any).page?.category || (fullBlog as any).category || '',
          },
          video_link_url: (fullBlog as any).page?.video_link_url || '',
        };
        setEditBlog(editData);
        setShowCreate(true);
      }
    } catch (err: any) {
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
      showToast('Deleting blog...', 'loading');
      await blogService.deleteBlog(blog.id.toString());

      // Remove the deleted blog from the list
      setBlogs(blogs.filter(b => b.id !== blog.id));

      // Show success toast
      showToast('Blog deleted successfully!  ', 'success');
    } catch (err: any) {
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
      if (editBlog && editBlog.blogId) {
        // Update blog
        showToast('Blog updated successfully!  ', 'success');
        
        // Update local state
        setBlogs(prev => prev.map(b => (b.id === editBlog.blogId ? { 
          ...b, 
          title: payload.snippet?.title || b.title,
          image: payload.snippet?.cover_image_url || b.image,
        } : b)));
      } else {
        // Create blog
        const response = await blogService.createBlog(payload);
        
        showToast('Blog created successfully!  ', 'success');

        // Update local state
        setBlogs(prev => [
          {
            id: response?.data?.data?.id || Date.now(),
            title: payload.snippet?.title || 'New Blog',
            image: payload.snippet?.cover_image_url || '/image/services/doctor.jpg',
            publishedAt: new Date().toISOString(),
            category: payload.page?.category || 'General',
          },
          ...prev,
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
              <SearchBar 
                placeholder="Search for a Blog" 
                value={searchTerm}
                onSearch={setSearchTerm}
              />
            </div>
          </div>

          {hasBlogs ? (
            <BlogsTable
              blogs={getFilteredBlogs()}
              // onView={handleView}
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
