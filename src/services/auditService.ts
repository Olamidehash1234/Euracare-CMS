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
    return apiClient.get<{ success: boolean; data: { audits: AuditResponse[] }; meta?: any }>('/audits/', { params })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
  },

  /**
   * Get audit logs for a specific user
   */
  getUserAudits: (userId: string, params?: { page?: number; limit?: number }) => {
    return apiClient.get<{ success: boolean; data: { audits: AuditResponse[] } }>(`/audits/user/${userId}/`, { params })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
  },

  /**
   * Get audit log by ID
   */
  getAuditById: (id: string) => {
    return apiClient.get<{ success: boolean; data: AuditResponse }>(`/audits/${id}/`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
  },

  /**
   * Export audit logs
   */
  exportAudits: (params?: { format?: 'csv' | 'pdf'; filters?: any }) => {
    return apiClient.get('/audits/export/', { params, responseType: 'blob' })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
  },
};

export default auditService;
