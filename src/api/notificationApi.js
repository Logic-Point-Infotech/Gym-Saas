// src/api/notificationApi.js
import client from './client';

export const getNotifications = async () => {
  const response = await client.get('/notifications');
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await client.put(`/notifications/${id}/read`);
  return response.data;
};
