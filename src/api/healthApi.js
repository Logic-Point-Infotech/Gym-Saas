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
    type: file.type || 'application/pdf',
    name: file.name || 'blood_report.pdf',
  });

  const response = await client.post('/health/blood-report', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// ==========================================
// AUTOMATION 1: Automated Health Reports
// ==========================================
export const getAutomatedHealthReport = async (clientId = null) => {
  const endpoint = clientId ? `/health/automated-report/${clientId}` : '/health/automated-report';
  const response = await client.get(endpoint);
  return response.data;
};

export const generateAutomatedHealthReport = async (clientId = null) => {
  const response = await client.post('/health/automated-report/generate', { client_id: clientId });
  return response.data;
};

// ==========================================
// AUTOMATION 2: AI Health Analysis
// ==========================================
export const getAIHealthAnalysis = async (clientId = null) => {
  const endpoint = clientId ? `/health/ai-analysis/${clientId}` : '/health/ai-analysis';
  const response = await client.get(endpoint);
  return response.data;
};

// ==========================================
// AUTOMATION 4: Progress Monitoring
// ==========================================
export const getProgressSummary = async (clientId = null, timeframe = 30) => {
  const endpoint = clientId
    ? `/health/progress-summary/${clientId}?timeframe=${timeframe}`
    : `/health/progress-summary?timeframe=${timeframe}`;
  const response = await client.get(endpoint);
  return response.data;
};
