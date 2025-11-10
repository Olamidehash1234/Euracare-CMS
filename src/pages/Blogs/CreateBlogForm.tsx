import React, { useRef, useState } from 'react';
import TiptapEditor from '../../components/Editor/TiptapEditor';

export type BlogPayload = {
  title: string;
  shortDescription?: string;
  image?: string; // cover image
  bannerImage?: string;
  content?: string;
  videoLink?: string;
  publishedAt?: string;
};

interface Props {
  mode?: 'create' | 'edit';
  initialData?: BlogPayload;
  onSave: (data: BlogPayload) => void;
  onClose: () => void;
}

export default function CreateBlogForm({ mode = 'create', initialData, onSave, onClose }: Props) {
  const coverRef = useRef<HTMLInputElement | null>(null);

  const [coverPreview, setCoverPreview] = useState<string | null>(initialData?.image || null);

  const [form, setForm] = useState({
    title: initialData?.title || '',
    shortDescription: initialData?.shortDescription || '',
    content: initialData?.content || '',
    videoLink: initialData?.videoLink || '',
  });

  const handleFile = (file?: File, setter?: (v: string | null) => void) => {
    if (!file || !setter) return;
    const url = URL.createObjectURL(file);
    setter(url);
  };

  const handleDrop = (e: React.DragEvent, setter: (v: string | null) => void) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFile(file, setter);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: form.title.trim(),
      shortDescription: form.shortDescription.trim(),
      image: coverPreview || undefined,
      content: form.content.trim(),
      videoLink: form.videoLink.trim() || undefined,
      publishedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen">
      <div className="">
        <a href="/blogs" className="inline-flex items-center text-[#0C2141] text-sm lg:text-[16px] font-medium mb-4 gap-[4px]">
          <img src="/icon/right.svg" alt="" /> Back to Blogs & Articles Page
        </a>

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
                  onDrop={(e) => handleDrop(e, setCoverPreview)}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => coverRef.current?.click()}
                  className="w-full h-[150px] lg:h-[200px] rounded-md border border-[#01010133] bg-[#F2F2F2] flex items-center justify-center text-center p-4 cursor-pointer"
                >
                  {coverPreview ? (
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
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0], setCoverPreview)}
                  />
                </div>
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
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-[50px] py-[12px] rounded-[48px] border border-[#0C2141] text-sm">
                Cancel
              </button>
              <button type="submit" className="px-[40px] py-[12px] rounded-[48px] bg-[#0C2141] text-white text-sm">
                {mode === 'create' ? 'Create Blog' : 'Update changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
