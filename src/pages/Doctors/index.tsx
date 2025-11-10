import { useState } from 'react';
import Header from '../../components/commonComponents/Header';
import SearchBar from '../../components/commonComponents/SearchBar';
import NotFound from '../../components/commonComponents/NotFound';
import DoctorsTable from '../../components/Doctors/DoctorsTable';
import type { Doctor } from '../../components/Doctors/DoctorsTable';
import DoctorForm from './CreateDoctorForm';
import type { NewDoctorPayload } from './CreateDoctorForm';

const sampleDoctors: Doctor[] = [
    {
        id: 1,
        name: 'Dr. Hammed Ninalowo',
        avatar: '',
        createdAt: new Date().toISOString(),
        email: 'N.Hammed@euracare.com',
        specialties: ['Interventional Radiology', 'Oncology', 'Vascular Surgery']
    },
    {
        id: 2,
        name: 'Dr. Tosin Majekodunmi',
        avatar: '',
        createdAt: new Date().toISOString(),
        email: 'M.Tosin@euracare.com',
        specialties: ['Advanced Cardiac Imaging', 'Interventional Cardiology', 'Adult & Pediatric Cardiology']
    },
    {
        id: 3,
        name: 'Dr. Owen Woghiren',
        avatar: '',
        createdAt: new Date().toISOString(),
        email: 'W.Owen@euracare.com',
        specialties: ['Gastroenterology']
    },
    {
        id: 4,
        name: 'Dr. Olamide Adeola',
        avatar: '',
        createdAt: new Date().toISOString(),
        email: 'olamideadeola2005@gmail.com',
        specialties: ['Breast surgery']
    }
];

const DoctorsPage = () => {
    const [showCreate, setShowCreate] = useState(false);
    const [editDoctor, setEditDoctor] = useState<NewDoctorPayload | null>(null);

    // const handleSearch = (q: string) => {
    //     console.log('search:', q);
    // };

    const handleAdd = () => {
        setShowCreate(true);
    };

    const handleView = (d: Doctor) => {
        console.log('view doctor', d);
    };

    const hasDoctors = sampleDoctors.length > 0;

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
                            doctors={sampleDoctors} 
                            onView={handleView}
                            onEdit={(doctor) => {
                                setEditDoctor({
                                    fullName: doctor.name,
                                    email: doctor.email || '',
                                    countryCode: '+234',
                                    phone: '',
                                    languages: ['English'],
                                    bio: '',
                                    avatar: doctor.avatar,
                                    programs: doctor.specialties
                                });
                            }}
                            onDelete={(doctor) => {
                                console.log('delete doctor', doctor);
                                // Implement delete logic here
                            }}
                        />
                    ) : (
                        <NotFound
                            title="No Doctors Yet"
                            description={`It looks like you haven't defined any roles and permission yet. Once Added, they'll appear here for you to manage.`}
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
