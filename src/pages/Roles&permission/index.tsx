import { useState } from 'react';
import Header from '../../components/commonComponents/Header';
import SearchBar from '../../components/commonComponents/SearchBar';
import NotFound from '../../components/commonComponents/NotFound';
import MoreMenu from '../../components/commonComponents/MoreMenu';
import { sampleAdminsInitial } from '../Admin';
import ManageMembersTable from '../../components/RolesPermission/ManageMembersTable';

const roleMeta: Record<string, { description: string; icon: string }> = {
  'Super Admin': {
    description: 'Manages system settings and user access.',
    icon: '/icon/super-admin.svg',
  },
  'Admin': {
    description: 'Manages system settings and user access.',
    icon: '/icon/admin1.svg',
  },
  'Support': {
    description: 'Manages queries settings and user access.',
    icon: '/icon/support.svg',
  },
};

const DepartmentPage = () => {
  // derive roles/groups from admin data
  const admins = sampleAdminsInitial;
  const grouped = admins.reduce<Record<string, { name: string; members: string[]; count: number }>>((acc, a) => {
    const key = a.role || 'Unknown';
    if (!acc[key]) acc[key] = { name: key, members: [], count: 0 };
    if (a.avatar) acc[key].members.push(a.avatar);
    acc[key].count += 1;
    return acc;
  }, {});

  const mockRoles = Object.entries(grouped).map(([roleName, data]) => {
    const meta = roleMeta[roleName] || roleMeta['Unknown'];
    return {
      id: roleName.toLowerCase().replace(/\s+/g, '-'),
      name: data.name,
      count: data.count,
      description: meta.description || `${data.count} users assigned`,
      icon: meta.icon || '',
      members: data.members, // avatars from admin data
    };
  });

  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);
  const [openMembersFor, setOpenMembersFor] = useState<string | null>(null); // which role id to show members for

  const handleManageMembers = (roleId: string) => {
    // close the small MoreMenu and open inline members table
    setOpenMenuFor(null);
    setOpenMembersFor(roleId);
  };

  const handleManagePermission = (roleId: string) => {
    // hook up modal or navigation to permission management
    console.log('Manage permission for', roleId);
  };

  return (
    <div>
      <section>
        <Header title="Roles & Permission" />
        <div className="p-[16px] lg:p-[40px]">
          {openMembersFor && (
            <a href="/roles&permission" className="inline-flex items-center text-[#0C2141] text-sm lg:text-[16px] font-medium mb-4 gap-[4px]">
              <img src="/icon/right.svg" alt="" /> Back to Roles and Permissions Page
            </a>
          )}
          <div className="bg-white rounded-[14px] p-6 lg:px-[20px] lg:py-[23px] shadow-sm border border-gray-200">
            <div className="flex items-center flex-col lg:flex-row gap-[20px] justify-between mb-[22px]">
              <button className="flex items-center order-1 lg:order-2 ml-auto lg:ml-0 lg:w-auto gap-2 px-6 py-[9px] lg:py-[13px] lg:px-[20px] rounded-full bg-[#0C2141] text-white text-sm font-medium">
                <span className="text-lg">+</span> Create Roles
              </button>

              <div className="flex items-center w-full lg:w-1/2 order-2 lg:order-1">
                <SearchBar placeholder="Search Here" />
              </div>
            </div>

            {/* NEW: show ManageMembersTable alone when a role is selected */}
            {openMembersFor ? (
              (() => {
                const role = mockRoles.find(r => r.id === openMembersFor);
                const members = sampleAdminsInitial.filter(a => a.role === (role?.name ?? ''));
                return (
                  <div className="mt-0">
                    <ManageMembersTable
                      isOpen={true}
                      roleName={role?.name ?? 'Members'}
                      members={members}
                      onClose={() => setOpenMembersFor(null)}
                      onEdit={(admin) => console.log('edit admin from members table', admin)}
                      onDelete={(admin) => console.log('delete admin from members table', admin)}
                    />
                  </div>
                );
              })()
            ) : (
              // show roles grid (or NotFound) when no role is selected
              mockRoles.length === 0 ? (
                <NotFound
                  title="Nothing to see here"
                  description={`It looks like you haven’t defined any roles and permission yet. Once Added, they’ll appear here for you to manage.`}
                  imageSrc="/not-found.png"
                  ctaText="Create Roles"
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:mb-[24px]">
                  {mockRoles.map((role) => {
                    const extra = Math.max(0, role.members.length - 3);
                    return (
                      <div key={role.id} className="relative bg-white border border-[#0101011A] rounded-[10px] p-[20px] shadow-sm flex flex-col gap-[21px]">
                        <div className='flex gap-[10px] items-center'>
                          <div className="flex-shrink-0">
                            {role.icon ? (
                              <img src={role.icon} alt={role.name} className="w-10 h-10 lg:h-[44px] lg:w-[44px] rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 lg:h-[44px] lg:w-[44px] rounded-full bg-[#92BDFF] flex items-center justify-center text-sky-800 font-medium">
                                {role.name.charAt(0)}
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="text-sm lg:text-[16px] text-[#010101]">{role.name} <span className="text-[#0C2141]">({role.count})</span></div>
                                <div className="text-xs lg:text-[13px] leading-[20px] text-[#010101CC]">{role.description}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-row justify-between items-center">
                          <div className="flex -space-x-[10px]">
                            {role.members.slice(0, 4).map((src: string, idx: number) => (
                              <img
                                key={idx}
                                src={src || '/image/avatar/default.png'}
                                alt=""
                                className="w-8 h-8 lg:w-[40px] lg:h-[40px] rounded-full object-cover"
                              />
                            ))}
                            {extra > 0 && (
                              <div className="w-8 h-8 lg:w-[40px] lg:h-[40px] rounded-full bg-gray-200 text-[14px] text-gray-700 flex items-center justify-center">
                                +{extra}
                              </div>
                            )}
                          </div>

                          <div>
                            <button
                              aria-label="More options"
                              onClick={() => setOpenMenuFor((s) => (s === role.id ? null : role.id))}
                              className=""
                            >
                              <img src="/icon/more2.svg" alt="" className='w-full h-full object-cover'/>
                            </button>

                            {openMenuFor === role.id && (
                              <MoreMenu
                                onClose={() => setOpenMenuFor(null)}
                                onManageMembers={() => handleManageMembers(role.id)}
                                onManagePermission={() => handleManagePermission(role.id)}
                              />
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DepartmentPage;
