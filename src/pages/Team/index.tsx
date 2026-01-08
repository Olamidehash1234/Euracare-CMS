import { useState } from 'react';
import Header from '../../components/commonComponents/Header';
import SearchBar from '../../components/commonComponents/SearchBar';
import NotFound from '../../components/commonComponents/NotFound';
import TeamMemberModal from './AddTeamMemberModal';
import TeamTable, { sampleTeamMembers } from '../../components/Team/TeamTable';
import type { TeamMember } from '../../components/Team/TeamTable';

const TeamPage = () => {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>(sampleTeamMembers);
  const [editMember, setEditMember] = useState<TeamMember | null>(null);

  const handleView = (m: TeamMember) => { /* console.log('view', m); */ };
  
  const handleEdit = (m: TeamMember) => {
    setEditMember(m);
    setOpen(true);
  };

  const handleDelete = (m: TeamMember) => {
    setMembers(prev => prev.filter(x => x.id !== m.id));
  };

  const handleSave = (data: any) => {
    if (editMember) {
      // Update existing member
      setMembers(prev => prev.map(m => 
        m.id === editMember.id 
          ? { ...m, ...data }
          : m
      ));
    } else {
      // Add new member
      setMembers(prev => [...prev, { 
        id: Date.now(),
        createdAt: new Date().toISOString(),
        ...data
      }]);
    }
    setOpen(false);
    setEditMember(null);
  };

  const hasMembers = members.length > 0;

  return (
    <section>
      <Header title="Team Members" />
      <div className="p-[16px] lg:p-[40px]">
        <div className="bg-white rounded-[14px] p-6 lg:px-[20px] lg:py-[23px] shadow-sm border border-gray-200">
          <div className="flex items-center flex-col lg:flex-row gap-[20px] justify-between mb-[22px]">
            <button onClick={() => setOpen(true)} className="flex items-center order-1 lg:order-2 ml-auto lg:ml-0 lg:w-auto gap-2 px-6 py-[9px] lg:py-[13px] lg:px-[20px] rounded-full bg-[#0C2141] text-white text-sm font-medium">
              <span className="text-lg">+</span> Add New Member
            </button>

            <div className="flex items-center w-full lg:w-1/2 order-2 lg:order-1">
              <SearchBar placeholder="Search for a team member" />
            </div>
          </div>

          {hasMembers ? (
            <TeamTable 
              members={members} 
              onView={handleView} 
              onEdit={handleEdit}
              onDelete={handleDelete} 
            />
          ) : (
            <NotFound
              title="No Team Members Yet"
              description={`It looks like you haven't defined any roles and permission yet. Once Added, they'll appear here for you to manage.`}
              imageSrc="/not-found.png"
              ctaText="Add New Member"
              onCta={() => setOpen(true)}
            />
          )}
        </div>
      </div>

      {open && (
        <TeamMemberModal 
          mode={editMember ? 'edit' : 'create'}
          initialData={editMember ? {
            fullName: editMember.name,
            role: editMember.role || '',
            category: editMember.category || '',
            avatar: editMember.avatar,
          } : undefined}
          onSave={handleSave}
          onClose={() => {
            setOpen(false);
            setEditMember(null);
          }}
        />
      )}
    </section>
  );
};

export default TeamPage;
