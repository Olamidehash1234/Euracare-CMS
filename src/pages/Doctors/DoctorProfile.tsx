import { Link, useParams } from 'react-router-dom';
import type { Doctor } from '../../components/Doctors/DoctorsTable';
import Header from '../../components/commonComponents/Header';

const DoctorProfile = () => {
    const { id } = useParams();

    // In a real app, this data would be fetched using the id
    console.log('Loading doctor profile for id:', id);
    
    const doctor: Doctor & {
        regNumber: string;
        experience: string;
        languages: string[];
        researchInterests: string[];
        qualifications: string[];
        bio: string;
        phone : string;
    } = {
        id: 1,
        name: 'Dr Hammed Ninalowo',
        avatar: '/image/doctor/test1.png',
        email: 'N.Hammed@euracare.com',
        phone: '07012345678',
        createdAt: new Date().toISOString(),
        regNumber: 'RC3456KSV',
        experience: '20 years',
        languages: ['English', 'Hausa'],
        specialties: ['Interventional Radiology', 'Oncology', 'Vascular Surgery'],
        researchInterests: ['Hypertension', 'Congenital heart disease', 'Pulmonary hypertension'],
        qualifications: [
            'Internship and residency in Internal Medicine, London UK',
            'Cardiology residency in West Midlands, UK',
            'Interventional/Structural Heart Disease Fellowship, Toronto General Hospital Canada'
        ],
        bio: 'Dr Hammed Ninalowo, is a US trained Vascular and Interventional Radiologist who completed his training at the prestigious University of Pennsylvania and is the first US trained Physician to offer the full spectrum of interventional Radiology services in Nigeria. He obtained his medical degree at the University of Illinois and graduated at the top of his class with honors(Alpha Omega Alpha). He has a passion for improving access to Minimally invasive therapies in the West African Population.'
    };

    return (
        <section>
            <Header title="Doctors" />
            <div className="p-[16px] lg:p-[40px]">
                <Link to="/doctors" className="inline-flex items-center text-[#0C2141] text-sm lg:text-[16px] font-medium mb-4 lg:mb-[30px] lg:leading-[140%] gap-[4px]">
                    <img src="/icon/right.svg" alt="" /> Back to Doctor's Page
                </Link>

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
                                    <div className="inline-flex items-center gap-2 px-4 lg:px-[12px] lg:leading-[24px] py-1 border border-[#0C2141] rounded-[20px] text-[14px]">
                                        <span>Reg. Number:</span>
                                        <span>{doctor.regNumber}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-6 lg:gap-[20px] mt-4">
                                    <div className="flex items-center bg-[#FFF1E0] text-[#0C2141] py-[8px] px-[16px] font-medium tracking-[-0.42px] rounded-[8px] gap-[8px]">
                                        <img src="/icon/wire.svg" alt="" />
                                        <span className="text-sm">{doctor.experience} of experience</span>
                                    </div>
                                    <div className="flex items-center bg-[#FFF1E0] text-[#0C2141] py-[8px] px-[16px] font-medium tracking-[-0.42px] rounded-[8px] gap-[8px]">
                                        <img src="/icon/wire.svg" alt="" />
                                        <span className="text-sm">{doctor.email}</span>
                                    </div>
                                    <div className="flex items-center bg-[#FFF1E0] text-[#0C2141] py-[8px] px-[16px] font-medium tracking-[-0.42px] rounded-[8px] gap-[8px]">
                                        <img src="/icon/wire.svg" alt="" />
                                        <span className="text-sm">{doctor.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='border border-[#0101011A] divide-y rounded-[10px] px-[20px] py-[40px]'>
                            {/* Bio section */}
                            <div className="mb-8 lg:mb-[40px]">
                                <h3 className="text-[16px] font-medium mb-2">Bio</h3>
                                <p className="text-sm leading-[24px] text-[#010101]">{doctor.bio}</p>
                            </div>

                            {/* Languages */}
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

                            {/* Research Interests */}
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

                            {/* Qualifications */}
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

                            {/* Qualifications */}
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
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DoctorProfile;