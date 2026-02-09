import apiClient from './apiClient';

/**
 * Audit Log response from backend
 */
export interface AuditResponse {
  id: string;
  user: string;
  action_type: string;
  item_affected: string;
  details: string;
  ip_address: string;
  created_at: string;
  updated_at: string;
}

/**
 * Paginated audit response
 */
export interface AuditListResponse {
  audits: AuditResponse[];
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

const auditService = {
  /**
   * Get all audit logs with optional pagination
   */
  getAudits: (params?: { page?: number; limit?: number; search?: string }) => {
    console.log('🔍 Fetching audits with params:', params);
    return apiClient.get<{ success: boolean; data: { audits: AuditResponse[] }; meta?: any }>('/audits', { params })
      .then((response) => {
        console.log('✅ Audit logs response:', response.data);
        return response;
      })
      .catch((error) => {
        console.error('❌ Error fetching audit logs:', error.message);
        throw error;
      });
  },

  /**
   * Get audit logs for a specific user
   */
  getUserAudits: (userId: string, params?: { page?: number; limit?: number }) => {
    console.log(`🔍 Fetching audits for user: ${userId}`, params);
    return apiClient.get<{ success: boolean; data: { audits: AuditResponse[] } }>(`/audits/user/${userId}`, { params })
      .then((response) => {
        console.log(`✅ Audit logs for user ${userId}:`, response.data);
        return response;
      })
      .catch((error) => {
        console.error(`❌ Error fetching audits for user ${userId}:`, error.message);
        throw error;
      });
  },

  /**
   * Get audit log by ID
   */
  getAuditById: (id: string) => {
    console.log(`🔍 Fetching audit with ID: ${id}`);
    return apiClient.get<{ success: boolean; data: AuditResponse }>(`/audits/${id}`)
      .then((response) => {
        console.log(`✅ Audit log ${id}:`, response.data);
        return response;
      })
      .catch((error) => {
        console.error(`❌ Error fetching audit ${id}:`, error.message);
        throw error;
      });
  },

  /**
   * Export audit logs
   */
  exportAudits: (params?: { format?: 'csv' | 'pdf'; filters?: any }) => {
    console.log('🔍 Exporting audits with format:', params?.format);
    return apiClient.get('/audits/export', { params, responseType: 'blob' })
      .then((response) => {
        console.log('✅ Audit logs exported successfully');
        return response;
      })
      .catch((error) => {
        console.error('❌ Error exporting audit logs:', error.message);
        throw error;
      });
  },
};

export default auditService;
