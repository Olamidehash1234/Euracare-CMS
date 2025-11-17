import { useState, useRef, useEffect } from 'react';
import Header from '../../components/commonComponents/Header';
import SearchBar from '../../components/commonComponents/SearchBar';
import ActivityTable from '../../components/ActivityLogs/ActivityTable';
import type { ActivityRow } from '../../components/ActivityLogs/ActivityTable';

const roleOptions = ['Super Admin', 'Admin', 'System', 'marketing'];

const sampleActivities: ActivityRow[] = [
  {
    id: 1,
    timestamp: '2025-11-10 9:15:22',
    actor: 'Dr. A.Bello (Admin)',
    role: 'Admin',
    action: 'Content Updated',
    details: "Updated 'Waiting Times' section with Q4 2025 data.",
    ip: '192.168.1.45',
  },
  {
    id: 2,
    timestamp: '2025-11-10 9:10:55',
    actor: 'E-R. Manager (Web Team)',
    role: 'Web Team',
    action: 'System Login',
    details: 'Successful login from IP: 192.168.1.55',
    ip: '192.168.1.45',
  },
  {
    id: 3,
    timestamp: '2025-11-10 8:45:10',
    actor: 'Dr. O. Lade (Physician)',
    role: 'Physician',
    action: 'Profile Edited',
    details: 'Updated phone number and added a new certification image.',
    ip: '192.168.1.45',
  },
];

const LogsPage = () => {
  const [openRoleDropdown, setOpenRoleDropdown] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const popRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!popRef.current) return;
      if (!popRef.current.contains(e.target as Node)) setOpenRoleDropdown(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const toggleRole = (r: string) => {
    setSelectedRoles(prev => (prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]));
  };

  const applyRoles = () => {
    // selectedRoles is available for filtering; here we just close the dropdown
    setOpenRoleDropdown(false);
  };

  const resetFilters = () => {
    setSelectedRoles([]);
    setOpenRoleDropdown(false);
  };

  // Footer action handlers (local no-op / logging for now)
  const handleSelectAll = () => {
    console.log('Select all clicked');
  };

  const handleMarkAllRead = () => {
    console.log('Mark all read clicked');
  };

  const handleDeleteSelected = () => {
    console.log('Delete selected clicked');
  };

  return (
    <section>
      <Header title="Activity Logs" />

      <div className="p-[16px] lg:p-[40px]">
        <div className="flex items-center flex-col lg:flex-row gap-[10px] lg:gap-[20px] justify-between mb-[22px]">
          <div className="flex items-center w-full lg:w-1/2">
            <SearchBar placeholder="Search Activity Log" />
          </div>

          {/* FILTER CONTROLS */}
          <div className="flex items-center border border-[#01010133] divide-x rounded-[10px] overflow-hidden">
            <div className="inline-flex items-center">
              <button className="flex items-center gap-2 px-[20px] py-[12px]">
                <img src="/icon/filter.svg" alt="filter" className="" />
                <span className=" text-[#202224] text-[15px]">Filter By:</span>
              </button>
            </div>

            {/* Role dropdown trigger */}
            <div className="relative" ref={popRef}>
              <button
                onClick={() => setOpenRoleDropdown(prev => !prev)}
                className="flex items-center gap-2 px-[20px] py-[12px]"
                aria-expanded={openRoleDropdown}
              >
                <span className="text-[#202224] text-[15px]">Role</span>
                <svg className="w-4 h-4 text-[#0C2141]" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {openRoleDropdown && (
                <div className="absolute right-0 mt-2 z-50 w-[344px] lg:w-[520px] bg-white border border-[#01010133] rounded-[14px] shadow-lg">
                  <div className='px-5 py-[24px]'>
                    <div className="text-[16px] font-medium mb-3 lg:mb-[20px] leading-normal">Select Role</div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {roleOptions.map((r) => {
                        const active = selectedRoles.includes(r);
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => toggleRole(r)}
                            className={`py-[12px] px-[20px] text-[14px] rounded-full border ${active ? 'bg-[#0C2141] text-white border-transparent' : 'bg-white text-[#111827] border-[#01010133]'}`}
                          >
                            {r}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className='w-full h-[0.5px] bg-[#979797]/70'></div>
                  <div className='px-5 pt-[16px] pb-[24px]'>
                    <div className="text-[14px] text-[#434343] mb-4 leading-normal">*You can choose multiple roles</div>

                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={applyRoles}
                        className="w-full lg:w-[120px] py-[8px] rounded-md bg-[#0C2141] text-white"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reset filter */}
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-3 py-[12px] text-[15px] text-[#FF453A]"
            >
              <img src="/icon/reset.svg" alt="reset" className="" />
              Reset Filter
            </button>
          </div>
        </div>

        {/* Activity table component */}
        <ActivityTable activities={sampleActivities} />

        <div className="mt-[30px] flex items-center justify-between text-sm text-[#202224]">
          <div>Showing 1-12 of 1,253</div>

          <div className="flex items-center gap-2 lg:gap-[0px] border border-[#D5D5D5] bg-[#FAFBFD] w-max rounded-[12px] divide-x">
            <button onClick={handleSelectAll} className="px-[14px] py-[12px] text-[#0C2141]" title="Select All">
                <img src="/icon/download.svg" alt="" />
            </button>

            <button onClick={handleMarkAllRead} className="px-[14px] py-[12px] text-[#0C2141]" title="Mark All Read">
                <img src="/icon/info.svg" alt="" />
            </button>

            <button onClick={handleDeleteSelected} className="px-[14px] py-[12px] text-[#EF4444]" title="Delete">
                <img src="/icon/delete-black.svg" alt="" />
            </button>
         </div>

          <div className="flex items-center border border-[#E6E8EE] divide-x divide-[#E6E8EE] rounded-[8px]">
            <button className="px-[20px] py-[13px]">
              <img src="/icon/arrow-left.svg" alt="" />
            </button>
            <button className="px-[20px] py-[13px]">
              <img src="/icon/arrow-right.svg" alt="" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogsPage;
