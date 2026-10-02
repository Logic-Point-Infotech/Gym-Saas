// src/api/workoutApi.js
import client from './client';

export const getWorkoutPlan = async () => {
  const response = await client.get('/workout/plan');
  return response.data;
};

export const logWorkout = async (logData) => {
  const response = await client.post('/workout/log', logData);
  return response.data;
};

export const getWorkoutHistory = async () => {
  const response = await client.get('/workout/history');
  return response.data;
};
