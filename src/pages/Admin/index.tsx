import { useState } from 'react';
import Header from '../../components/commonComponents/Header';
import SearchBar from '../../components/commonComponents/SearchBar';
import NotFound from '../../components/commonComponents/NotFound';
import AdminTable from '../../components/Admin/AdminTable';
import CreateAdminForm from './CreateAdminForm';
import type { AdminType } from '../../components/Admin/AdminTable';
import type { AdminPayload } from './CreateAdminForm';

export const sampleAdminsInitial: AdminType[] = [
  { 
    id: 1, 
    name: 'Dr. Hammed Ninalowo', 
    avatar: '/image/doctor/test1.png',
    dateCreated: new Date().toISOString(),
    email: 'N.Hammed@euracare.com',
    role: 'Super Admin'
  },
  { 
    id: 2, 
    name: 'Dr. Tosin Majekodunmi',
    avatar: '/svg.svg',
    dateCreated: new Date().toISOString(),
    email: 'M.Tosin@euracare.com',
    role: 'Admin'
  },
  { 
    id: 3, 
    name: 'Dr. Tosin Majekodunmi',
    avatar: '/image/doctor/test1.png',
    dateCreated: new Date().toISOString(),
    email: 'M.Tosin@euracare.com',
    role: 'Super Admin'
  },
  { 
    id: 4, 
    name: 'Dr. Tosin Majekodunmi',
    avatar: '/svg.svg',
    dateCreated: new Date().toISOString(),
    email: 'M.Tosin@euracare.com',
    role: 'Admin'
  },
  { 
    id: 5, 
    name: 'Dr. Tosin Majekodunmi',
    avatar: '/svg.svg',
    dateCreated: new Date().toISOString(),
    email: 'M.Tosin@euracare.com',
    role: 'Super Admin'
  },
  { 
    id: 6, 
    name: 'Dr. Tosin Majekodunmi',
    avatar: '/svg.svg',
    dateCreated: new Date().toISOString(),
    email: 'M.Tosin@euracare.com',
    role: 'Admin'
  },
  { 
    id: 7, 
    name: 'Dr. Tosin Majekodunmi',
    avatar: '/svg.svg',
    dateCreated: new Date().toISOString(),
    email: 'M.Tosin@euracare.com',
    role: 'Super Admin'
  },
  { 
    id: 8, 
    name: 'Dr. Tosin Majekodunmi',
    avatar: '/svg.svg',
    dateCreated: new Date().toISOString(),
    email: 'M.Tosin@euracare.com',
    role: 'Admin'
  },
  { 
    id: 9, 
    name: 'Dr. Tosin Majekodunmi',
    avatar: '/svg.svg',
    dateCreated: new Date().toISOString(),
    email: 'M.Tosin@euracare.com',
    role: 'Super Admin'
  },
  { 
    id: 10, 
    name: 'Dr. Tosin Majekodunmi',
    avatar: '/svg.svg',
    dateCreated: new Date().toISOString(),
    email: 'M.Tosin@euracare.com',
    role: 'Admin'
  },
  { 
    id: 11, 
    name: 'Dr. Tosin Majekodunmi',
    avatar: '/svg.svg',
    dateCreated: new Date().toISOString(),
    email: 'M.Tosin@euracare.com',
    role: 'Admin'
  },
  {
    id: 12,
    name: 'Jane Doe',
    avatar: '/svg.svg',
    dateCreated: new Date().toISOString(),
    email: 'jane.doe@euracare.com',
    role: 'Support'
  },
  {
    id: 13,
    name: 'John Smith',
    avatar: '/svg.svg',
    dateCreated: new Date().toISOString(),
    email: 'john.smith@euracare.com',
    role: 'Support'
  },
];

const AdminPage = () => {
  const [admins, setAdmins] = useState<AdminType[]>(sampleAdminsInitial);
  const [showCreate, setShowCreate] = useState(false);
  const [editAdmin, setEditAdmin] = useState<AdminType | null>(null);

  const handleView = (admin: AdminType) => console.log('view admin', admin);

  const handleEdit = (admin: AdminType) => {
    setEditAdmin(admin);
    setShowCreate(true);
  };

  const handleDelete = (admin: AdminType) => {
    setAdmins(prev => prev.filter(x => x.id !== admin.id));
  };

  const handleSave = (payload: AdminPayload) => {
    if (editAdmin) {
      setAdmins(prev => prev.map(a => 
        a.id === editAdmin.id 
          ? { 
              ...a, 
              name: payload.fullName,
              email: payload.email,
              role: payload.roleType === 'super_admin' ? 'Super Admin' : 'Admin',
              avatar: payload.avatar
            }
          : a
      ));
    } else {
      setAdmins(prev => [
        ...prev,
        {
          id: Date.now(),
          name: payload.fullName,
          email: payload.email,
          role: payload.roleType === 'super_admin' ? 'Super Admin' : 'Admin',
          avatar: payload.avatar,
          dateCreated: new Date().toISOString()
        },
      ]);
    }
    setShowCreate(false);
    setEditAdmin(null);
  };

  if (showCreate || editAdmin) {
    return (
      <section>
        <Header title="Admin Management" />
        <div className="p-[16px] lg:p-[40px]">
          <CreateAdminForm
            mode={editAdmin ? 'edit' : 'create'}
            initialData={editAdmin ? {
              fullName: editAdmin.name,
              email: editAdmin.email,
              phone: '',
              roleType: editAdmin.role === 'Super Admin' ? 'super_admin' : 'admin',
              avatar: editAdmin.avatar,
            } : undefined}
            onSave={handleSave}
            onClose={() => {
              setShowCreate(false);
              setEditAdmin(null);
            }}
          />
        </div>
      </section>
    );
  }

  return (
    <section>
      <Header title="Admin Management" />
      <div className="p-[16px] lg:p-[40px]">
        <div className="bg-white rounded-[14px] p-6 lg:px-[20px] lg:py-[23px] shadow-sm border border-gray-200">
          <div className="flex items-center flex-col lg:flex-row gap-[20px] justify-between mb-[22px]">
            <button onClick={() => setShowCreate(true)} className="flex items-center order-1 lg:order-2 ml-auto lg:ml-0 lg:w-auto gap-2 px-6 py-[9px] lg:py-[13px] lg:px-[20px] rounded-full bg-[#0C2141] text-white text-sm font-medium">
              <span className="text-lg">+</span> Create New Admin
            </button>

            <div className="flex items-center w-full lg:w-1/2 order-2 lg:order-1">
              <SearchBar placeholder="Search for an admin" />
            </div>
          </div>

          {admins.length > 0 ? (
            <AdminTable
              admins={admins}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <NotFound
              title="No Admin Yet"
              description="It looks like you haven't added any admin yet. Once added, they'll appear here for you to manage."
              imageSrc="/not-found.png"
              ctaText="Create New Admin"
              onCta={() => setShowCreate(true)}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
