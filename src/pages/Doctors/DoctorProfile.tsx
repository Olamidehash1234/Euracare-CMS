import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Doctor } from '../../components/Doctors/DoctorsTable';
import Header from '../../components/commonComponents/Header';
import LoadingSpinner from '../../components/commonComponents/LoadingSpinner';
import NotFound from '../../components/commonComponents/NotFound';
import { doctorService } from '@/services';

const DoctorProfile = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState<(Doctor & {
        regNumber: string;
        experience: string;
        languages: string[];
        researchInterests: string[];
        qualifications: string[];
        trainings: string[];
        associations: string[];
        certifications: string[];
        bio: string;
        phone: string;
    }) | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError('Doctor ID is required');
            return;
        }

        const fetchDoctorData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                console.log('[DoctorProfile] Fetching doctor profile for id:', id);
                const response = await doctorService.getDoctorById(id);
                const doctorData = response.data?.data?.doctor;

                if (!doctorData) {
                    throw new Error('Doctor data not found');
                }

                console.log('[DoctorProfile] Doctor data loaded:', doctorData);

                // Transform API response to component format
                const transformedDoctor = {
                    id: doctorData.id,
                    name: doctorData.full_name,
                    avatar: doctorData.profile_picture_url || '/placeholder-image.png',
                    email: doctorData.email,
                    phone: doctorData.phone || '',
                    createdAt: doctorData.createdAt,
                    specialties: doctorData.programs_and_specialty || [],
                    regNumber: doctorData.reg_number || '',
                    experience: doctorData.years_of_experince || '',
                    languages: Array.isArray(doctorData.language)
                        ? doctorData.language
                        : (doctorData.language ? [doctorData.language] : []),
                    researchInterests: doctorData.research_interest || [],
                    qualifications: doctorData.qualification || [],
                    trainings: doctorData.training_and_education || [],
                    associations: Array.isArray(doctorData.professional_association)
                        ? doctorData.professional_association
                        : (doctorData.professional_association ? [doctorData.professional_association] : []),
                    certifications: doctorData.certification || [],
                    bio: doctorData.bio || '',
                };

                setDoctor(transformedDoctor);
            } catch (err) {
                console.error('[DoctorProfile] Error fetching doctor:', err);
                const errorMessage = err instanceof Error ? err.message : 'Failed to load doctor profile';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDoctorData();
    }, [id]);

    return (
        <section>
            <Header title="Doctors" />
            <div className="p-[16px] lg:p-[40px]">
                <Link to="/doctors" className="inline-flex items-center text-[#0C2141] text-sm lg:text-[16px] font-medium mb-4 lg:mb-[30px] lg:leading-[140%] gap-[4px]">
                    <img src="/icon/right.svg" alt="" /> Back to Doctor's Page
                </Link>

                {isLoading && <LoadingSpinner />}

                {error && (
                    <NotFound
                        title="Error Loading Doctor Profile"
                        description={error}
                        imageSrc="/not-found.png"
                        ctaText="Back to Doctors"
                        onCta={() => window.location.href = '/doctors'}
                    />
                )}

                {doctor && (
                <div className="bg-white rounded-[14px] overflow-hidden border border-[#0101011A]">
                    <div className="px-6 lg:px-[30px] py-5 lg:py-[20px] border-b border-[#0000001A]">
                        <h1 className="text-lg lg:text-[20px] text-[#010101] font-medium">Doctor's Profile</h1>
                    </div>

                    <div className="p-6 lg:p-[30px]">
                        {/* Header section with image and basic info */}
                        <div className="flex flex-col md:flex-row gap-6 items-center mb-8">
                            <div className="w-[200px] h-[200px] rounded-full overflow-hidden flex-shrink-0">
                                <img src={doctor.avatar} alt={doctor.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-[24px] font-medium text-[#010101] mb-2 lg:mb-[20px]">{doctor.name}</h2>
                                        <p className="text-[16px] text-[#010101] mb-4 lg:mb-[20px]">Consulting Vascular and Interventional Radiologist</p>
                                    </div>
                                    {doctor.regNumber && (
                                        <div className="inline-flex items-center gap-2 px-4 lg:px-[12px] lg:leading-[24px] py-1 border border-[#0C2141] rounded-[20px] text-[14px]">
                                            <span>Reg. Number:</span>
                                            <span>{doctor.regNumber}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-6 lg:gap-[20px] mt-4">
                                    {doctor.experience && (
                                        <div className="flex items-center bg-[#FFF1E0] text-[#0C2141] py-[8px] px-[16px] font-medium tracking-[-0.42px] rounded-[8px] gap-[8px]">
                                            <img src="/icon/wire.svg" alt="" />
                                            <span className="text-sm">{doctor.experience} years of experience</span>
                                        </div>
                                    )}
                                    {doctor.email && (
                                        <div className="flex items-center bg-[#FFF1E0] text-[#0C2141] py-[8px] px-[16px] font-medium tracking-[-0.42px] rounded-[8px] gap-[8px]">
                                            <img src="/icon/wire.svg" alt="" />
                                            <span className="text-sm">{doctor.email}</span>
                                        </div>
                                    )}
                                    {doctor.phone && (
                                        <div className="flex items-center bg-[#FFF1E0] text-[#0C2141] py-[8px] px-[16px] font-medium tracking-[-0.42px] rounded-[8px] gap-[8px]">
                                            <img src="/icon/wire.svg" alt="" />
                                            <span className="text-sm">{doctor.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='border border-[#0101011A] divide-y rounded-[10px] px-[20px] py-[40px]'>
                            {/* Bio section */}
                            {doctor.bio && (
                                <div className="mb-8 lg:mb-[40px]">
                                    <h3 className="text-[16px] font-medium mb-2">Bio</h3>
                                    <p className="text-sm leading-[24px] text-[#010101]">{doctor.bio}</p>
                                </div>
                            )}

                            {/* Languages */}
                            {doctor.languages && doctor.languages.length > 0 && (
                                <div className="flex lg:flex-row mb-8 lg:mb-[40px] gap-[60px] pt-8 lg:pt-[40px]">
                                    <h3 className="text-[16px] font-medium mb-2 lg:w-[136px]">Language(s):</h3>
                                    <div className="flex flex-wrap gap-[12px]">
                                        {doctor.languages.map(lang => (
                                            <span key={lang} className="inline-flex lg:leading-[24px] items-center gap-2 border border-[#0C2141] rounded-full px-3 py-1 text-sm">
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Research Interests */}
                            {doctor.researchInterests && doctor.researchInterests.length > 0 && (
                                <div className="mb-8 flex lg:flex-row mb-8 lg:mb-[40px] gap-[60px] pt-8 lg:pt-[40px]">
                                    <h3 className="text-[16px] font-medium mb-2 lg:w-[136px]">Research Interest:</h3>
                                    <div className="flex flex-wrap gap-[12px]">
                                        {doctor.researchInterests.map(interest => (
                                            <span key={interest} className="inline-flex lg:leading-[24px] items-center gap-2 border border-[#0C2141] rounded-full px-3 py-1 text-sm">
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Qualifications */}
                            {doctor.qualifications && doctor.qualifications.length > 0 && (
                                <div className="mb-8 flex lg:flex-row mb-8 lg:mb-[40px] gap-[90px] pt-8 lg:pt-[40px]">
                                    <h3 className="text-[16px] font-medium mb-2 lg:w-[136px]">Qualifications:</h3>
                                    <div className="flex flex-wrap gap-x-[12px] gap-y-[14px]">
                                        {doctor.qualifications.map(qual => (
                                            <span key={qual} className="inline-flex items-center gap-2 border border-[#0C2141] rounded-full px-3 py-1 lg:leading-[24px] text-sm">
                                                {qual}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Trainings */}
                            {doctor.trainings && doctor.trainings.length > 0 && (
                                <div className="mb-8 flex lg:flex-row mb-8 lg:mb-[40px] gap-[90px] pt-8 lg:pt-[40px]">
                                    <h3 className="text-[16px] font-medium mb-2 lg:w-[136px]">Trainings:</h3>
                                    <div className="flex flex-wrap gap-x-[12px] gap-y-[14px]">
                                        {doctor.trainings.map(training => (
                                            <span key={training} className="inline-flex items-center gap-2 border border-[#0C2141] rounded-full px-3 py-1 lg:leading-[24px] text-sm">
                                                {training}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Associations */}
                            {doctor.associations && doctor.associations.length > 0 && (
                                <div className="mb-8 flex lg:flex-row mb-8 lg:mb-[40px] gap-[90px] pt-8 lg:pt-[40px]">
                                    <h3 className="text-[16px] font-medium mb-2 lg:w-[136px]">Associations:</h3>
                                    <div className="flex flex-wrap gap-x-[12px] gap-y-[14px]">
                                        {doctor.associations.map(assoc => (
                                            <span key={assoc} className="inline-flex items-center gap-2 border border-[#0C2141] rounded-full px-3 py-1 lg:leading-[24px] text-sm">
                                                {assoc}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Certifications */}
                            {doctor.certifications && doctor.certifications.length > 0 && (
                                <div className="mb-8 flex lg:flex-row mb-8 lg:mb-[40px] gap-[90px] pt-8 lg:pt-[40px]">
                                    <h3 className="text-[16px] font-medium mb-2 lg:w-[136px]">Certifications:</h3>
                                    <div className="flex flex-wrap gap-x-[12px] gap-y-[14px]">
                                        {doctor.certifications.map(cert => (
                                            <span key={cert} className="inline-flex items-center gap-2 border border-[#0C2141] rounded-full px-3 py-1 lg:leading-[24px] text-sm">
                                                {cert}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                )}
            </div>
        </section>
    );
};

export default DoctorProfile;