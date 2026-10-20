// src/trainer/services/api.js
import client from '../../api/client';
import { clientsData, workoutsData, dashboardData } from '../data/mockData';

async function request(method, path, body = null, fallbackData = null) {
  try {
    const res = await client.request({
      method,
      url: path,
      data: body,
    });
    return res.data;
  } catch (err) {
    if (fallbackData !== null) {
      console.warn(`[Trainer Service Fallback] ${method} ${path} failed (${err.message}). Using local mock fallback.`);
      return fallbackData;
    }
    throw err;
  }
}

export const usersApi = {
  getAll:  (role) => request('GET', `/users${role ? `?role=${role}` : ''}`, null, { count: clientsData.length, data: clientsData }),
  getById: (id)   => request('GET', `/users/${id}`, null, { data: clientsData[0] }),
  create:  (data) => request('POST', '/users', data, { id: Date.now(), ...data }),
  update:  (id, data) => request('PUT', `/users/${id}`, data, { message: 'Updated' }),
  delete:  (id)   => request('DELETE', `/users/${id}`, null, { message: 'Deleted' }),
};

export const membershipsApi = {
  getAll:      (status) => request('GET', `/memberships${status ? `?status=${status}` : ''}`, null, { count: 18, data: [] }),
  getById:     (id)     => request('GET', `/memberships/${id}`, null, { id, status: 'active' }),
  getByClient: (cId)    => request('GET', `/memberships/client/${cId}`, null, { status: 'active' }),
  create:      (data)   => request('POST', '/memberships', data, { id: Date.now(), ...data }),
  update:      (id, data) => request('PUT', `/memberships/${id}`, data, { message: 'Updated' }),
  delete:      (id)     => request('DELETE', `/memberships/${id}`, null, { message: 'Deleted' }),
};

export const allocationsApi = {
  getAll:       ()    => request('GET', '/allocations', null, { count: 12, data: [] }),
  getByTrainer: (tId) => request('GET', `/allocations/trainer/${tId}`, null, { count: 5, data: [] }),
  getByClient:  (cId) => request('GET', `/allocations/client/${cId}`, null, { data: [] }),
  assign:       (data) => request('POST', '/allocations', data, { id: Date.now(), ...data }),
  remove:       (id)  => request('DELETE', `/allocations/${id}`, null, { message: 'Removed' }),
};

export const healthApi = {
  getAll:      ()          => request('GET', '/health-metrics', null, { count: 10, data: [] }),
  getById:     (id)        => request('GET', `/health-metrics/${id}`, null, { weight_kg: 70 }),
  getByClient: (cId)       => request('GET', `/health-metrics/client/${cId}`, null, { data: [] }),
  log:         (data)      => request('POST', '/health-metrics', data, { id: Date.now(), ...data }),
  update:      (id, data)  => request('PUT', `/health-metrics/${id}`, data, { message: 'Updated' }),
  delete:      (id)        => request('DELETE', `/health-metrics/${id}`, null, { message: 'Deleted' }),
};

export const nutritionApi = {
  getAll:      ()          => request('GET', '/nutrition', null, { count: 5, data: [] }),
  getById:     (id)        => request('GET', `/nutrition/${id}`, null, { calories: 450 }),
  getByClient: (cId)       => request('GET', `/nutrition/client/${cId}`, null, { data: [] }),
  log:         (data)      => request('POST', '/nutrition', data, { id: Date.now(), ...data }),
  update:      (id, data)  => request('PUT', `/nutrition/${id}`, data, { message: 'Updated' }),
  delete:      (id)        => request('DELETE', `/nutrition/${id}`, null, { message: 'Deleted' }),
};

export const workoutsApi = {
  getAll:      (category)  => request('GET', `/workouts${category ? `?category=${category}` : ''}`, null, { count: workoutsData.length, data: workoutsData }),
  getById:     (id)        => request('GET', `/workouts/${id}`, null, workoutsData[0]),
  getByClient: (cId)       => request('GET', `/workouts/client/${cId}`, null, { data: workoutsData }),
  create:      (data)      => request('POST', '/workouts', data, { id: Date.now(), ...data }),
  update:      (id, data)  => request('PUT', `/workouts/${id}`, data, { message: 'Updated' }),
  delete:      (id)        => request('DELETE', `/workouts/${id}`, null, { message: 'Deleted' }),
  assign:      (id, data)  => request('POST', `/workouts/${id}/assign`, data, { message: 'Assigned' }),
};

export const aiApi = {
  nutritionAnalyze:  (food_description) =>
    request('POST', '/ai/nutrition-analyze', { food_description }, {
      meal_name: food_description,
      calories: 450,
      protein: 35,
      carbs: 40,
      fats: 12,
      health_score: 9,
      tips: ['Optimal macro distribution']
    }),
  workoutRecommend:  (client_id) =>
    request('POST', '/ai/workout-recommend', { client_id }, {
      rationale: 'Targeted hypertrophy program based on recovery history',
      difficulty: 'Intermediate',
      plan: [
        { exercise: 'Barbell Squat', sets: 4, reps: 10, rest: '90s' },
        { exercise: 'Romanian Deadlift', sets: 3, reps: 12, rest: '60s' }
      ]
    }),
  healthInsights:    (client_id) =>
    request('POST', '/ai/health-insights', { client_id }, {
      narrative: 'Client metrics demonstrate steady weight loss progress with optimal recovery scores.',
      alerts: [{ type: 'info', message: 'Hydration level optimal' }],
      recommendations: ['Maintain current calorie deficit', 'Ensure 8h sleep nightly']
    }),
  healthSummary:     (client_id) =>
    request('POST', '/ai/health-summary', { client_id }, { narrative: 'Health metrics optimal' }),
  dailyBriefing:     (trainer_name) =>
    request('POST', '/ai/daily-briefing', { trainer_name }, {
      data: {
        greeting: `Good Morning, ${trainer_name || 'Coach Uday'}!`,
        summary: 'All client schedules and nutrition plans are updated for today. 3 client renewals are upcoming.',
        priorities: [
          'Review Sarah Chen blood report upload',
          'Send renewal reminder to Tom Bradley',
          'Check Marcus Vane recovery score'
        ],
        motivational_tip: 'Consistency builds character both inside and outside the gym.',
        ai_generated: true
      }
    }),
  chat:              (message, history) =>
    request('POST', '/ai/chat', { message, history }, {
      data: { reply: 'I am your Zenith AI Assistant. How can I help you manage your clients today?' }
    }),
  riskScores:        () => request('GET', '/ai/risk-scores', null, {
    summary: { high: 1, medium: 2, low: 3, total: 6 },
    data: clientsData.map(c => ({ id: c.id, name: c.name, risk: 'low' }))
  }),
};
