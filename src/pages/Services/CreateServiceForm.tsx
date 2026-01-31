import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceService } from '@/services';
import Toast from '@/components/GlobalComponents/Toast';

export type ServicePayload = {
  title: string;
  shortDescription?: string;
  image?: string;
  bannerImage?: string;
  publishedAt?: string;
  doctors?: string[];
  conditions?: string[];
  tests?: string[];
  treatments?: string[];
  videoLink?: string;
  overview?: string;
  serviceId?: string;
};

interface Props {
  mode?: 'create' | 'edit';
  initialData?: ServicePayload;
  onSave: (data: ServicePayload) => void;
  onClose?: () => void;
  isLoading?: boolean;
}

export default function CreateServiceForm({ mode = 'create', initialData, onSave }: Props) {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const bannerFileRef = useRef<HTMLInputElement | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(initialData?.image || null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(initialData?.bannerImage || null);
  const [isUploadingCoverImage, setIsUploadingCoverImage] = useState(false);
  const [isUploadingBannerImage, setIsUploadingBannerImage] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'loading'; show: boolean }>({
    message: '',
    type: 'success',
    show: false,
  });
  
  const [form, setForm] = useState({
    title: initialData?.title || '',
    shortDescription: initialData?.shortDescription || '',
    overview: initialData?.overview || '',
    videoLink: initialData?.videoLink || '',
  });

  const [conditionInput, setConditionInput] = useState('');
  const [conditions, setConditions] = useState<string[]>(initialData?.conditions || []);

  const [testInput, setTestInput] = useState('');
  const [tests, setTests] = useState<string[]>(initialData?.tests || []);

  const [treatmentInput, setTreatmentInput] = useState('');
  const [treatments, setTreatments] = useState<string[]>(initialData?.treatments || []);





  // Update form state when initialData changes (for edit mode)
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      console.log('[CreateServiceForm] Updating form state with initialData');
      setForm({
        title: initialData.title || '',
        shortDescription: initialData.shortDescription || '',
        overview: initialData.overview || '',
        videoLink: initialData.videoLink || '',
      });
      setCoverPreview(initialData.image || null);
      setBannerPreview(initialData.bannerImage || null);
      setConditions(initialData.conditions || []);
      setTests(initialData.tests || []);
      setTreatments(initialData.treatments || []);
      console.log('[CreateServiceForm] Form state updated:', {
        title: initialData.title,
        shortDescription: initialData.shortDescription,
        overview: initialData.overview,
        videoLink: initialData.videoLink,
      });
    }
  }, [initialData, mode]);

  const showToast = (message: string, type: 'success' | 'error' | 'loading') => {
    setToast({ message, type, show: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  const handleCoverImageUpload = async (file?: File) => {
    if (!file) return;

    setIsUploadingCoverImage(true);

    try {
      // Show local preview immediately
      const url = URL.createObjectURL(file);
      setCoverPreview(url);

      // Upload to Cloudinary
      const imageUrl = await serviceService.uploadServiceCoverImage(file);
      setCoverPreview(imageUrl);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to upload cover image';
      showToast(errorMessage, 'error');
      setCoverPreview(null);
    } finally {
      setIsUploadingCoverImage(false);
    }
  };

  const handleCoverDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleCoverImageUpload(file);
  };

  const handleBannerImageUpload = async (file?: File) => {
    if (!file) return;

    setIsUploadingBannerImage(true);

    try {
      // Show local preview immediately
      const url = URL.createObjectURL(file);
      setBannerPreview(url);

      // Upload to Cloudinary
      const imageUrl = await serviceService.uploadServiceBannerImage(file);
      setBannerPreview(imageUrl);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to upload banner image';
      showToast(errorMessage, 'error');
      setBannerPreview(null);
    } finally {
      setIsUploadingBannerImage(false);
    }
  };

  const handleBannerDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleBannerImageUpload(file);
  };

  const handleAddCondition = () => {
    const v = conditionInput.trim();
    if (!v) return;
    if (!conditions.includes(v)) setConditions(prev => [...prev, v]);
    setConditionInput('');
  };
  const handleRemoveCondition = (condition: string) => setConditions(prev => prev.filter(c => c !== condition));

  const handleAddTest = () => {
    const v = testInput.trim();
    if (!v) return;
    if (!tests.includes(v)) setTests(prev => [...prev, v]);
    setTestInput('');
  };
  const handleRemoveTest = (test: string) => setTests(prev => prev.filter(t => t !== test));

  const handleAddTreatment = () => {
    const v = treatmentInput.trim();
    if (!v) return;
    if (!treatments.includes(v)) setTreatments(prev => [...prev, v]);
    setTreatmentInput('');
  };
  const handleRemoveTreatment = (treatment: string) => setTreatments(prev => prev.filter(t => t !== treatment));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!form.title) {
      showToast('Service name is required', 'error');
      return;
    }
    if (!coverPreview) {
      showToast('Cover image is required', 'error');
      return;
    }
    if (!bannerPreview) {
      showToast('Banner image is required', 'error');
      return;
    }

    try {
      showToast(mode === 'edit' ? 'Updating service...' : 'Creating service...', 'loading');

      // Build the payload matching API structure
      const payload = {
        snippet: {
          service_name: form.title,
          service_description: form.shortDescription || '',
          cover_image_url: coverPreview,
        },
        page: {
          banner_image_url: bannerPreview,
          service_overview: form.overview || '',
          video_url: form.videoLink || '',
          conditions_we_treat: conditions,
          test_and_diagnostics: tests,
          treatments_and_procedures: treatments,
        },
      };

      // Make API call
      if (mode === 'edit' && initialData?.serviceId) {
        // Update existing service
        await serviceService.updateService(initialData.serviceId, payload);
      } else {
        // Create new service
        await serviceService.createService(payload);
      }

      showToast(mode === 'edit' ? 'Service updated successfully! ✅' : 'Service created successfully! ✅', 'success');
      
      onSave({
        ...form,
        image: coverPreview,
        bannerImage: bannerPreview,
        conditions,
        tests,
        treatments,
        serviceId: initialData?.serviceId,
      });

      // Keep toast visible during timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Then navigate back to services
      navigate('/services', { replace: true });
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to save service';
      showToast(errorMessage, 'error');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="">
        <a href="/services" className="inline-flex items-center text-[#0C2141] text-sm lg:text-[16px] font-medium mb-4 gap-[4px]">
          <img src="/icon/right.svg" alt="" /> Back to Services Page
        </a>

        <div className="bg-white rounded-xl border border-[#B9B9B9] overflow-hidden">
          <div className="px-[16px] lg:px-[30px] py-[14px] lg:py-[20px] border-b border-[#0000001A]">
            <h1 className="text-lg lg:text-[20px] text-[#010101] font-medium">
              {mode === 'create' ? 'Add New Services' : 'Edit Service'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-[16px] lg:px-[40px] lg:py-[30px]">
            <div className="border rounded-[10px] border-[#0101011A] p-[16px] lg:p-6">
              <h3 className="text-[16px] font-medium mb-4 lg:mb-[25px]">Service Snippet</h3>

              {/* Grid: inputs + image */}
              <div className="grid grid-cols-1 gap-6">
                {/* Left: form fields */}
                <div className="lg:col-span-2">
                  <div className="mb-[14px] lg:mb-[20px]">
                    <label className="block text-sm text-[#010101] mb-2">Service Name</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Name of the Service"
                      className="w-full rounded-md border border-[#01010133] lg:leading-[24px] px-3 py-[8px] text-sm focus:outline-none"
                    />
                  </div>

                  <div className='mb-[14px] lg:mb-[20px]'>
                    <label className="block text-sm text-[#010101] mb-2">Service Short Description</label>
                    <textarea
                      value={form.shortDescription}
                      onChange={(e) => setForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                      placeholder="Writeup about the Service"
                      rows={5}
                      className="w-full rounded-md border border-[#01010133] lg:leading-[24px] px-3 py-[8px] text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              {/* cover image upload */}
                <div className="lg:col-span-1">
                  <label className="block text-sm text-[#010101] mb-2">Add Cover Image</label>

                  <div
                    onDrop={handleCoverDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => !isUploadingCoverImage && fileRef.current?.click()}
                    className={`w-full h-[150px] lg:h-[200px] rounded-md border border-[#01010133] bg-[#F2F2F2] flex items-center justify-center text-center p-4 ${!isUploadingCoverImage ? 'cursor-pointer' : 'opacity-50'}`}
                  >
                    {isUploadingCoverImage ? (
                      <div className="text-sm">
                        <div className="animate-spin inline-block w-5 h-5 border-4 border-gray-300 border-t-blue-500 rounded-full mb-2"></div>
                        <p>Uploading...</p>
                      </div>
                    ) : coverPreview ? (
                      <img src={coverPreview} alt="cover" className="h-full w-full object-cover" />
                    ) : (
                      <div>
                        <img src="/icon/upload.svg" alt="upload" className="mx-auto mb-2" />
                        <div className="text-sm">
                          Choose Images to <span className="text-green-600">Upload</span> or Drag and drop or <span className="text-green-600">click</span> to browse your image
                        </div>
                        <div className="text-xs text-[#010101CC] mt-1">JPG or PNG Supported format. Max file size is 3mb</div>
                      </div>
                    )}

                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleCoverImageUpload(e.target.files?.[0])}
                      disabled={isUploadingCoverImage}
                    />
                  </div>
                </div>
            </div>

            {/* Service Details Section */}
            <div className="mt-8 border rounded-[10px] border-[#0101011A] p-[16px] lg:p-6">
              <h3 className="text-[16px] font-medium mb-4 lg:mb-[25px]">Service Page</h3>

              <div className="lg:col-span-1 mb-[14px] lg:mb-[20px]">
                  <label className="block text-sm text-[#010101] mb-2">Add Banner Image</label>

                  <div
                    onDrop={handleBannerDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => !isUploadingBannerImage && bannerFileRef.current?.click()}
                    className={`w-full h-[150px] lg:h-[200px] rounded-md border border-[#01010133] bg-[#F2F2F2] flex items-center justify-center text-center p-4 ${!isUploadingBannerImage ? 'cursor-pointer' : 'opacity-50'}`}
                  >
                    {isUploadingBannerImage ? (
                      <div className="text-sm">
                        <div className="animate-spin inline-block w-5 h-5 border-4 border-gray-300 border-t-blue-500 rounded-full mb-2"></div>
                        <p>Uploading...</p>
                      </div>
                    ) : bannerPreview ? (
                      <img src={bannerPreview} alt="banner" className="h-full w-full object-cover" />
                    ) : (
                      <div>
                        <img src="/icon/upload.svg" alt="upload" className="mx-auto mb-2" />
                        <div className="text-sm">
                          Choose Images to <span className="text-green-600">Upload</span> or Drag and drop or <span className="text-green-600">click</span> to browse your image
                        </div>
                        <div className="text-xs text-[#010101CC] mt-1">JPG or PNG Supported format. Max file size is 3mb</div>
                      </div>
                    )}

                    <input
                      ref={bannerFileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleBannerImageUpload(e.target.files?.[0])}
                      disabled={isUploadingBannerImage}
                    />
                  </div>
                </div>

              {/* Service Overview */}
              <div className="mb-[14px] lg:mb-[20px]">
                <label className="block text-sm text-[#010101] mb-2">Service Overview</label>
                <textarea
                  value={form.overview}
                  onChange={(e) => setForm(prev => ({ ...prev, overview: e.target.value }))}
                  placeholder="Write a detailed overview of the service"
                  rows={4}
                  className="w-full rounded-md border border-[#01010133] lg:leading-[24px] px-3 py-[8px] text-sm focus:outline-none"
                />
              </div>

              {/* Video Link */}
              <div className="mb-[14px] lg:mb-[20px]">
                <label className="block text-sm text-[#010101] mb-2">Add Video Link</label>
                <input
                  value={form.videoLink}
                  onChange={(e) => setForm(prev => ({ ...prev, videoLink: e.target.value }))}
                  placeholder="Type here"
                  className="w-full rounded-md border border-[#01010133] lg:leading-[24px] px-3 py-[8px] text-sm focus:outline-none"
                />
              </div>

              {/* Doctors
              <div className="mb-[14px] lg:mb-[20px]">
                <label className="block text-sm text-[#010101] mb-2">Doctors</label>
                <div className="flex gap-2">
                  <input
                    value={doctorInput}
                    onChange={(e) => setDoctorInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddDoctor(); } }}
                    placeholder="Add doctors for this service"
                    className="w-full rounded-md border border-[#01010133] px-3 py-[8px] text-sm focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {doctors.map(doctor => (
                    <span key={doctor} className="inline-flex items-center gap-2 border border-[#0C2141] rounded-full px-3 py-1 text-sm">
                      {doctor}
                      <button type="button" onClick={() => handleRemoveDoctor(doctor)} className="text-[#01010180]">
                        <img src="/icon/cancel.svg" alt="" />
                      </button>
                    </span>
                  ))}
                </div>
              </div> */}

              {/* Conditions */}
              <div className="mb-[14px] lg:mb-[20px]">
                <label className="block text-sm text-[#010101] mb-2">Conditions We Treat</label>
                <input
                  value={conditionInput}
                  onChange={(e) => setConditionInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCondition(); } }}
                  placeholder="Add conditions treated"
                  className="w-full rounded-md border border-[#01010133] lg:leading-[24px] px-3 py-[8px] text-sm focus:outline-none"
                />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {conditions.map(condition => (
                    <span key={condition} className="inline-flex items-center gap-2 border border-[#0C2141] rounded-full px-3 py-1 lg:py-[4px] text-[14px] text-[#010101CC]">
                      {condition}
                      <button type="button" onClick={() => handleRemoveCondition(condition)} className="text-[#01010180]">
                        <img src="/icon/cancel.svg" alt="" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tests & Diagnostics */}
              <div className="mb-[14px] lg:mb-[20px]">
                <label className="block text-sm text-[#010101] mb-2">Test & Diagnostics</label>
                <input
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTest(); } }}
                  placeholder="Add tests and diagnostics"
                  className="w-full rounded-md border border-[#01010133] lg:leading-[24px] px-3 py-[8px] text-sm focus:outline-none"
                />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {tests.map(test => (
                    <span key={test} className="inline-flex items-center gap-2 border border-[#0C2141] rounded-full px-3 py-1 lg:py-[4px] text-[14px] text-[#010101CC]">
                      {test}
                      <button type="button" onClick={() => handleRemoveTest(test)} className="text-[#01010180]">
                        <img src="/icon/cancel.svg" alt="" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Treatment & Procedures */}
              <div className="mb-[14px] lg:mb-[20px]">
                <label className="block text-sm text-[#010101] mb-2">Treatment & Procedures</label>
                <input
                  value={treatmentInput}
                  onChange={(e) => setTreatmentInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTreatment(); } }}
                  placeholder="Add treatments and procedures"
                  className="w-full rounded-md border border-[#01010133] lg:leading-[24px] px-3 py-[8px] text-sm focus:outline-none"
                />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {treatments.map(treatment => (
                    <span key={treatment} className="inline-flex items-center gap-2 border border-[#0C2141] rounded-full px-3 py-1 lg:py-[4px] text-[14px] text-[#010101CC]">
                      {treatment}
                      <button type="button" onClick={() => handleRemoveTreatment(treatment)} className="text-[#01010180]">
                        <img src="/icon/cancel.svg" alt="" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Error Message Display */}
            {toast.show && (
              <Toast 
                message={toast.message} 
                type={toast.type} 
                show={toast.show} 
                onHide={hideToast}
              />
            )}

            <div className="mt-6 flex flex-col lg:flex-row justify-end gap-3">
              <button type="button" onClick={() => navigate('/services')} className="px-[50px] py-[12px] rounded-[48px] border border-[#0C2141] text-sm" disabled={isUploadingCoverImage || isUploadingBannerImage}>
                Cancel
              </button>
              <button type="submit" className="px-[40px] py-[12px] rounded-[48px] bg-[#0C2141] text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled={isUploadingCoverImage || isUploadingBannerImage}>
                {isUploadingCoverImage || isUploadingBannerImage ? 'Uploading...' : mode === 'create' ? 'Create Service' : 'Update changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
