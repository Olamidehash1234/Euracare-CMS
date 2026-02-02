import { useState } from 'react';
import Header from '../../components/commonComponents/Header';
import SearchBar from '../../components/commonComponents/SearchBar';
import ActivityTable from '../../components/ActivityLogs/ActivityTable';
import InlineRoleDropdown from '../../components/commonComponents/InlineRoleDropdown';
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
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // resetFilters clears parent's selection (dropdown reads value prop)
  const resetFilters = () => {
    setSelectedRoles([]);
  };

  // Footer action handlers (local no-op / logging for now)
  const handleSelectAll = () => {
  };

  const handleMarkAllRead = () => {
  };

  const handleDeleteSelected = () => {
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
            <InlineRoleDropdown
              options={roleOptions}
              value={selectedRoles}
              onChange={(vals) => setSelectedRoles(vals)}
            />

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
