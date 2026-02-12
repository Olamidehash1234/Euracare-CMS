import { useState, useEffect, useCallback } from 'react';
import Header from '../../components/commonComponents/Header';
import SearchBar from '../../components/commonComponents/SearchBar';
import NotFound from '../../components/commonComponents/NotFound';
import LoadingSpinner from '../../components/commonComponents/LoadingSpinner';
import Toast from '../../components/GlobalComponents/Toast';
import TeamMemberModal from './AddTeamMemberModal';
import TeamTable, { sampleTeamMembers } from '../../components/Team/TeamTable';
import teamService from '../../services/teamService';
import type { TeamMember } from '../../components/Team/TeamTable';

interface ToastState {
  show: boolean;
  type: 'success' | 'error' | 'loading';
  message: string;
}

const TeamPage = () => {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMember, setEditMember] = useState<TeamMember | null>(null);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: 'success',
    message: '',
  });

  const showToast = (type: 'success' | 'error' | 'loading', message: string) => {
    setToast({ show: true, type, message });
  };

  // Fetch team members on mount
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await teamService.getAllTeamMembers();
      
      // Handle the API response - extract team members from nested structure
      const teamData = (response.data as any)?.data?.team_members || [];

      if (!Array.isArray(teamData)) {
        throw new Error('Invalid response format: expected array of team members');
      }

      // Transform API response to component format
      const transformedMembers: TeamMember[] = teamData.map((member: any) => ({
        id: member.id,
        name: member.full_name,
        avatar: member.profile_picture_url,
        role: member.role,
        category: member.category,
        createdAt: member.created_at || member.createdAt || new Date().toISOString(),
      }));

      setMembers(transformedMembers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch team members';
      setError(errorMessage);
      showToast('error', errorMessage);
      // Show sample data on error
      setMembers(sampleTeamMembers);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (_m: TeamMember) => {
    // View team member details
  };
  
  const handleEdit = async (m: TeamMember) => {
    try {
      showToast('loading', 'Loading team member details...');
      
      // Fetch full team member data by ID
      const response = await teamService.getTeamMemberById(String(m.id));
      
      // Extract team member from nested response structure
      const fullMember = (response.data?.data as any)?.team_member || response.data?.data;
      
      if (fullMember) {
        
        // Transform API response to form format (similar to doctors)
        const transformedMember = {
          id: fullMember.id,
          name: fullMember.full_name,
          fullName: fullMember.full_name,
          avatar: fullMember.profile_picture_url,
          role: fullMember.role || '',
          category: fullMember.category || '',
          bio: fullMember.bio || '',
          createdAt: fullMember.created_at || fullMember.createdAt || new Date().toISOString(),
        };
        
        setEditMember(transformedMember as any);
        setOpen(true);
        setToast({ show: false, type: 'success', message: '' });
      } else {
        throw new Error('Team member data not found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load team member details';
      showToast('error', errorMessage);
    }
  };

  const handleDelete = async (m: TeamMember) => {
    try {
      showToast('loading', 'Deleting team member...');
      
      await teamService.deleteTeamMember(String(m.id));
      
      const updatedMembers = members.filter(x => x.id !== m.id);
      setMembers(updatedMembers);
      
      showToast('success', 'Team member deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete team member';
      showToast('error', errorMessage);
    }
  };

  const handleSave = (data: any) => {
    let updatedMembers: TeamMember[];

    if (editMember) {
      // Update existing member with API response data
      updatedMembers = members.map(m => 
        m.id === editMember.id 
          ? { 
              ...m, 
              name: data.name || data.fullName,
              avatar: data.avatar,
              role: data.role,
              category: data.category,
              // Keep original createdAt
              createdAt: data.createdAt || m.createdAt || new Date().toISOString(),
            }
          : m
      );
      showToast('success', 'Team member updated successfully!  ');
    } else {
      // Add new member from API response
      const newMember: TeamMember = {
        id: data.id,
        name: data.name || data.fullName,
        avatar: data.avatar,
        role: data.role,
        category: data.category,
        createdAt: data.created_at || data.createdAt || new Date().toISOString(),
      };
      updatedMembers = [newMember, ...members];
      showToast('success', 'Team member created successfully! 🎉');
    }
    
    setMembers(updatedMembers);
    setOpen(false);
    setEditMember(null);
  };

  /**
   * Filter members based on search term (ready for search implementation)
   */
  const filteredMembers = useCallback(() => {
    if (!searchTerm.trim()) return members;

    const term = searchTerm.toLowerCase();
    return members.filter(m =>
      m.name.toLowerCase().includes(term) ||
      m.role?.toLowerCase().includes(term) ||
      m.category?.toLowerCase().includes(term)
    );
  }, [members, searchTerm]);

  const displayMembers = filteredMembers();
  const hasMembers = displayMembers.length > 0;

  // Show error state
  if (error && !isLoading && displayMembers.length === 0) {
    return (
      <section>
        <Header title="Team Members" />
        <div className="p-[16px] lg:p-[40px]">
          <NotFound
            title="Failed to Load Team Members"
            description="We encountered an error while loading the team members. Please try again."
            imageSrc="/not-found.png"
            ctaText="Try Again"
            onCta={fetchTeamMembers}
          />
        </div>
      </section>
    );
  }

  return (
    <section>
      <Header title="Team Members" />
      <div className="p-[16px] lg:p-[40px]">
        <div className="bg-white rounded-[14px] p-6 lg:px-[20px] lg:py-[23px] shadow-sm border border-gray-200">
          <div className="flex items-center flex-col lg:flex-row gap-[20px] justify-between mb-[22px]">
            <button 
              onClick={() => setOpen(true)} 
              disabled={isLoading}
              className="flex items-center order-1 lg:order-2 ml-auto lg:ml-0 lg:w-auto gap-2 px-6 py-[9px] lg:py-[13px] lg:px-[20px] rounded-full bg-[#0C2141] text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-lg">+</span> Add New Member
            </button>

            <div className="flex items-center w-full lg:w-1/2 order-2 lg:order-1">
              <SearchBar 
                placeholder="Search for a team member" 
                value={searchTerm}
                onSearch={setSearchTerm}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner heightClass='250px'/>
            </div>
          ) : hasMembers ? (
            <>
              <TeamTable 
                members={displayMembers} 
                onView={handleView} 
                onEdit={handleEdit}
                onDelete={handleDelete} 
              />
              {searchTerm && displayMembers.length < members.length && (
                <div className="mt-4 text-center text-gray-500 text-sm">
                  Showing {displayMembers.length} of {members.length} team members
                </div>
              )}
            </>
          ) : searchTerm ? (
            <NotFound
              title="No Team Members Found"
              description={`No team members match your search for "${searchTerm}".`}
              imageSrc="/not-found.png"
              ctaText="Clear Search"
              onCta={() => setSearchTerm('')}
            />
          ) : (
            <NotFound
              title="No Team Members Yet"
              description={`It looks like you haven't added any team members yet. Once Added, they'll appear here for you to manage.`}
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
            id: editMember.id,
            fullName: editMember.name,
            role: editMember.role || '',
            category: editMember.category || '',
            avatar: editMember.avatar,
            bio: (editMember as any).bio || '',
          } : undefined}
          onSave={handleSave}
          onClose={() => {
            setOpen(false);
            setEditMember(null);
          }}
        />
      )}

      {/* Toast notification */}
      <Toast
        type={toast.type}
        message={toast.message}
        show={toast.show}
        onHide={() => setToast({ ...toast, show: false })}
      />
    </section>
  );
};

export default TeamPage;
