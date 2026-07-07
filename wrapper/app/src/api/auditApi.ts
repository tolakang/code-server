import axios from 'axios';

const AUDIT_API_BASE_URL = '/api/audit';

export interface AuditLog {
  id: string;
  user_id: string;
  username?: string;
  action: string;
  resource: string;
  details: any;
  ip_address: string;
  created_at: string;
}

export const getAuditLogs = async (params?: {
  user_id?: string;
  action?: string;
  resource?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}): Promise<{ logs: AuditLog[]; total: number }> => {
  try {
    const response = await axios.get(`${AUDIT_API_BASE_URL}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};

export const getAuditSummary = async (): Promise<{
  total: number;
  today: number;
  byAction: { action: string; count: number }[];
  byResource: { resource: string; count: number }[];
}> => {
  try {
    const response = await axios.get(`${AUDIT_API_BASE_URL}/summary`);
    return response.data;
  } catch (error) {
    console.error('Error fetching audit summary:', error);
    throw error;
  }
};

export const exportAuditLogs = async (): Promise<Blob> => {
  try {
    const response = await axios.get(`${AUDIT_API_BASE_URL}/export`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting audit logs:', error);
    throw error;
  }
};

export const createAuditLog = async (data: {
  user_id: string;
  action: string;
  resource: string;
  details?: any;
  ip_address?: string;
}): Promise<AuditLog> => {
  try {
    const response = await axios.post(`${AUDIT_API_BASE_URL}`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating audit log:', error);
    throw error;
  }
};
