import Header from '../../components/commonComponents/Header';
import SearchBar from '../../components/commonComponents/SearchBar';
import NotificationToolbar from '../../components/Notifications/NotificationToolbar';
import NotificationList from '../../components/Notifications/NotificationList';
import { useState } from 'react';

export default function NotificationsPage() {
  const [query, setQuery] = useState('');
  const [selectedAll, setSelectedAll] = useState(false);

  return (
    <section>
      <Header title="Notifications" />
      <div className="p-[16px] lg:p-[40px]">
        <div className="bg-white rounded-[14px] shadow-sm border border-gray-200 overflow-hidden">
          {/* top toolbar area (search left, actions right) */}
          <div className="p-4 lg:p-6 border-b border-[#F1F3F5]">
            <div className="flex items-center gap-4 justify-between">
              <div className="flex-1 max-w-lg">
                <SearchBar placeholder="Search Notification" value={query} onChange={(v: string) => setQuery(v)} />
              </div>

              <div className="flex items-center gap-2">
                <NotificationToolbar
                  onSelectAll={() => setSelectedAll(s => !s)}
                  onMarkAllRead={() => console.log('Mark all read')}
                  onDelete={() => console.log('Delete selected')}
                />
              </div>
            </div>
          </div>

          {/* notification list */}
          <div className="p-4 lg:p-0">
            <NotificationList search={query} selectAll={selectedAll} />
          </div>
        </div>

        <div className="mt-[35px] flex items-center justify-between text-sm text-[#202224]">
            <div>Showing 1-12 of 1,253</div>

            <div className="text-center">
              <button className="text-[#005920] text-[14px] font-medium hover:underline" onClick={() => console.log('Mark all as read')}>
                Mark all as read
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
}
