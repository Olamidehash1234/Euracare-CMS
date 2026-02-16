import { useState, useEffect } from 'react';
import Header from '../../components/commonComponents/Header';
import SearchBar from '../../components/commonComponents/SearchBar';
import ActivityTable from '../../components/ActivityLogs/ActivityTable';
import CustomDropdown from '../../components/commonComponents/CustomDropdown';
import Toast from '../../components/GlobalComponents/Toast';
import LoadingSpinner from '../../components/commonComponents/LoadingSpinner';
import NotFound from '../../components/commonComponents/NotFound';
import { auditService } from '../../services';
import type { ActivityRow } from '../../components/ActivityLogs/ActivityTable';
import type { AuditResponse } from '../../services/auditService';

const LogsPage = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'loading'>('success');

  // Fetch audit logs from backend (without pagination)
  useEffect(() => {
    const fetchAudits = async () => {
      try {
        setLoading(true);
        setError(null);
        // console.log('📋 Starting to fetch audit logs...');
        
        const response = await auditService.getAudits();
        
        // console.log('📨 Raw audit response:', response);
        
        // Transform audit data to ActivityRow format
        const audits = response.data.data?.audits || [];
        // console.log('📊 Audit logs count:', audits.length);
        
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
          // console.log('🔄 Transformed audit:', { from: audit, to: transformed });
          return transformed;
        });
        
        setActivities(transformedActivities);
        // console.log('  Successfully loaded', transformedActivities.length, 'audit logs');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load audit logs';
        // console.error('❌ Error loading audit logs:', errorMessage);
        setError(errorMessage);
        setToastType('error');
        setToastMessage('Unable to load audit logs. Please try again.');
        setShowToast(true);
        setActivities([]);
        setFilteredActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAudits();
  }, []);

  // Filter activities based on search query and selected role
  useEffect(() => {
    let filtered = activities;

    // Filter by search query (searches in actor, action, details)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(activity =>
        (activity.actor?.toLowerCase().includes(query)) ||
        (activity.action?.toLowerCase().includes(query)) ||
        (activity.details?.toLowerCase().includes(query))
      );
    }

    // Filter by selected role
    if (selectedRole) {
      filtered = filtered.filter(activity =>
        activity.role === selectedRole
      );
    }

    setFilteredActivities(filtered);
  }, [activities, searchQuery, selectedRole]);

  // resetFilters clears the selection
  const resetFilters = () => {
    setSelectedRole('');
    setSearchQuery('');
  };

  // Retry fetching audits
  const handleRetry = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await auditService.getAudits();
      
      const audits = response.data.data?.audits || [];
      
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
        return transformed;
      });
      
      setActivities(transformedActivities);
      setToastType('success');
      setToastMessage('Audit logs loaded successfully');
      setShowToast(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load audit logs';
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
  // const handleSelectAll = () => {
  //   console.log('📌 Select all clicked');
  // };

  // const handleMarkAllRead = () => {
  //   console.log('📖 Mark all read clicked');
  // };

  // const handleDeleteSelected = () => {
  //   console.log('🗑️ Delete selected clicked');
  // };

  return (
    <section>
      <Header title="Activity Logs" />

      <div className="p-[16px] lg:p-[40px]">
        <div className="flex items-center flex-col lg:flex-row gap-[10px] lg:gap-[20px] justify-between mb-[22px]">
          <div className="flex items-center w-full lg:w-1/2">
            <SearchBar 
              placeholder="Search Activity Log" 
              value={searchQuery}
              onSearch={setSearchQuery}
            />
          </div>

          {/* FILTER CONTROLS */}
          <div className="flex items-center flex-col lg:flex-row gap-[10px] lg:gap-[20px]">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Role:</span>
              <CustomDropdown
                options={Array.from(new Set(activities.map(a => a.role)))
                  .filter(Boolean)
                  .map(role => ({ label: role || 'Unknown', value: role || '' }))}
                value={selectedRole}
                onChange={setSelectedRole}
                placeholder="Select Role"
                className="w-[150px]"
              />
            </div>

            {/* Reset filter */}
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-3 py-[8px] text-[15px] text-[#FF453A] hover:text-red-700 transition"
            >
              <img src="/icon/reset.svg" alt="reset" className="w-[16px]" />
              Reset
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
        {!loading && !error && <ActivityTable activities={filteredActivities} />}
      </div>

      {/* Toast notification */}
      {showToast && <Toast message={toastMessage} show={showToast} type={toastType} onHide={() => setShowToast(false)} />}
    </section>
  );
};

export default LogsPage;
