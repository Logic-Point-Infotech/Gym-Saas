// \u2500\u2500\u2500 API Service \u2014 Zenith AI Trainer Portal v2.0 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const BASE_URL = 'http://localhost:3000';

async function request(method, path, body = null) {
  try {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) opts.body = JSON.stringify(body);
    const res  = await fetch(`${BASE_URL}${path}`, opts);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
    return json;
  } catch (err) {
    console.error(`[API] ${method} ${path} failed:`, err.message);
    throw err;
  }
}

// \u2500\u2500\u2500 Users \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
export const usersApi = {
  getAll:  (role) => request('GET', `/api/users${role ? `?role=${role}` : ''}`),
  getById: (id)   => request('GET', `/api/users/${id}`),
  create:  (data) => request('POST', '/api/users', data),
  update:  (id, data) => request('PUT', `/api/users/${id}`, data),
  delete:  (id)   => request('DELETE', `/api/users/${id}`),
};

// \u2500\u2500\u2500 Memberships \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
export const membershipsApi = {
  getAll:      (status) => request('GET', `/api/memberships${status ? `?status=${status}` : ''}`),
  getById:     (id)     => request('GET', `/api/memberships/${id}`),
  getByClient: (cId)    => request('GET', `/api/memberships/client/${cId}`),
  create:      (data)   => request('POST', '/api/memberships', data),
  update:      (id, data) => request('PUT', `/api/memberships/${id}`, data),
  delete:      (id)     => request('DELETE', `/api/memberships/${id}`),
};

// \u2500\u2500\u2500 Trainer Allocations \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
export const allocationsApi = {
  getAll:       ()    => request('GET', '/api/allocations'),
  getByTrainer: (tId) => request('GET', `/api/allocations/trainer/${tId}`),
  getByClient:  (cId) => request('GET', `/api/allocations/client/${cId}`),
  assign:       (data) => request('POST', '/api/allocations', data),
  remove:       (id)  => request('DELETE', `/api/allocations/${id}`),
};

// \u2500\u2500\u2500 Health Metrics \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
export const healthApi = {
  getAll:      ()          => request('GET', '/api/health-metrics'),
  getById:     (id)        => request('GET', `/api/health-metrics/${id}`),
  getByClient: (cId)       => request('GET', `/api/health-metrics/client/${cId}`),
  log:         (data)      => request('POST', '/api/health-metrics', data),
  update:      (id, data)  => request('PUT', `/api/health-metrics/${id}`, data),
  delete:      (id)        => request('DELETE', `/api/health-metrics/${id}`),
};

// \u2500\u2500\u2500 Nutrition Logs \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
export const nutritionApi = {
  getAll:      ()          => request('GET', '/api/nutrition'),
  getById:     (id)        => request('GET', `/api/nutrition/${id}`),
  getByClient: (cId)       => request('GET', `/api/nutrition/client/${cId}`),
  log:         (data)      => request('POST', '/api/nutrition', data),
  update:      (id, data)  => request('PUT', `/api/nutrition/${id}`, data),
  delete:      (id)        => request('DELETE', `/api/nutrition/${id}`),
};

// \u2500\u2500\u2500 Workout Plans \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
export const workoutsApi = {
  getAll:      (category)  => request('GET', `/api/workouts${category ? `?category=${category}` : ''}`),
  getById:     (id)        => request('GET', `/api/workouts/${id}`),
  getByClient: (cId)       => request('GET', `/api/workouts/client/${cId}`),
  create:      (data)      => request('POST', '/api/workouts', data),
  update:      (id, data)  => request('PUT', `/api/workouts/${id}`, data),
  delete:      (id)        => request('DELETE', `/api/workouts/${id}`),
  assign:      (id, data)  => request('POST', `/api/workouts/${id}/assign`, data),
};

// \u2500\u2500\u2500 AI / ML Endpoints \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
export const aiApi = {
  // Gemini-powered analysis
  nutritionAnalyze:  (food_description) =>
    request('POST', '/api/ai/nutrition-analyze', { food_description }),
  workoutRecommend:  (client_id) =>
    request('POST', '/api/ai/workout-recommend', { client_id }),
  healthInsights:    (client_id) =>
    request('POST', '/api/ai/health-insights', { client_id }),
  healthSummary:     (client_id) =>
    request('POST', '/api/ai/health-summary', { client_id }),
  dailyBriefing:     (trainer_name) =>
    request('POST', '/api/ai/daily-briefing', { trainer_name }),
  chat:              (message, history) =>
    request('POST', '/api/ai/chat', { message, history }),

  // Rule-based ML (no Gemini)
  riskScores:        () => request('GET', '/api/ai/risk-scores'),
};
