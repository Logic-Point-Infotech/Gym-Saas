// src/api/healthApi.js
import client from './client';

export const getHealthMetrics = async () => {
  const response = await client.get('/health/metrics');
  return response.data;
};

export const logHealthMetrics = async (metricsData) => {
  const response = await client.post('/health/metrics', metricsData);
  return response.data;
};

export const uploadBloodReport = async (file) => {
  const formData = new FormData();
  formData.append('blood_report', {
    uri: file.uri,
    type: file.type,
    name: file.name,
  });

  const response = await client.post('/health/blood-report', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
