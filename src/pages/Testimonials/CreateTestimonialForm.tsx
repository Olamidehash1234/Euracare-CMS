import React, { useState } from 'react';

export type TestimonialPayload = {
  title: string;
  service: string;
  patientName: string;
  videoLink: string;
  testimonialId?: string;
};

interface Props {
  mode?: 'create' | 'edit';
  initialData?: TestimonialPayload;
  onSave: (data: TestimonialPayload) => void;
  onClose: () => void;
  isLoading?: boolean;
  isLoadingData?: boolean;
  testimonialId?: string;
}

export default function CreateTestimonialForm({
  mode = 'create',
  initialData,
  onSave,
  onClose,
  isLoading = false,
  isLoadingData = false,
  testimonialId,
}: Props) {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    service: initialData?.service || '',
    patientName: initialData?.patientName || '',
    videoLink: initialData?.videoLink || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!form.service.trim()) {
      newErrors.service = 'Service is required';
    }

    if (!form.patientName.trim()) {
      newErrors.patientName = 'Patient name is required';
    }

    if (!form.videoLink.trim()) {
      newErrors.videoLink = 'Video link is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload: TestimonialPayload = {
      title: form.title.trim(),
      service: form.service.trim(),
      patientName: form.patientName.trim(),
      videoLink: form.videoLink.trim(),
      testimonialId: initialData?.testimonialId,
    };

    onSave(payload);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="" style={{ opacity: isLoadingData ? 0.5 : 1, pointerEvents: isLoadingData ? 'none' : 'auto' }}>
        <a href="/testimonials" className="inline-flex items-center text-[#0C2141] text-sm lg:text-[16px] font-medium mb-4 gap-[4px]">
          <img src="/icon/right.svg" alt="" /> Back to Testimonials Page
        </a>

        <div className="bg-white rounded-xl border border-[#B9B9B9] overflow-hidden">
          <div className="px-[16px] lg:px-[30px] py-[14px] lg:py-[20px] border-b border-[#0000001A]">
            <h1 className="text-lg lg:text-[20px] text-[#010101] font-medium">
              {mode === 'create' ? 'Add New Testimonial' : 'Edit Testimonial'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-[16px] lg:px-[40px] lg:py-[30px]">
            <div className="border rounded-[10px] border-[#0101011A] p-[16px] lg:p-6">
              <h3 className="text-[16px] font-medium mb-4 lg:mb-[25px]">Blogs & Articles Snippet</h3>

              <div className="grid grid-cols-1 gap-6 lg:gap-0">
                {/* Title */}
                <div>
                  <div className="mb-[14px] lg:mb-[20px]">
                    <label className="block text-sm text-[#010101] mb-2">Title</label>
                    <input
                      value={form.title}
                      onChange={(e) => {
                        setForm(prev => ({ ...prev, title: e.target.value }));
                        if (errors.title) {
                          setErrors(prev => ({ ...prev, title: '' }));
                        }
                      }}
                      placeholder="Write about the Doctor"
                      className="w-full rounded-md border border-[#01010133] px-3 py-[8px] text-sm focus:outline-none"
                    />
                    {errors.title && <div className="text-red-600 text-sm mt-1">{errors.title}</div>}
                  </div>
                </div>

                {/* Service */}
                <div>
                  <div className="mb-[14px] lg:mb-[20px]">
                    <label className="block text-sm text-[#010101] mb-2">Service</label>
                    <input
                      value={form.service}
                      onChange={(e) => {
                        setForm(prev => ({ ...prev, service: e.target.value }));
                        if (errors.service) {
                          setErrors(prev => ({ ...prev, service: '' }));
                        }
                      }}
                      placeholder="Write about the Doctor"
                      className="w-full rounded-md border border-[#01010133] px-3 py-[8px] text-sm focus:outline-none"
                    />
                    {errors.service && <div className="text-red-600 text-sm mt-1">{errors.service}</div>}
                  </div>
                </div>

                {/* Patient Name */}
                <div>
                  <div className="mb-[14px] lg:mb-[20px]">
                    <label className="block text-sm text-[#010101] mb-2">Patients Name</label>
                    <input
                      value={form.patientName}
                      onChange={(e) => {
                        setForm(prev => ({ ...prev, patientName: e.target.value }));
                        if (errors.patientName) {
                          setErrors(prev => ({ ...prev, patientName: '' }));
                        }
                      }}
                      placeholder="Write about the Doctor"
                      className="w-full rounded-md border border-[#01010133] px-3 py-[8px] text-sm focus:outline-none"
                    />
                    {errors.patientName && <div className="text-red-600 text-sm mt-1">{errors.patientName}</div>}
                  </div>
                </div>

                {/* Video Link */}
                <div>
                  <div className="mb-[14px] lg:mb-[20px]">
                    <label className="block text-sm text-[#010101] mb-2">Add Video Link</label>
                    <input
                      value={form.videoLink}
                      onChange={(e) => {
                        setForm(prev => ({ ...prev, videoLink: e.target.value }));
                        if (errors.videoLink) {
                          setErrors(prev => ({ ...prev, videoLink: '' }));
                        }
                      }}
                      placeholder="Type here"
                      className="w-full rounded-md border border-[#01010133] px-3 py-[8px] text-sm focus:outline-none"
                    />
                    {errors.videoLink && <div className="text-red-600 text-sm mt-1">{errors.videoLink}</div>}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-[50px] py-[12px] rounded-[48px] border border-[#0C2141] text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-[40px] py-[12px] rounded-[48px] bg-[#0C2141] text-white text-sm disabled:opacity-50"
              >
                {isLoading ? (mode === 'create' ? 'Creating...' : 'Updating...') : (mode === 'create' ? 'Create Testimonial' : 'Update changes')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
