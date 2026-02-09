import Header from '../../components/commonComponents/Header';
import SearchBar from '../../components/commonComponents/SearchBar';
import NotificationToolbar from '../../components/Notifications/NotificationToolbar';
import NotificationList from '../../components/Notifications/NotificationList';
import NotificationSkeleton from '../../components/commonComponents/NotificationSkeleton';
import Toast from '../../components/GlobalComponents/Toast';
import { useState, useEffect, useRef } from 'react';
import { useNotifications } from '@/context/NotificationContext';

export default function NotificationsPage() {
  const [query, setQuery] = useState('');
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'loading'; show: boolean }>({
    message: '',
    type: 'success',
    show: false,
  });
  const { notifications, unreadCount, isLoading, error, markAsRead, markAllAsRead, bulkDeleteNotifications, loadNotifications } = useNotifications();
  const loadAttemptedRef = useRef(false);

  const showToast = (message: string, type: 'success' | 'error' | 'loading') => {
    setToast({ message, type, show: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

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

  const handleMarkAllRead = async () => {
    try {
      setIsProcessing(true);
      showToast('Marking all as read...', 'loading');
      await markAllAsRead();
      showToast('All notifications marked as read ✅', 'success');
      console.log('✅ [NotificationsPage] All notifications marked as read');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to mark all as read';
      showToast(message, 'error');
      console.error('❌ [NotificationsPage] Error marking all as read:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      showToast('No notifications selected', 'error');
      return;
    }

    try {
      setIsProcessing(true);
      showToast(`Deleting ${selectedIds.length} notification(s)...`, 'loading');
      await bulkDeleteNotifications(selectedIds);
      showToast(`${selectedIds.length} notification(s) deleted ✅`, 'success');
      setSelectedIds([]);
      setSelectedAll(false);
      console.log(`✅ [NotificationsPage] ${selectedIds.length} notification(s) deleted`);
    } catch (err: any) {
      const message = err?.message || err?.response?.data?.message || 'Failed to delete notifications';
      showToast(message, 'error');
      console.error('❌ [NotificationsPage] Error deleting notifications:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      console.log('📖 [NotificationsPage] Marking notification as read:', id);
      await markAsRead(id);
      console.log('✅ [NotificationsPage] Notification marked as read');
    } catch (err: any) {
      const message = err?.message || 'Failed to mark as read';
      showToast(message, 'error');
      console.error('❌ [NotificationsPage] Error marking as read:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('🗑️ [NotificationsPage] Deleting notification:', id);
      // Use bulkDeleteNotifications with a single id
      await bulkDeleteNotifications([id]);
      showToast('Notification deleted ✅', 'success');
      console.log('✅ [NotificationsPage] Notification deleted');
    } catch (err: any) {
      const message = err?.message || err?.response?.data?.message || 'Failed to delete notification';
      showToast(message, 'error');
      console.error('❌ [NotificationsPage] Error deleting notification:', err);
    }
  };

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
                  onMarkAllRead={handleMarkAllRead}
                  onDelete={handleBulkDelete}
                  selectedCount={selectedIds.length}
                  isProcessing={isProcessing}
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
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>

        <div className="mt-[35px] flex items-center justify-between text-sm text-[#202224]">
          <div>Showing {notifications.length === 0 ? '0' : `1-${Math.min(12, notifications.length)}`} of {notifications.length}</div>

          <div className="text-center">
            <button 
              className="text-[#005920] text-[14px] font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={handleMarkAllRead}
              disabled={isProcessing || notifications.length === 0}
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
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type}
          show={toast.show}
          onHide={hideToast}
        />
      )}
    </section>
  );
}
