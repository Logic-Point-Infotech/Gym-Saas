// src/api/nutritionApi.js
import client from './client';

export const getTodayLog = async () => {
  const response = await client.get('/nutrition/log/today');
  return response.data;
};

export const logMeal = async (mealData) => {
  const response = await client.post('/nutrition/meal', mealData);
  return response.data;
};

export const getNutritionHistory = async () => {
  const response = await client.get('/nutrition/history');
  return response.data;
};
