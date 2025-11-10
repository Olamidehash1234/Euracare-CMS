import { useState } from 'react';
import Header from '../../components/commonComponents/Header';
import SearchBar from '../../components/commonComponents/SearchBar';
import NotFound from '../../components/commonComponents/NotFound';
import ServicesTable from '../../components/Services/ServicesTable';
import type { ServiceType } from '../../components/Services/ServicesTable';
import CreateServiceForm from './CreateServiceForm';
import type { ServicePayload } from './CreateServiceForm';

const sampleServicesInitial: ServiceType[] = [
  {
    id: 1,
    title: 'Interventional Cardiology',
    image: '/image/services/doctor.jpg',
    publishedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Interventional Radiology',
    image: '/image/services/doctor.jpg',
    publishedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'General Surgery',
    image: '/image/services/doctor.jpg',
    publishedAt: new Date().toISOString(),
  },
];

const ServicesPage = () => {
  const [services, setServices] = useState<ServiceType[]>(sampleServicesInitial);
  const [showCreate, setShowCreate] = useState(false);
  const [editService, setEditService] = useState<ServiceType | null>(null);

  const handleView = (s: ServiceType) => {
    console.log('view service', s);
  };

  const handleEdit = (s: ServiceType) => {
    setEditService(s);
    setShowCreate(true);
  };

  const handleDelete = (s: ServiceType) => {
    setServices(prev => prev.filter(x => x.id !== s.id));
  };

  const handleSave = (payload: ServicePayload) => {
    if (editService) {
      setServices(prev => prev.map(s => s.id === editService.id ? { ...s, ...payload } : s));
    } else {
      setServices(prev => [
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
    setEditService(null);
  };

  const hasServices = services.length > 0;

  if (showCreate || editService) {
    return (
      <section>
        <Header title="Services" />
        <div className="p-[16px] lg:p-[40px]">
          <CreateServiceForm
            mode={editService ? 'edit' : 'create'}
            initialData={editService ? {
              title: editService.title,
              shortDescription: undefined,
              image: editService.image,
              publishedAt: editService.publishedAt,
            } : undefined}
            onSave={handleSave}
            onClose={() => {
              setShowCreate(false);
              setEditService(null);
            }}
          />
        </div>
      </section>
    );
  }

  return (
    <section>
      <Header title="Services" />
      <div className="p-[16px] lg:p-[40px]">
        <div className="bg-white rounded-[14px] p-6 lg:px-[20px] lg:py-[23px] shadow-sm border border-gray-200">
          <div className="flex items-center flex-col lg:flex-row gap-[20px] justify-between mb-[22px]">
            <button onClick={() => setShowCreate(true)} className="flex items-center order-1 lg:order-2 ml-auto lg:ml-0 lg:w-auto gap-2 px-6 py-[9px] lg:py-[13px] lg:px-[20px] rounded-full bg-[#0C2141] text-white text-sm font-medium">
              <span className="text-lg">+</span> Add New Service
            </button>

            <div className="flex items-center w-full lg:w-1/2 order-2 lg:order-1">
              <SearchBar placeholder="Search for a Service" />
            </div>
          </div>

          {hasServices ? (
            <ServicesTable
              services={services}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <NotFound
              title="No Service Yet"
              description={`It looks like you haven't added any services yet. Once added, they'll appear here for you to manage.`}
              imageSrc="/not-found.png"
              ctaText="Add New Service"
              onCta={() => setShowCreate(true)}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ServicesPage;
