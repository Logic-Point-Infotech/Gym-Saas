// src/api/authApi.js
import client from './client';

export const registerUser = async (userData) => {
  const response = await client.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (member_id, password) => {
  const response = await client.post('/auth/login', { member_id, password });
  return response.data;
};
