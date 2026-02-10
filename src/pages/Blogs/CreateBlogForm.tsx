import React, { useEffect, useRef, useState } from 'react';
import TiptapEditor from '../../components/Editor/TiptapEditor';
import { blogService } from '@/services';
import { useFormPersist } from '../../hooks/useFormPersist';

export type BlogPayload = {
  snippet?: {
    title: string;
    cover_image_url?: string;
  };
  page?: {
    content?: {
      [key: string]: any;
    };
    video_link_url?: string;
    category?: string;
  };
  video_link_url?: string;
  blogId?: string;
};

interface Props {
  mode?: 'create' | 'edit';
  initialData?: BlogPayload;
  onSave: (data: BlogPayload) => void;
  onClose: () => void;
  isLoading?: boolean;
  isLoadingData?: boolean;
  blogId?: string;
}

export default function CreateBlogForm({ mode = 'create', initialData, onSave, onClose, isLoading = false, isLoadingData = false, }: Props) {
  const coverRef = useRef<HTMLInputElement | null>(null);

  const [coverPreview, setCoverPreview] = useState<string | null>(initialData?.snippet?.cover_image_url || null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: initialData?.snippet?.title || '',
    content: initialData?.page?.content?.additionalProp1 || '',
    videoLink: initialData?.page?.video_link_url || initialData?.video_link_url || '',
    category: (initialData?.page as any)?.category || '',
  });

  // Form persistence hook
  const { restoreFormState, clearFormState } = useFormPersist('blog-form-state', [form, coverPreview]);

  // Restore form state on mount if in create mode
  useEffect(() => {
    if (mode === 'create' && !initialData) {
      const restoredState = restoreFormState();
      if (restoredState && Array.isArray(restoredState) && restoredState.length === 2) {
        const [restoredForm, restoredCover] = restoredState;
        setForm(restoredForm);
        setCoverPreview(restoredCover);
      }
    }
  }, [mode, initialData]);

  const handleFile = async (file?: File) => {
    if (!file) return;

    setIsUploadingImage(true);
    setUploadError(null);

    try {
      // Show local preview immediately
      const url = URL.createObjectURL(file);
      setCoverPreview(url);

      // Upload to Cloudinary
      const imageUrl = await blogService.uploadBlogCoverImage(file);

      // Update preview with Cloudinary URL
      setCoverPreview(imageUrl);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to upload image';
      setUploadError(errorMessage);
      setCoverPreview(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setUploadError('Please enter a blog title');
      return;
    }

    if (!form.content.trim()) {
      setUploadError('Please add blog content');
      return;
    }

    if (!form.category.trim()) {
      setUploadError('Please select a blog category');
      return;
    }

    const payload: BlogPayload = {
      snippet: {
        title: form.title.trim(),
        cover_image_url: coverPreview || undefined,
      },
      page: {
        content: {
          additionalProp1: form.content.trim(),
        },
        video_link_url: form.videoLink.trim() || undefined,
        category: form.category.trim(),
      },
      video_link_url: form.videoLink.trim() || undefined,
    };

    // Clear form state on successful submission
    clearFormState();
    onSave(payload);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="" style={{ opacity: isLoadingData ? 0.5 : 1, pointerEvents: isLoadingData ? 'none' : 'auto' }}>
        <button onClick={onClose} className="inline-flex items-center text-[#0C2141] text-sm lg:text-[16px] font-medium mb-4 gap-[4px] bg-none border-none cursor-pointer hover:text-[#0a1a2f] transition">
          <img src="/icon/right.svg" alt="" /> Back to Blogs & Articles Page
        </button>

        <div className="bg-white rounded-xl border border-[#B9B9B9] overflow-hidden">
          <div className="px-[16px] lg:px-[30px] py-[14px] lg:py-[20px] border-b border-[#0000001A]">
            <h1 className="text-lg lg:text-[20px] text-[#010101] font-medium">
              {mode === 'create' ? 'Add New Blog' : 'Edit Blog'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-[16px] lg:px-[40px] lg:py-[30px]">
            <div className="border rounded-[10px] border-[#0101011A] p-[16px] lg:p-6">
              <h3 className="text-[16px] font-medium mb-4 lg:mb-[25px]">Blogs & Articles Snippet</h3>

              <div className="grid grid-cols-1 gap-6">
                <div className="lg:col-span-2">
                  <div className="mb-[14px] lg:mb-[20px]">
                    <label className="block text-sm text-[#010101] mb-2">Title</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Title of the Blog"
                      className="w-full rounded-md border border-[#01010133] px-3 py-[8px] text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <label className="block text-sm text-[#010101] mb-2">Add Cover Image</label>

                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => !isUploadingImage && coverRef.current?.click()}
                  className="w-full h-[150px] lg:h-[200px] rounded-md border border-[#01010133] bg-[#F2F2F2] flex items-center justify-center text-center p-4 cursor-pointer"
                >
                  {isUploadingImage ? (
                    <div className="text-sm text-[#010101CC]">Uploading...</div>
                  ) : coverPreview ? (
                    <img src={coverPreview} alt="cover" className="h-full w-full object-cover" />
                  ) : (
                    <div>
                      <img src="/icon/upload.svg" alt="upload" className="mx-auto mb-2" />
                      <div className="text-sm">
                        Choose Images to <span className="text-green-600">Upload</span> or Drag and drop or <span className="text-green-600">click</span>
                      </div>
                      <div className="text-xs text-[#010101CC] mt-1">JPG or PNG Supported format. Max file size is 3mb</div>
                    </div>
                  )}

                  <input
                    ref={coverRef}
                    type="file"
                    accept="image/*"
                    disabled={isUploadingImage}
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                </div>

                {uploadError && (
                  <div className="mt-2 text-sm text-red-600">{uploadError}</div>
                )}
              </div>
            </div>

            <div className="mt-8 border rounded-[10px] border-[#0101011A] p-[16px] lg:p-6">
              <h3 className="text-[16px] font-medium mb-4 lg:mb-[25px]">Blog Page</h3>

              <div className="mb-[14px] lg:mb-[20px]">
                <label className="block text-sm text-[#010101] mb-2">Blog Content</label>
                <TiptapEditor
                  content={form.content}
                  onChange={(content) => setForm(prev => ({ ...prev, content }))}
                  placeholder="Write a detailed content of the blog"
                />
              </div>

              <div className="mb-[14px] lg:mb-[20px]">
                <label className="block text-sm text-[#010101] mb-2">Add Video Link</label>
                <input
                  value={form.videoLink}
                  onChange={(e) => setForm(prev => ({ ...prev, videoLink: e.target.value }))}
                  placeholder="Type here"
                  className="w-full rounded-md border border-[#01010133] px-3 py-[8px] text-sm focus:outline-none"
                />
              </div>

              <div className="mb-[14px] lg:mb-[20px]">
                <label className="block text-sm text-[#010101] mb-2">Category</label>
                <input
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Enter blog category"
                  className="w-full rounded-md border border-[#01010133] px-3 py-[8px] text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={onClose} disabled={isLoading} className="px-[50px] py-[12px] rounded-[48px] border border-[#0C2141] text-sm disabled:opacity-50">
                Cancel
              </button>
              <button type="submit" disabled={isLoading || isUploadingImage} className="px-[40px] py-[12px] rounded-[48px] bg-[#0C2141] text-white text-sm disabled:opacity-50">
                {isLoading ? (mode === 'create' ? 'Creating...' : 'Updating...') : (mode === 'create' ? 'Create Blog' : 'Update changes')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
