// src/api/profileApi.js
import client from './client';

export const getProfile = async () => {
  const response = await client.get('/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await client.put('/profile', profileData);
  return response.data;
};

export const getMemberHistory = async () => {
  const response = await client.get('/profile/member-history');
  return response.data;
};
