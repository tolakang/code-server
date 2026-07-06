import axios from 'axios';

const TEAM_API_BASE_URL = '/api/teams';

export interface Team {
  id: string;
  name: string;
  description?: string;
  members?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const getTeams = async (): Promise<Team[]> => {
  try {
    const response = await axios.get(`${TEAM_API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

export const getTeam = async (teamId: string): Promise<Team> => {
  try {
    const response = await axios.get(`${TEAM_API_BASE_URL}/${teamId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching team:', error);
    throw error;
  }
};

export const createTeam = async (teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<Team> => {
  try {
    const response = await axios.post(`${TEAM_API_BASE_URL}`, teamData);
    return response.data;
  } catch (error) {
    console.error('Error creating team:', error);
    throw error;
  }
};

export const updateTeam = async (teamId: string, teamData: Partial<Team>): Promise<Team> => {
  try {
    const response = await axios.put(`${TEAM_API_BASE_URL}/${teamId}`, teamData);
    return response.data;
  } catch (error) {
    console.error('Error updating team:', error);
    throw error;
  }
};

export const deleteTeam = async (teamId: string): Promise<void> => {
  try {
    await axios.delete(`${TEAM_API_BASE_URL}/${teamId}`);
  } catch (error) {
    console.error('Error deleting team:', error);
    throw error;
  }
};
