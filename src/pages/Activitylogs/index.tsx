import { useState, useEffect } from 'react';
import Header from '../../components/commonComponents/Header';
import SearchBar from '../../components/commonComponents/SearchBar';
import ActivityTable from '../../components/ActivityLogs/ActivityTable';
import InlineRoleDropdown from '../../components/commonComponents/InlineRoleDropdown';
import Toast from '../../components/GlobalComponents/Toast';
import LoadingSpinner from '../../components/commonComponents/LoadingSpinner';
import NotFound from '../../components/commonComponents/NotFound';
import { auditService } from '../../services';
import type { ActivityRow } from '../../components/ActivityLogs/ActivityTable';
import type { AuditResponse } from '../../services/auditService';

const roleOptions = ['Super Admin', 'Admin', 'System', 'marketing'];

const LogsPage = () => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'loading'>('success');

  // Fetch audit logs from backend
  useEffect(() => {
    const fetchAudits = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('📋 Starting to fetch audit logs...');
        
        const response = await auditService.getAudits({ page: 1, limit: 50 });
        
        console.log('📨 Raw audit response:', response);
        
        // Transform audit data to ActivityRow format
        const audits = response.data.data?.audits || [];
        console.log('📊 Audit logs count:', audits.length);
        
        const transformedActivities: ActivityRow[] = audits.map((audit: AuditResponse) => {
          const transformed = {
            id: audit.id,
            timestamp: new Date(audit.created_at).toLocaleString(),
            actor: audit.user || 'Unknown User',
            role: 'System', // Map from audit data if available
            action: audit.action_type || 'Unknown Action',
            details: audit.details || audit.item_affected || 'N/A',
            ip: audit.ip_address || 'N/A',
          };
          console.log('🔄 Transformed audit:', { from: audit, to: transformed });
          return transformed;
        });
        
        setActivities(transformedActivities);
        console.log('✅ Successfully loaded', transformedActivities.length, 'audit logs');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load audit logs';
        console.error('❌ Error loading audit logs:', errorMessage);
        setError(errorMessage);
        setToastType('error');
        setToastMessage('Unable to load audit logs. Please try again.');
        setShowToast(true);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAudits();
  }, []);

  // resetFilters clears parent's selection (dropdown reads value prop)
  const resetFilters = () => {
    setSelectedRoles([]);
  };

  // Retry fetching audits
  const handleRetry = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Retrying to fetch audit logs...');
      
      const response = await auditService.getAudits({ page: 1, limit: 50 });
      
      console.log('📨 Raw audit response:', response);
      
      const audits = response.data.data?.audits || [];
      console.log('📊 Audit logs count:', audits.length);
      
      const transformedActivities: ActivityRow[] = audits.map((audit: AuditResponse) => {
        const transformed = {
          id: audit.id,
          timestamp: new Date(audit.created_at).toLocaleString(),
          actor: audit.user || 'Unknown User',
          role: 'System',
          action: audit.action_type || 'Unknown Action',
          details: audit.details || audit.item_affected || 'N/A',
          ip: audit.ip_address || 'N/A',
        };
        console.log('🔄 Transformed audit:', { from: audit, to: transformed });
        return transformed;
      });
      
      setActivities(transformedActivities);
      setToastType('success');
      setToastMessage('Audit logs loaded successfully');
      setShowToast(true);
      console.log('✅ Successfully loaded', transformedActivities.length, 'audit logs');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load audit logs';
      console.error('❌ Error loading audit logs:', errorMessage);
      setError(errorMessage);
      setToastType('error');
      setToastMessage('Failed to load audit logs. Please try again.');
      setShowToast(true);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  // Footer action handlers (local no-op / logging for now)
  const handleSelectAll = () => {
    console.log('📌 Select all clicked');
  };

  const handleMarkAllRead = () => {
    console.log('📖 Mark all read clicked');
  };

  const handleDeleteSelected = () => {
    console.log('🗑️ Delete selected clicked');
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

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-[60px]">
            <LoadingSpinner heightClass="py-[200px]" />
          </div>
        )}

        {/* Error state with NotFound component */}
        {!loading && error && (
          <NotFound
            title="Failed to Load Audit Logs"
            description="We encountered an error while loading the audit logs. Please try again."
            imageSrc="/not-found.png"
            ctaText="Try Again"
            onCta={handleRetry}
          />
        )}

        {/* Activity table component - show only when not loading and no error */}
        {!loading && !error && <ActivityTable activities={activities} />}

        {!loading && !error && (
          <div className="mt-[30px] flex items-center justify-between text-sm text-[#202224]">
            <div>Showing 1-{activities.length} of {activities.length}</div>

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
        )}
      </div>

      {/* Toast notification */}
      {showToast && <Toast message={toastMessage} show={showToast} type={toastType} onHide={() => setShowToast(false)} />}
    </section>
  );
};

export default LogsPage;
