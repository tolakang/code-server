import axios from 'axios';

const API_BASE_URL = '/api';

export const fetchFiles = async (path: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/files`, {
      params: { path }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};

export const uploadFile = async (path: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const downloadFile = async (path: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/download`, {
      params: { path },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

export const createDirectory = async (path: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/directory`, { path });
    return response.data;
  } catch (error) {
    console.error('Error creating directory:', error);
    throw error;
  }
};