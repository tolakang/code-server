import axios from 'axios';

const NOTIFICATIONS_API_BASE_URL = '/api/notifications';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  updated_at?: string;
}

export const getNotifications = async (params?: {
  user_id?: string;
  unread_only?: boolean;
}): Promise<Notification[]> => {
  try {
    const response = await axios.get(`${NOTIFICATIONS_API_BASE_URL}`, {
      params: { ...params, unread_only: params?.unread_only ? 'true' : undefined },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const response = await axios.get(`${NOTIFICATIONS_API_BASE_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    throw error;
  }
};

export const createNotification = async (data: {
  user_id: string;
  title: string;
  message: string;
  type: string;
}): Promise<Notification> => {
  try {
    const response = await axios.post(`${NOTIFICATIONS_API_BASE_URL}`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const markAsRead = async (notificationId: string): Promise<Notification> => {
  try {
    const response = await axios.patch(`${NOTIFICATIONS_API_BASE_URL}/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllAsRead = async (userId: string): Promise<void> => {
  try {
    await axios.patch(`${NOTIFICATIONS_API_BASE_URL}/read-all/${userId}`);
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await axios.delete(`${NOTIFICATIONS_API_BASE_URL}/${notificationId}`);
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};
