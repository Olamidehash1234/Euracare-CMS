import { useState, useEffect } from 'react';
import Header from '../../components/commonComponents/Header';
import SearchBar from '../../components/commonComponents/SearchBar';
import NotFound from '../../components/commonComponents/NotFound';
import DoctorsTable from '../../components/Doctors/DoctorsTable';
import type { Doctor } from '../../components/Doctors/DoctorsTable';
import DoctorForm from './CreateDoctorForm';
import type { NewDoctorPayload } from './CreateDoctorForm';
import { doctorService } from '@/services';

const DoctorsPage = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const [editDoctor, setEditDoctor] = useState<NewDoctorPayload | null>(null);

    // Fetch doctors on mount
    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await doctorService.getAllDoctors();
            console.log('[DoctorsPage] Raw API response:', response);
            
            // Handle different response structures
            let doctorsData = [];
            
            // API returns: response.data.data.doctor
            if (response?.data?.data?.doctor && Array.isArray(response.data.data.doctor)) {
                doctorsData = response.data.data.doctor;
            } else if (response?.data?.data && Array.isArray(response.data.data)) {
                doctorsData = response.data.data;
            } else if (response?.data && Array.isArray(response.data)) {
                doctorsData = response.data;
            } else if (Array.isArray(response)) {
                doctorsData = response;
            }

            console.log('[DoctorsPage] Parsed doctors data:', doctorsData);
            
            if (!Array.isArray(doctorsData)) {
                throw new Error('Invalid response format: expected array of doctors');
            }
            
            // Transform API response to match Doctor interface
            const transformedDoctors: Doctor[] = doctorsData.map((doc: any) => ({
                id: doc.id,
                name: doc.full_name,
                avatar: doc.profile_picture_url,
                createdAt: doc.createdAt || new Date().toISOString(),
                email: doc.email,
                specialties: doc.programs_and_specialty || [],
            }));

            setDoctors(transformedDoctors);
            console.log('[DoctorsPage] Doctors loaded:', transformedDoctors);
        } catch (err) {
            console.error('[DoctorsPage] Error fetching doctors:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to load doctors';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // const handleSearch = (q: string) => {
    //     console.log('search:', q);
    // };

    const handleAdd = () => {
        setShowCreate(true);
    };

    const handleView = (d: Doctor) => {
        console.log('view doctor', d);
    };

    const handleEditDoctor = async (doctor: Doctor) => {
        try {
            console.log('[DoctorsPage] Attempting to fetch full doctor data for ID:', doctor.id);
            
            // Fetch full doctor data by ID
            const response = await doctorService.getDoctorById(doctor.id.toString());
            // Extract doctor from nested response structure: response.data.data.doctor
            const fullDoctor = response.data?.data?.doctor;
            
            if (fullDoctor) {
                console.log('[DoctorsPage] Full doctor data loaded:', fullDoctor);
                setEditDoctor({
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
                });
            }
        } catch (err) {
            console.error('[DoctorsPage] Error fetching doctor details:', err);
            setError('Failed to load doctor details for editing');
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
                        onSave={(payload) => {
                            console.log(editDoctor ? 'update' : 'save', payload);
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
            <Header title="Doctors" />
            <div className="p-[16px] lg:p-[40px]">
                <div className="bg-white rounded-[14px] p-6 lg:px-[20px] lg:py-[23px] shadow-sm border border-gray-200">
                    <div className="flex items-center flex-col lg:flex-row gap-[20px] justify-between mb-[22px]">
                        <button onClick={handleAdd} className="flex items-center order-1 lg:order-2 ml-auto lg:ml-0 lg:w-auto gap-2 px-6 py-[9px] lg:py-[13px] lg:px-[20px] rounded-full bg-[#0C2141] text-white text-sm font-medium">
                            <span className="text-lg">+</span> Add New Doctor
                        </button>

                        <div className="flex items-center w-full lg:w-1/2 order-2 lg:order-1">
                            <SearchBar placeholder="Search for a doctor" />
                        </div>
                    </div>

                    {hasDoctors ? (
                        <DoctorsTable 
                            doctors={doctors} 
                            onView={handleView}
                            onEdit={handleEditDoctor}
                            onDelete={(doctor) => {
                                console.log('delete doctor', doctor);
                                // Implement delete logic here
                            }}
                        />
                    ) : isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="w-12 h-12 border-4 border-[#0C2141] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-[#666]">Loading doctors...</p>
                            </div>
                        </div>
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
