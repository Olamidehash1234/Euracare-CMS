import Header from '../../components/commonComponents/Header';
import SearchBar from '../../components/commonComponents/SearchBar';
import NotificationToolbar from '../../components/Notifications/NotificationToolbar';
import NotificationList from '../../components/Notifications/NotificationList';
import NotificationSkeleton from '../../components/commonComponents/NotificationSkeleton';
import { useState, useEffect, useRef } from 'react';
import { useNotifications } from '@/context/NotificationContext';

export default function NotificationsPage() {
  const [query, setQuery] = useState('');
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { notifications, unreadCount, isLoading, error, markAllAsRead, removeNotification, loadNotifications } = useNotifications();
  const loadAttemptedRef = useRef(false);

  // Load notifications on component mount (only once due to ref)
  useEffect(() => {
    if (!loadAttemptedRef.current) {
      loadAttemptedRef.current = true;
      console.log('📋 [NotificationsPage] Component mounted, loading notifications...');
      loadNotifications().catch(err => {
        console.error('❌ [NotificationsPage] Error loading notifications:', err);
      });
    }
  }, [loadNotifications]);

  return (
    <section>
      <Header title="Notifications" />
      <div className="p-[16px] lg:p-[40px]">
        <div className="bg-white rounded-[14px] shadow-sm border border-gray-200 overflow-hidden">
          {/* top toolbar area (search left, actions right) */}
          <div className="p-4 lg:p-6 border-b border-[#F1F3F5]">
            <div className="flex items-center gap-4 justify-between">
              <div className="flex-1 max-w-lg">
                <SearchBar placeholder="Search Notification" value={query} onSearch={setQuery} />
              </div>

              <div className="flex items-center gap-2">
                <NotificationToolbar
                  onSelectAll={() => setSelectedAll(s => !s)}
                  onMarkAllRead={() => {
                    markAllAsRead();
                    console.log('✅ [NotificationsPage] All notifications marked as read');
                  }}
                  onDelete={() => {
                    selectedIds.forEach(id => {
                      removeNotification(id);
                    });
                    setSelectedIds([]);
                    setSelectedAll(false);
                    console.log(`✅ [NotificationsPage] ${selectedIds.length} notification(s) deleted`);
                  }}
                  selectedCount={selectedIds.length}
                />
              </div>
            </div>
          </div>

          {/* notification list */}
          <div className="p-4 lg:p-0">
            {isLoading ? (
              <NotificationSkeleton />
            ) : error ? (
              <div className="p-6 text-center">
                <div className="text-red-600 text-sm mb-4">❌ {error}</div>
                <button 
                  onClick={() => loadNotifications()}
                  className="px-4 py-2 bg-[#0C2141] text-white rounded-md text-sm hover:bg-[#0C2141]/90"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <NotificationList 
                search={query} 
                selectAll={selectedAll}
                onSelectionChange={setSelectedIds}
              />
            )}
          </div>
        </div>

        <div className="mt-[35px] flex items-center justify-between text-sm text-[#202224]">
          <div>Showing {notifications.length === 0 ? '0' : `1-${Math.min(12, notifications.length)}`} of {notifications.length}</div>

          <div className="text-center">
            <button 
              className="text-[#005920] text-[14px] font-medium hover:underline" 
              onClick={() => {
                markAllAsRead();
                console.log('✅ Mark all notifications as read');
              }}
            >
              Mark all as read ({unreadCount})
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
