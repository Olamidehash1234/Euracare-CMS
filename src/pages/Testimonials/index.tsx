import { useState, useEffect } from 'react';
import Header from '../../components/commonComponents/Header';
import SearchBar from '../../components/commonComponents/SearchBar';
import NotFound from '../../components/commonComponents/NotFound';
import TestimonialsTable from '../../components/Testimonials/TestimonialsTable';
import CreateTestimonialForm from './CreateTestimonialForm';
import type { TestimonialPayload } from './CreateTestimonialForm';
import type { TestimonialType } from '../../components/Testimonials/TestimonialsTable';
import Toast from '@/components/GlobalComponents/Toast';
import LoadingSpinner from '@/components/commonComponents/LoadingSpinner';
import { testimonialService, getErrorMessage } from '@/services';

const sampleTestimonialsInitial: TestimonialType[] = [];

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState<TestimonialType[]>(sampleTestimonialsInitial);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showCreate, setShowCreate] = useState(false);
  const [editTestimonial, setEditTestimonial] = useState<TestimonialPayload | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'loading'; show: boolean }>({
    message: '',
    type: 'success',
    show: false,
  });

  // Fetch testimonials on mount
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await testimonialService.getAllTestimonials();
      const testimonialsData = response?.data?.data?.testimonials || [];

      if (!Array.isArray(testimonialsData)) {
        throw new Error('Invalid response format: expected array of testimonials');
      }

      // Transform API response to match TestimonialType interface
      const transformedTestimonials: TestimonialType[] = testimonialsData.map((testimonial: any) => ({
        id: testimonial.id,
        title: testimonial.title || '',
        service: testimonial.service || '',
        patientName: testimonial.patient_name || '',
        videoLink: testimonial.video_url || '',
      }));

      setTestimonials(transformedTestimonials);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'loading') => {
    setToast({ message, type, show: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  const handleEdit = async (testimonial: TestimonialType) => {
    try {
      setIsFetchingData(true);
      showToast('Loading testimonial details...', 'loading');
      const testimonialId = testimonial.id.toString();

      // Fetch full testimonial data by ID
      const response = await testimonialService.getTestimonialById(testimonialId);

      // The actual testimonial is nested under data.data.testimonial
      const fullTestimonial = response.data?.data?.testimonial;

      if (fullTestimonial) {
        const editData: TestimonialPayload = {
          title: fullTestimonial.title || '',
          service: fullTestimonial.service || '',
          patientName: fullTestimonial.patient_name || '',
          videoLink: fullTestimonial.video_url || '',
          testimonialId: fullTestimonial.id,
        };
        setEditTestimonial(editData);
        setShowCreate(true);
        setIsFetchingData(false);
      } else {
        setIsFetchingData(false);
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      showToast(errorMessage, 'error');
      setIsFetchingData(false);
    }
  };

  const getFilteredTestimonials = () => {
    if (!searchTerm.trim()) {
      return testimonials;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    return testimonials.filter(testimonial =>
      testimonial.title?.toLowerCase().includes(lowercaseSearch) ||
      testimonial.service?.toLowerCase().includes(lowercaseSearch) ||
      testimonial.patientName?.toLowerCase().includes(lowercaseSearch)
    );
  };

  const handleDelete = async (testimonial: TestimonialType) => {
    try {
      showToast('Deleting testimonial...', 'loading');
      await testimonialService.deleteTestimonial(testimonial.id.toString());
      
      // Remove the deleted testimonial from the list
      setTestimonials(testimonials.filter((t) => t.id !== testimonial.id));
      showToast('Testimonial deleted successfully ✅', 'success');
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      showToast(errorMessage, 'error');
    }
  };

  const handleSave = async (data: TestimonialPayload) => {
    try {
      // Map the form data to match TestimonialType interface
      if (editTestimonial && data.testimonialId) {
        // Update existing
        setTestimonials(
          testimonials.map((t) =>
            t.id === data.testimonialId
              ? {
                  id: t.id,
                  title: data.title,
                  service: data.service,
                  patientName: data.patientName,
                  videoLink: data.videoLink,
                }
              : t
          )
        );
      } else {
        // Create new
        const newTestimonial: TestimonialType = {
          id: testimonials.length + 1,
          title: data.title,
          service: data.service,
          patientName: data.patientName,
          videoLink: data.videoLink,
        };
        setTestimonials([newTestimonial, ...testimonials]);
      }

      setShowCreate(false);
      setEditTestimonial(null);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      showToast(errorMessage, 'error');
    }
  };

  const handleCloseForm = () => {
    setShowCreate(false);
    setEditTestimonial(null);
  };

  const handleAddNew = () => {
    setEditTestimonial(null);
    setShowCreate(true);
  };

  if (showCreate) {
    return (
      <section>
        <Header title="Testimonials" />
        {isFetchingData && <LoadingSpinner heightClass="fixed inset-0 h-screen" />}
        <div className="p-[16px] lg:p-[40px]" >
          <CreateTestimonialForm
            mode={editTestimonial ? 'edit' : 'create'}
            initialData={editTestimonial || undefined}
            onSave={handleSave}
            onClose={handleCloseForm}
            isLoadingData={isFetchingData}
            testimonialId={editTestimonial?.testimonialId}
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
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onHide={hideToast}
      />
      <Header title="Testimonials" />
      <div className="p-[16px] lg:p-[40px]">
        <div className="bg-white rounded-[14px] p-6 lg:px-[20px] lg:py-[23px] shadow-sm border border-gray-200">
          <div className="flex items-center flex-col lg:flex-row gap-[20px] justify-between mb-[22px]">
            <button
              onClick={handleAddNew}
              className="flex items-center order-1 lg:order-2 ml-auto lg:ml-0 lg:w-auto gap-2 px-6 py-[9px] lg:py-[13px] lg:px-[20px] rounded-full bg-[#0C2141] text-white text-sm font-medium"
            >
              <span className="text-lg">+</span> Add New Testimonial
            </button>

            <div className="flex items-center w-full lg:w-1/2 order-2 lg:order-1">
              <SearchBar 
                placeholder="Search for a Testimonial"
                value={searchTerm}
                onSearch={setSearchTerm}
              />
            </div>
          </div>

          {testimonials.length > 0 ? (
            <TestimonialsTable
              testimonials={getFilteredTestimonials()}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : isLoading ? (
            <LoadingSpinner heightClass="py-[200px]" />
          ) : error ? (
            <NotFound
              title="Error Loading Testimonials"
              description={error}
              imageSrc="/not-found.png"
              ctaText="Try Again"
              onCta={fetchTestimonials}
            />
          ) : (
            <NotFound
              title="Nothing to see here..Yet"
              description="It looks like you haven't created any testimonials yet. Once Added, they'll appear here for you to manage."
              onCta={handleAddNew}
              ctaText="Add New Testimonial"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsPage;
