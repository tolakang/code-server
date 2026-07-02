import axios from 'axios';

const AUDIT_API_BASE_URL = '/api/audit';

export interface AuditLog {
  id: string;
  action: string;
  resourceType: string;
  resourceId: string;
  userId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  details: any;
}

export const getAuditLogs = async (): Promise<AuditLog[]> => {
  try {
    const response = await axios.get(`${AUDIT_API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};

export const getAuditLogsByUser = async (userId: string): Promise<AuditLog[]> => {
  try {
    const response = await axios.get(`${AUDIT_API_BASE_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching audit logs by user:', error);
    throw error;
  }
};

export const getAuditLogsByResource = async (resourceType: string, resourceId: string): Promise<AuditLog[]> => {
  try {
    const response = await axios.get(`${AUDIT_API_BASE_URL}/resource/${resourceType}/${resourceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching audit logs by resource:', error);
    throw error;
  }
};

export const searchAuditLogs = async (query: string): Promise<AuditLog[]> => {
  try {
    const response = await axios.get(`${AUDIT_API_BASE_URL}/search`, {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching audit logs:', error);
    throw error;
  }
};

export const exportAuditLogs = async (format: 'csv' | 'json'): Promise<Blob> => {
  try {
    const response = await axios.get(`${AUDIT_API_BASE_URL}/export`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting audit logs:', error);
    throw error;
  }
};

export const getAuditSummary = async (): Promise<{
  totalLogs: number;
  logsByAction: Record<string, number>;
  logsByResourceType: Record<string, number>;
}> => {
  try {
    const response = await axios.get(`${AUDIT_API_BASE_URL}/summary`);
    return response.data;
  } catch (error) {
    console.error('Error fetching audit summary:', error);
    throw error;
  }
};