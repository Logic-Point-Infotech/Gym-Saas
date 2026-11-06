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

// ==========================================
// AUTOMATION 3: Automated Nutrition Tracking
// ==========================================
export const analyzeMealPhoto = async ({ imageUri, imageBase64, mealType = 'auto', autoLog = true }) => {
  if (imageUri) {
    const formData = new FormData();
    formData.append('meal_photo', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'meal.jpg',
    });
    formData.append('meal_type', mealType);
    formData.append('auto_log', String(autoLog));

    const response = await client.post('/nutrition/analyze-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  const response = await client.post('/nutrition/analyze-photo', {
    image_base64: imageBase64,
    meal_type: mealType,
    auto_log: autoLog,
  });
  return response.data;
};
