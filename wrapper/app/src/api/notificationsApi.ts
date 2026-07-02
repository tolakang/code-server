import axios from 'axios';

const NOTIFICATIONS_API_BASE_URL = '/api/notifications';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  userId?: string;
  teamId?: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await axios.get(`${NOTIFICATIONS_API_BASE_URL}`);
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

export const getTeamNotifications = async (teamId: string): Promise<Notification[]> => {
  try {
    const response = await axios.get(`${NOTIFICATIONS_API_BASE_URL}/team/${teamId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching team notifications:', error);
    throw error;
  }
};

export const createNotification = async (notification: Omit<Notification, 'id' | 'timestamp'>): Promise<Notification> => {
  try {
    const response = await axios.post(`${NOTIFICATIONS_API_BASE_URL}`, notification);
    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  try {
    await axios.patch(`${NOTIFICATIONS_API_BASE_URL}/${notificationId}/read`);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const clearNotifications = async (): Promise<void> => {
  try {
    await axios.delete(`${NOTIFICATIONS_API_BASE_URL}/clear`);
  } catch (error) {
    console.error('Error clearing notifications:', error);
    throw error;
  }
};

export const subscribeToNotifications = async (userId: string, callback: (notification: Notification) => void) => {
  try {
    // In a real implementation, this would set up a WebSocket connection
    // For now, we'll simulate it with a polling mechanism
    const interval = setInterval(async () => {
      try {
        const notifications = await getUserNotifications(userId);
        notifications.forEach(notification => callback(notification));
      } catch (error) {
        console.error('Error polling for notifications:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  } catch (error) {
    console.error('Error subscribing to notifications:', error);
    throw error;
  }
};