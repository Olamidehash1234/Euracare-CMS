import { useState } from 'react';
import Header from '../../components/commonComponents/Header';
import SearchBar from '../../components/commonComponents/SearchBar';
import NotFound from '../../components/commonComponents/NotFound';
import BlogsTable from '../../components/Blogs/BlogsTable';
import CreateBlogForm from './CreateBlogForm';
import type { BlogPayload } from './CreateBlogForm';
import type { BlogType } from '../../components/Blogs/BlogsTable';

const sampleBlogsInitial: BlogType[] = [
  { id: 1, title: 'World Heart Day – Protecting What Matters Most', image: '/image/services/doctor.jpg', publishedAt: new Date().toISOString(), category: 'Cardiology' },
  { id: 2, title: 'Advances in Radiology', image: '/image/services/doctor.jpg', publishedAt: new Date().toISOString(), category: 'Radiology' },
  { id: 3, title: 'Patient Stories: Recovery and Care', image: '/image/services/doctor.jpg', publishedAt: new Date().toISOString(), category: 'Patient Care' },
];

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<BlogType[]>(sampleBlogsInitial);
  const [showCreate, setShowCreate] = useState(false);
  const [editBlog, setEditBlog] = useState<BlogType | null>(null);

  const handleView = (b: BlogType) => console.log('view blog', b);

  const handleEdit = (b: BlogType) => {
    setEditBlog(b);
    setShowCreate(true);
  };

  const handleDelete = (b: BlogType) => {
    setBlogs(prev => prev.filter(x => x.id !== b.id));
  };

  const handleSave = (payload: BlogPayload) => {
    if (editBlog) {
      setBlogs(prev => prev.map(b => (b.id === editBlog.id ? { ...b, ...payload } : b)));
    } else {
      setBlogs(prev => [
        ...prev,
        {
          id: Date.now(),
          title: payload.title,
          image: payload.image,
          publishedAt: payload.publishedAt ?? new Date().toISOString(),
        },
      ]);
    }
    setShowCreate(false);
    setEditBlog(null);
  };

  const hasBlogs = blogs.length > 0;

  if (showCreate || editBlog) {
    return (
      <section>
        <Header title="Blogs & Articles" />
        <div className="p-[16px] lg:p-[40px]">
          <CreateBlogForm
            mode={editBlog ? 'edit' : 'create'}
            initialData={editBlog ? {
              title: editBlog.title,
              shortDescription: undefined,
              image: editBlog.image,
              bannerImage: undefined,
              content: undefined,
              videoLink: undefined,
              publishedAt: editBlog.publishedAt,
            } : undefined}
            onSave={handleSave}
            onClose={() => {
              setShowCreate(false);
              setEditBlog(null);
            }}
          />
        </div>
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
    </section>
  );
};

export default BlogsPage;
