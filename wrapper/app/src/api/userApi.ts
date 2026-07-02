import axios from 'axios';

const USER_API_BASE_URL = '/api/users';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(`${USER_API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUser = async (userId: string): Promise<User> => {
  try {
    const response = await axios.get(`${USER_API_BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin'>): Promise<User> => {
  try {
    const response = await axios.post(`${USER_API_BASE_URL}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  try {
    const response = await axios.put(`${USER_API_BASE_URL}/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await axios.delete(`${USER_API_BASE_URL}/${userId}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const searchUsers = async (query: string): Promise<User[]> => {
  try {
    const response = await axios.get(`${USER_API_BASE_URL}/search`, {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

export const getUserRoles = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${USER_API_BASE_URL}/roles`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user roles:', error);
    throw error;
  }
};

export const getUserStatuses = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${USER_API_BASE_URL}/statuses`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user statuses:', error);
    throw error;
  }
};