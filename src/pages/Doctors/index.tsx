import { useState, useEffect } from 'react';
import Header from '../../components/commonComponents/Header';
import SearchBar from '../../components/commonComponents/SearchBar';
import NotFound from '../../components/commonComponents/NotFound';
import DoctorsTable from '../../components/Doctors/DoctorsTable';
import type { Doctor } from '../../components/Doctors/DoctorsTable';
import DoctorForm from './CreateDoctorForm';
import type { NewDoctorPayload } from './CreateDoctorForm';
import Toast from '../../components/GlobalComponents/Toast';
import { doctorService } from '@/services';
import LoadingSpinner from '../../components/commonComponents/LoadingSpinner';

const DoctorsPage = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [showCreate, setShowCreate] = useState(false);
    const [editDoctor, setEditDoctor] = useState<NewDoctorPayload | null>(null);
    
    const [isFetchingDoctorData, setIsFetchingDoctorData] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error' | 'loading'>('success');
    const [showToast, setShowToast] = useState(false);

    // Fetch doctors on mount
    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await doctorService.getAllDoctors();
            
            // API returns: response.data.data.doctor as DoctorResponse[]
            const doctorsData = response?.data?.data?.doctor || [];
            
            if (!Array.isArray(doctorsData)) {
                throw new Error('Invalid response format: expected array of doctors');
            }
            
            // Transform API response to match Doctor interface
            const transformedDoctors: Doctor[] = doctorsData.map((doc: any) => ({
                id: doc.id,
                name: doc.full_name,
                avatar: doc.profile_picture_url,
                createdAt: doc.created_at || doc.createdAt || new Date().toISOString(),
                email: doc.email,
                specialties: doc.programs_and_specialty || [],
            }));

            setDoctors(transformedDoctors);
        } catch (err: any) {
            let errorMessage = 'Failed to load doctors';

            if (err.response?.status === 403) {
                errorMessage = 'You do not have permission to perform this action';
            } else if (err.response?.status === 401) {
                errorMessage = 'Your session has expired. Please log in again.';
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };



    const getFilteredDoctors = () => {
        if (!searchTerm.trim()) {
            return doctors;
        }
        
        const lowercaseSearch = searchTerm.toLowerCase();
        return doctors.filter(doctor => 
            doctor.name?.toLowerCase().includes(lowercaseSearch) ||
            doctor.email?.toLowerCase().includes(lowercaseSearch) ||
            doctor.specialties?.some(specialty => 
                specialty?.toLowerCase().includes(lowercaseSearch)
            )
        );
    };

    const handleAdd = () => {
        setShowCreate(true);
    };



    const handleEditDoctor = async (doctor: Doctor) => {
        try {
            setIsFetchingDoctorData(true);
            setToastMessage('Loading doctor details...');
            setToastType('loading');
            setShowToast(true);
            
            // Fetch full doctor data by ID
            const response = await doctorService.getDoctorById(doctor.id.toString());
            // Extract doctor from nested response structure or direct data
            const fullDoctor = (response.data?.data as any)?.doctor || response.data?.data;
            
            if (fullDoctor) {
                const editData: NewDoctorPayload = {
                    fullName: fullDoctor.full_name,
                    email: fullDoctor.email || '',
                    phone: fullDoctor.phone || '',
                    languages: fullDoctor.language || '',
                    regNumber: fullDoctor.reg_number || '',
                    yearsExperience: fullDoctor.years_of_experince || '',
                    bio: fullDoctor.bio || '',
                    avatar: fullDoctor.profile_picture_url,
                    programs: fullDoctor.programs_and_specialty || [],
                    researchInterests: fullDoctor.research_interest || [],
                    qualifications: fullDoctor.qualification || [],
                    trainings: fullDoctor.training_and_education || [],
                    associations: Array.isArray(fullDoctor.professional_association) 
                        ? fullDoctor.professional_association 
                        : (fullDoctor.professional_association ? [fullDoctor.professional_association] : []),
                    certifications: fullDoctor.certification || [],
                    doctorId: doctor.id.toString()
                };
            setEditDoctor(editData);
            setShowCreate(true);
            setShowToast(false);
            }
        } catch (err: any) {
            let errorMessage = 'Failed to load doctor details for editing';

            if (err.response?.status === 403) {
                errorMessage = 'You do not have permission to perform this action';
            } else if (err.response?.status === 401) {
                errorMessage = 'Your session has expired. Please log in again.';
            }

            setError(errorMessage);
            setToastMessage(errorMessage);
            setToastType('error');
            setShowToast(true);
        } finally {
            setIsFetchingDoctorData(false);
        }
    };

    const handleDeleteDoctor = async (doctor: Doctor) => {
        try {
            setToastMessage('Deleting doctor...');
            setToastType('loading');
            setShowToast(true);
            
            await doctorService.deleteDoctor(doctor.id.toString());
            
            // Remove the deleted doctor from the list
            setDoctors(doctors.filter(d => d.id !== doctor.id));
            
            // Show success toast
            setToastMessage('Doctor deleted successfully!  ');
            setToastType('success');
            setShowToast(true);
        } catch (err: any) {
            let errorMessage = 'Failed to delete doctor';

            if (err.response?.status === 403) {
                errorMessage = 'You do not have permission to perform this action';
            } else if (err.response?.status === 401) {
                errorMessage = 'Your session has expired. Please log in again.';
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            setToastMessage(errorMessage);
            setToastType('error');
            setShowToast(true);
        }
    };

    const hasDoctors = doctors.length > 0;

    if (showCreate || editDoctor) {
        return (
            <section>
                <Header title="Doctors" />
                <div className="p-[16px] lg:p-[40px]">
                    <DoctorForm
                        mode={editDoctor ? 'edit' : 'create'}
                        initialData={editDoctor || undefined}
                        isLoadingData={isFetchingDoctorData}
                        onSave={() => {
                            setShowCreate(false);
                            setEditDoctor(null);
                            // Refetch doctors after save
                            fetchDoctors();
                        }}
                        onClose={() => {
                            setShowCreate(false);
                            setEditDoctor(null);
                        }}
                    />
                </div>
            </section>
        );
    }

    return (
        <section>
            <Toast
                message={toastMessage}
                type={toastType}
                show={showToast}
                onHide={() => setShowToast(false)}
            />
            <Header title="Doctors" />
            <div className="p-[16px] lg:p-[40px]">
                <div className="bg-white rounded-[14px] p-6 lg:px-[20px] lg:py-[23px] shadow-sm border border-gray-200">
                    <div className="flex items-center flex-col lg:flex-row gap-[20px] justify-between mb-[22px]">
                        <button onClick={handleAdd} className="flex items-center order-1 lg:order-2 ml-auto lg:ml-0 lg:w-auto gap-2 px-6 py-[9px] lg:py-[13px] lg:px-[20px] rounded-full bg-[#0C2141] text-white text-sm font-medium">
                            <span className="text-lg">+</span> Add New Doctor
                        </button>

                        <div className="flex items-center w-full lg:w-1/2 order-2 lg:order-1">
                            <SearchBar 
                                placeholder="Search for a doctor" 
                                value={searchTerm}
                                onSearch={setSearchTerm}
                            />
                        </div>
                    </div>

                    {hasDoctors ? (
                        <DoctorsTable 
                            doctors={getFilteredDoctors()} 
                            // onView={handleView}
                            onEdit={handleEditDoctor}
                            onDelete={handleDeleteDoctor}
                        />
                    ) : isLoading ? (
                        <LoadingSpinner heightClass="py-[200px]" />
                    ) : error ? (
                        <NotFound
                            title="Error Loading Doctors"
                            description={error}
                            imageSrc="/not-found.png"
                            ctaText="Try Again"
                            onCta={fetchDoctors}
                        />
                    ) : (
                        <NotFound
                            title="No Doctors Yet"
                            description={`It looks like you haven't added any doctors yet. Once Added, they'll appear here for you to manage.`}
                            imageSrc="/not-found.png"
                            ctaText="Add New Doctor"
                            onCta={handleAdd}
                        />
                    )}
                </div>
            </div>
        </section>
    );
};

export default DoctorsPage;
