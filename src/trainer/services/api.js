// src/trainer/services/api.js
import client from '../../api/client';
import { clientsData, workoutsData, dashboardData, insightsData } from '../data/mockData';

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

// ==========================================
// AUTOMATION 5: TRAINER AUTOMATION API
// ==========================================
export const trainerAutomationApi = {
  getAutomatedInsights: () => request('GET', '/trainer/automated-insights', null, {
    overview: { total_clients: 4, on_track: 2, at_risk: 1, plateau: 1, milestones: 1, total_alerts: 4 },
    daily_briefing: {
      greeting: 'Good Morning, Coach Uday!',
      summary: 'Automated Gym Intelligence: 4 clients monitored. 3 on track, 1 at risk of dropping off.',
      priorities: [
        'Tom Bradley: Inactivity Risk (Missed 4 days)',
        'Sarah Chen: Severe Calorie Deficit Alert',
        'Marcus Vane: Membership expires in 6 days'
      ],
      motivational_tip: 'Automated tracking eliminates manual reviews and catches dropouts before they happen.'
    },
    client_reports: [
      { client_id: 3, name: 'Rahul Sharma', member_id: 'MM-2026-00001', status: 'Milestone', status_color: '#2DD4BF', health_score: 95, weight_kg: 73.2, weight_delta_kg: -2.4, bmi: 23.9, avg_calories: 2140, weekly_workouts: 4, key_takeaway: 'Milestone: -2.4 kg achieved, 4 sessions/wk, 2140 kcal avg' },
      { client_id: 4, name: 'Sarah Chen', member_id: 'MM-2026-00002', status: 'Needs Review', status_color: '#FF9800', health_score: 72, weight_kg: 58.0, weight_delta_kg: -0.5, bmi: 21.3, avg_calories: 1350, weekly_workouts: 3, key_takeaway: 'Needs Review: High deficit (1350 kcal vs 1950 target)' },
      { client_id: 5, name: 'Tom Bradley', member_id: 'MM-2026-00003', status: 'At Risk', status_color: '#F44336', health_score: 64, weight_kg: 84.5, weight_delta_kg: 0.1, bmi: 26.1, avg_calories: 2300, weekly_workouts: 1, key_takeaway: 'At Risk: Missed 4 sessions this week' },
      { client_id: 6, name: 'Marcus Vane', member_id: 'MM-2026-00004', status: 'On Track', status_color: '#4CAF50', health_score: 88, weight_kg: 71.0, weight_delta_kg: -0.8, bmi: 22.4, avg_calories: 2480, weekly_workouts: 5, key_takeaway: 'On Track: Hypertrophy progression optimal, plan expires in 6 days' }
    ],
    progress_alerts: [
      { id: 'al_1', client_id: 5, client_name: 'Tom Bradley', member_id: 'MM-2026-00003', severity: 'high', type: 'dropout_risk', icon: 'alert-circle', title: 'Tom Bradley: Inactivity Warning', message: 'Only 1 session logged in 7 days. Drop-off risk elevated.', recommended_action: 'Send Motivation Nudge', action_payload: { actionType: 'send_notification', title: 'Session Reminder', message: 'Coach Uday here. Let us get back on schedule today!' } },
      { id: 'al_2', client_id: 4, client_name: 'Sarah Chen', member_id: 'MM-2026-00002', severity: 'medium', type: 'nutrition_risk', icon: 'food-variant', title: 'Sarah Chen: Calorie Deficit Alert', message: 'Average intake is 600 kcal below recommended target.', recommended_action: 'Adjust Calorie Target', action_payload: { actionType: 'update_target', newTarget: 1750 } },
      { id: 'al_3', client_id: 6, client_name: 'Marcus Vane', member_id: 'MM-2026-00004', severity: 'medium', type: 'membership_expiring', icon: 'calendar-clock', title: 'Marcus Vane: Plan Expiring', message: 'Membership expires in 6 days (12 Nov 2026).', recommended_action: 'Send Renewal Reminder', action_payload: { actionType: 'send_notification', title: 'Membership Renewal', message: 'Your gym plan expires soon. Tap to renew with discount.' } },
      { id: 'al_4', client_id: 3, client_name: 'Rahul Sharma', member_id: 'MM-2026-00001', severity: 'positive', type: 'milestone', icon: 'trophy', title: 'Rahul Sharma: Milestone Hit', message: 'Continuous 4-workout streak & -2.4 kg achieved.', recommended_action: 'Send Kudos', action_payload: { actionType: 'send_notification', title: 'Kudos from Coach!', message: 'Amazing work this week! Your progress is top 5% in gym.' } }
    ]
  }),
  getClientReport: (clientId) => request('GET', `/trainer/client-report/${clientId}`, null, null),
  executeQuickAction: (data) => request('POST', '/trainer/quick-action', data, { success: true, message: 'Action executed' }),
};
