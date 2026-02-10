import React, { useState, useEffect } from 'react';
import Toast from '@/components/GlobalComponents/Toast';
import AvatarUpload from '@/components/commonComponents/AvatarUpload';
import { testimonialService, getErrorMessage } from '@/services';
import { uploadToCloudinary } from '@/services/cloudinaryService';
import type { TestimonialPayload as APITestimonialPayload } from '@/services/testimonialService';

export type TestimonialPayload = {
  title: string;
  service: string;
  patientName: string;
  videoLink: string;
  thumbnailUrl?: string;
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
  isLoadingData = false,
}: Props) {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    service: initialData?.service || '',
    patientName: initialData?.patientName || '',
    videoLink: initialData?.videoLink || '',
  });
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(initialData?.thumbnailUrl || null);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'loading'>('loading');
  const [showToast, setShowToast] = useState(false);

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        service: initialData.service || '',
        patientName: initialData.patientName || '',
        videoLink: initialData.videoLink || '',
      });
      setThumbnailPreview(initialData.thumbnailUrl || null);
    }
  }, [initialData]);

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

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingThumbnail(true);
    setToastType('loading');
    setToastMessage('Uploading thumbnail...');
    setShowToast(true);

    try {
      // Show local preview immediately
      const localUrl = URL.createObjectURL(file);
      setThumbnailPreview(localUrl);

      // Upload to Cloudinary
      const response = await uploadToCloudinary(file, 'testimonials');
      
      // Update preview with Cloudinary URL
      setThumbnailPreview(response.secure_url);

      setToastType('success');
      setToastMessage('Thumbnail uploaded successfully!');
      setShowToast(true);
    } catch (error) {
      setThumbnailPreview(null);
      setToastType('error');
      setToastMessage(`Failed to upload thumbnail: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setShowToast(true);
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setToastType('loading');
    setToastMessage(mode === 'create' ? 'Creating testimonial...' : 'Updating testimonial...');
    setShowToast(true);

    try {
      const apiPayload: APITestimonialPayload = {
        title: form.title.trim(),
        patient_name: form.patientName.trim(),
        service: form.service.trim(),
        video_url: form.videoLink.trim(),
        thumbnail_url: thumbnailPreview || undefined,
      };



      if (mode === 'create') {
        await testimonialService.createTestimonial(apiPayload);
        setToastMessage('Testimonial created successfully!  ');
      } else {
        if (!initialData?.testimonialId) {
          throw new Error('Testimonial ID is missing');
        }
        await testimonialService.updateTestimonial(initialData.testimonialId.toString(), apiPayload);
        setToastMessage('Testimonial updated successfully!  ');
      }

      setToastType('success');

      // Wait a moment before closing to show success message
      await new Promise(resolve => setTimeout(resolve, 1500));

      const payload: TestimonialPayload = {
        title: form.title.trim(),
        service: form.service.trim(),
        patientName: form.patientName.trim(),
        videoLink: form.videoLink.trim(),
        thumbnailUrl: thumbnailPreview || undefined,
        testimonialId: initialData?.testimonialId,
      };

      onSave(payload);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setToastType('error');
      setToastMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };




  return (
    <div className="min-h-screen bg-slate-50">
      <Toast
        message={toastMessage}
        type={toastType}
        show={showToast}
        onHide={() => setShowToast(false)}
      />
      <div className="" style={{ opacity: isLoadingData ? 0.5 : 1, pointerEvents: isLoadingData ? 'none' : 'auto' }}>
        <button onClick={onClose} className="inline-flex items-center text-[#0C2141] text-sm lg:text-[16px] font-medium mb-4 gap-[4px] bg-none border-none cursor-pointer hover:text-[#0a1a2f] transition">
          <img src="/icon/right.svg" alt="" /> Back to Testimonials Page
        </button>

        <div className="bg-white rounded-xl border border-[#B9B9B9] overflow-hidden">
          <div className="px-[16px] lg:px-[30px] py-[14px] lg:py-[20px] border-b border-[#0000001A]">
            <h1 className="text-lg lg:text-[20px] text-[#010101] font-medium">
              {mode === 'create' ? 'Add New Testimonial' : 'Edit Testimonial'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-[16px] lg:px-[40px] lg:py-[30px]">
            <div className="border rounded-[10px] border-[#0101011A] p-[16px] lg:p-6">
              <h3 className="text-[16px] font-medium mb-4 lg:mb-[25px]">Testimonial Details</h3>

              {/* Thumbnail Upload Section */}
              <div className="flex gap-6 items-start mb-6">
                <AvatarUpload
                  preview={thumbnailPreview}
                  isUploading={isUploadingThumbnail}
                  buttonLabel="Add a thumbnail image "
                  onFileChange={handleThumbnailUpload}
                />
                <div className="flex-1" />
              </div>

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
                      placeholder="Enter testimonial title"
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
                      placeholder="Enter service name"
                      className="w-full rounded-md border border-[#01010133] px-3 py-[8px] text-sm focus:outline-none"
                    />
                    {errors.service && <div className="text-red-600 text-sm mt-1">{errors.service}</div>}
                  </div>
                </div>

                {/* Patient Name */}
                <div>
                  <div className="mb-[14px] lg:mb-[20px]">
                    <label className="block text-sm text-[#010101] mb-2">Patient Name</label>
                    <input
                      value={form.patientName}
                      onChange={(e) => {
                        setForm(prev => ({ ...prev, patientName: e.target.value }));
                        if (errors.patientName) {
                          setErrors(prev => ({ ...prev, patientName: '' }));
                        }
                      }}
                      placeholder="Enter patient name"
                      className="w-full rounded-md border border-[#01010133] px-3 py-[8px] text-sm focus:outline-none"
                    />
                    {errors.patientName && <div className="text-red-600 text-sm mt-1">{errors.patientName}</div>}
                  </div>
                </div>

                {/* Video URL */}
                <div>
                  <div className="mb-[14px] lg:mb-[20px]">
                    <label className="block text-sm text-[#010101] mb-2">Video URL</label>
                    <input
                      value={form.videoLink}
                      onChange={(e) => {
                        setForm(prev => ({ ...prev, videoLink: e.target.value }));
                        if (errors.videoLink) {
                          setErrors(prev => ({ ...prev, videoLink: '' }));
                        }
                      }}
                      placeholder="Enter video URL"
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
                disabled={isSubmitting}
                className="px-[50px] py-[12px] rounded-[48px] border border-[#0C2141] text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-[40px] py-[12px] rounded-[48px] bg-[#0C2141] text-white text-sm disabled:opacity-50"
              >
                {isSubmitting ? (mode === 'create' ? 'Creating...' : 'Updating...') : (mode === 'create' ? 'Create Testimonial' : 'Update changes')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
