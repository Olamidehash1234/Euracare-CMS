import { useState } from 'react';
import Header from '../../components/commonComponents/Header';
import SearchBar from '../../components/commonComponents/SearchBar';
import NotFound from '../../components/commonComponents/NotFound';
import TestimonialsTable from '../../components/Testimonials/TestimonialsTable';
import CreateTestimonialForm from './CreateTestimonialForm';
import type { TestimonialPayload } from './CreateTestimonialForm';
import type { TestimonialType } from '../../components/Testimonials/TestimonialsTable';
import Toast from '@/components/GlobalComponents/Toast';
// import LoadingSpinner from '@/components/commonComponents/LoadingSpinner';

const sampleTestimonialsInitial: TestimonialType[] = [];

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState<TestimonialType[]>(sampleTestimonialsInitial);
  const [showCreate, setShowCreate] = useState(false);
  const [editTestimonial, setEditTestimonial] = useState<TestimonialPayload | null>(null);
  // const [isLoading, setIsLoading] = useState(false);
  // const [isFetchingData, setIsFetchingData] = useState(false);
  // const [error setError] = useState<string | null>(null);
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

  // const handleView = (testimonial: TestimonialType) => {
  //   // Handle view action
  // };

  const handleEdit = (testimonial: TestimonialType) => {
    setEditTestimonial({
      title: testimonial.title,
      service: testimonial.service,
      patientName: testimonial.patientName,
      videoLink: testimonial.videoLink || '',
      testimonialId: testimonial.id.toString(),
    });
    setShowCreate(true);
  };

  const handleDelete = (testimonial: TestimonialType) => {
    // Remove the deleted testimonial from the list
    setTestimonials(testimonials.filter((t) => t.id !== testimonial.id));
    showToast('Testimonial deleted successfully', 'success');
  };

  const handleSave = (data: TestimonialPayload) => {
    if (editTestimonial) {
      // Update existing
      setTestimonials(
        testimonials.map((t) =>
          t.id === editTestimonial.testimonialId
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
      showToast('Testimonial updated successfully', 'success');
    } else {
      // Create new
      const newTestimonial: TestimonialType = {
        id: testimonials.length + 1,
        title: data.title,
        service: data.service,
        patientName: data.patientName,
        videoLink: data.videoLink,
      };
      setTestimonials([...testimonials, newTestimonial]);
      showToast('Testimonial created successfully', 'success');
    }

    setShowCreate(false);
    setEditTestimonial(null);
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
        {/* {isFetchingData && <LoadingSpinner heightClass="fixed inset-0 h-screen" />} */}
        <div className="p-[16px] lg:p-[40px]" >
          <CreateTestimonialForm
            mode={editTestimonial ? 'edit' : 'create'}
            initialData={editTestimonial || undefined}
            onSave={handleSave}
            onClose={handleCloseForm}
            // isLoading={isLoading}
            // isLoadingData={isFetchingData}
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
              <SearchBar placeholder="Search for a Testimonial" />
            </div>
          </div>

          {testimonials.length === 0 ? (
            <NotFound
              title="Nothing to see here"
              description="It looks like you haven't added any testimonials yet. Once Added, they'll appear here for you to manage."
              onCta={handleAddNew}
              ctaText="Add New"
            />
          // ) : isLoading ? (
          //   <LoadingSpinner heightClass="py-[200px]" />
          ) : (
            <TestimonialsTable
              testimonials={testimonials}
              // onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
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

export default TestimonialsPage;
