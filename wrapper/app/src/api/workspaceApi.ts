import axios from 'axios';

const API_BASE_URL = '/api';

export interface Workspace {
  id: string;
  name: string;
  path: string;
  createdAt: string;
}

export const getWorkspaces = async (): Promise<Workspace[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/workspaces`);
    return response.data;
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    throw error;
  }
};

export const createWorkspace = async (name: string, path: string): Promise<Workspace> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/workspaces`, {
      name,
      path
    });
    return response.data;
  } catch (error) {
    console.error('Error creating workspace:', error);
    throw error;
  }
};

export const deleteWorkspace = async (workspaceId: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/workspaces/${workspaceId}`);
  } catch (error) {
    console.error('Error deleting workspace:', error);
    throw error;
  }
};

export const switchWorkspace = async (workspaceId: string): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/workspaces/${workspaceId}/switch`);
  } catch (error) {
    console.error('Error switching workspace:', error);
    throw error;
  }
};