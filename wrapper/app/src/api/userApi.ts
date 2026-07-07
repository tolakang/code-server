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

function fromSnakeCase(user: any): User {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.full_name,
    role: user.role,
    status: user.status,
    lastLogin: user.last_login,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

function toSnakeCase(data: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    const snakeKey = key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
    result[snakeKey] = value;
  }
  return result;
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(`${USER_API_BASE_URL}`);
    return response.data.map(fromSnakeCase);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUser = async (userId: string): Promise<User> => {
  try {
    const response = await axios.get(`${USER_API_BASE_URL}/${userId}`);
    return fromSnakeCase(response.data);
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin'>): Promise<User> => {
  try {
    const response = await axios.post(`${USER_API_BASE_URL}`, toSnakeCase(userData));
    return fromSnakeCase(response.data);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  try {
    const response = await axios.put(`${USER_API_BASE_URL}/${userId}`, toSnakeCase(userData));
    return fromSnakeCase(response.data);
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
    return response.data.map(fromSnakeCase);
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