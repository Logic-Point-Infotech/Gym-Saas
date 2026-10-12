// src/trainer/services/api.js
import client from '../../api/client';

async function request(method, path, body = null) {
  try {
    const opts = { method };
    if (body) opts.data = body;
    const res = await client.request({
      method,
      url: path,
      data: body,
    });
    return res.data;
  } catch (err) {
    console.error(`[Trainer API] ${method} ${path} failed:`, err.message);
    throw err;
  }
}

export const usersApi = {
  getAll:  (role) => request('GET', `/users${role ? `?role=${role}` : ''}`),
  getById: (id)   => request('GET', `/users/${id}`),
  create:  (data) => request('POST', '/users', data),
  update:  (id, data) => request('PUT', `/users/${id}`, data),
  delete:  (id)   => request('DELETE', `/users/${id}`),
};

export const membershipsApi = {
  getAll:      (status) => request('GET', `/memberships${status ? `?status=${status}` : ''}`),
  getById:     (id)     => request('GET', `/memberships/${id}`),
  getByClient: (cId)    => request('GET', `/memberships/client/${cId}`),
  create:      (data)   => request('POST', '/memberships', data),
  update:      (id, data) => request('PUT', `/memberships/${id}`, data),
  delete:      (id)     => request('DELETE', `/memberships/${id}`),
};

export const allocationsApi = {
  getAll:       ()    => request('GET', '/allocations'),
  getByTrainer: (tId) => request('GET', `/allocations/trainer/${tId}`),
  getByClient:  (cId) => request('GET', `/allocations/client/${cId}`),
  assign:       (data) => request('POST', '/allocations', data),
  remove:       (id)  => request('DELETE', `/allocations/${id}`),
};

export const healthApi = {
  getAll:      ()          => request('GET', '/health-metrics'),
  getById:     (id)        => request('GET', `/health-metrics/${id}`),
  getByClient: (cId)       => request('GET', `/health-metrics/client/${cId}`),
  log:         (data)      => request('POST', '/health-metrics', data),
  update:      (id, data)  => request('PUT', `/health-metrics/${id}`, data),
  delete:      (id)        => request('DELETE', `/health-metrics/${id}`),
};

export const nutritionApi = {
  getAll:      ()          => request('GET', '/nutrition'),
  getById:     (id)        => request('GET', `/nutrition/${id}`),
  getByClient: (cId)       => request('GET', `/nutrition/client/${cId}`),
  log:         (data)      => request('POST', '/nutrition', data),
  update:      (id, data)  => request('PUT', `/nutrition/${id}`, data),
  delete:      (id)        => request('DELETE', `/nutrition/${id}`),
};

export const workoutsApi = {
  getAll:      (category)  => request('GET', `/workouts${category ? `?category=${category}` : ''}`),
  getById:     (id)        => request('GET', `/workouts/${id}`),
  getByClient: (cId)       => request('GET', `/workouts/client/${cId}`),
  create:      (data)      => request('POST', '/workouts', data),
  update:      (id, data)  => request('PUT', `/workouts/${id}`, data),
  delete:      (id)        => request('DELETE', `/workouts/${id}`),
  assign:      (id, data)  => request('POST', `/workouts/${id}/assign`, data),
};

export const aiApi = {
  nutritionAnalyze:  (food_description) =>
    request('POST', '/ai/nutrition-analyze', { food_description }),
  workoutRecommend:  (client_id) =>
    request('POST', '/ai/workout-recommend', { client_id }),
  healthInsights:    (client_id) =>
    request('POST', '/ai/health-insights', { client_id }),
  healthSummary:     (client_id) =>
    request('POST', '/ai/health-summary', { client_id }),
  dailyBriefing:     (trainer_name) =>
    request('POST', '/ai/daily-briefing', { trainer_name }),
  chat:              (message, history) =>
    request('POST', '/ai/chat', { message, history }),
  riskScores:        () => request('GET', '/ai/risk-scores'),
};
