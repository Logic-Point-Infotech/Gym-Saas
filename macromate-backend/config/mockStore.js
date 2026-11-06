// macromate-backend/config/mockStore.js
// High-fidelity fallback datastore for resilient offline/sandbox operation

const mockData = {
  gyms: [
    { id: 1, name: 'MacroMate Headquarters', address: '123 Fitness Ave, Tech City', location_lat: 18.5204, location_lng: 73.8567 },
  ],
  users: [
    { id: 1, name: 'System Admin', email: 'admin@macromate.com', password_hash: '$2a$10$7vNfMscYfI1m9U4aA6f8e.E4O7UqB8P0f6iK2n.t8vS6Y/5zRk9G', role: 'admin', member_id: 'MM-2026-A0001' },
    { id: 2, name: 'Coach Uday', email: 'trainer@macromate.com', password_hash: '$2a$10$xaabKJjmzb1xyoquV1QcZeXMpJDZi4VHddg2LAE5NckOVgHqO/6By', role: 'trainer', member_id: 'MM-2026-T0001' },
    { id: 3, name: 'Rahul Sharma', email: 'client@macromate.com', password_hash: '$2a$10$xaabKJjmzb1xyoquV1QcZeXMpJDZi4VHddg2LAE5NckOVgHqO/6By', role: 'client', member_id: 'MM-2026-00001' },
    { id: 4, name: 'Sarah Chen', email: 'sarah@chen.fit', password_hash: '$2a$10$xaabKJjmzb1xyoquV1QcZeXMpJDZi4VHddg2LAE5NckOVgHqO/6By', role: 'client', member_id: 'MM-2026-00002' },
    { id: 5, name: 'Tom Bradley', email: 'tom@bradley.dev', password_hash: '$2a$10$xaabKJjmzb1xyoquV1QcZeXMpJDZi4VHddg2LAE5NckOVgHqO/6By', role: 'client', member_id: 'MM-2026-00003' },
    { id: 6, name: 'Marcus Vane', email: 'marcus@vane.co', password_hash: '$2a$10$xaabKJjmzb1xyoquV1QcZeXMpJDZi4VHddg2LAE5NckOVgHqO/6By', role: 'client', member_id: 'MM-2026-00004' },
  ],
  client_profiles: [
    { id: 1, client_id: 3, age: 26, gender: 'male', height_cm: 175, weight_kg: 73.2, bmi: 23.9, fitness_goal: 'fat_loss', dietary_preference: 'non_veg', activity_level: 'moderate', daily_calorie_target: 2200 },
    { id: 2, client_id: 4, age: 28, gender: 'female', height_cm: 165, weight_kg: 58.0, bmi: 21.3, fitness_goal: 'muscle_gain', dietary_preference: 'veg', activity_level: 'high', daily_calorie_target: 1950 },
    { id: 3, client_id: 5, age: 34, gender: 'male', height_cm: 180, weight_kg: 84.5, bmi: 26.1, fitness_goal: 'fat_loss', dietary_preference: 'non_veg', activity_level: 'low', daily_calorie_target: 2100 },
    { id: 4, client_id: 6, age: 24, gender: 'male', height_cm: 178, weight_kg: 71.0, bmi: 22.4, fitness_goal: 'strength', dietary_preference: 'non_veg', activity_level: 'high', daily_calorie_target: 2500 },
  ],
  memberships: [
    { id: 1, client_id: 3, plan_id: 1, start_date: '2026-01-01', end_date: '2026-12-15', status: 'active', amount_paid: 12000 },
    { id: 2, client_id: 4, plan_id: 1, start_date: '2026-02-01', end_date: '2026-11-20', status: 'active', amount_paid: 12000 },
    { id: 3, client_id: 5, plan_id: 1, start_date: '2026-01-10', end_date: '2026-11-10', status: 'expired', amount_paid: 12000 },
    { id: 4, client_id: 6, plan_id: 1, start_date: '2026-03-01', end_date: '2026-11-12', status: 'active', amount_paid: 12000 },
  ],
  trainer_allocations: [
    { id: 1, client_id: 3, trainer_id: 2, assigned_at: '2026-01-01T00:00:00Z' },
    { id: 2, client_id: 4, trainer_id: 2, assigned_at: '2026-02-01T00:00:00Z' },
    { id: 3, client_id: 5, trainer_id: 2, assigned_at: '2026-01-10T00:00:00Z' },
    { id: 4, client_id: 6, trainer_id: 2, assigned_at: '2026-03-01T00:00:00Z' },
  ],
  client_health_metrics: [
    { id: 1, client_id: 3, weight_kg: 75.6, bmi: 24.7, body_fat_percentage: 19.8, muscle_mass_kg: 33.2, blood_report_url: null, blood_report_json: null, notes: 'Day 1 initial measurement', recorded_at: new Date(Date.now() - 28 * 86400000).toISOString() },
    { id: 2, client_id: 3, weight_kg: 75.0, bmi: 24.5, body_fat_percentage: 19.4, muscle_mass_kg: 33.4, blood_report_url: null, blood_report_json: null, notes: 'Week 1 progress check', recorded_at: new Date(Date.now() - 21 * 86400000).toISOString() },
    { id: 3, client_id: 3, weight_kg: 74.2, bmi: 24.2, body_fat_percentage: 18.9, muscle_mass_kg: 33.6, blood_report_url: null, blood_report_json: null, notes: 'Week 2 steady progress', recorded_at: new Date(Date.now() - 14 * 86400000).toISOString() },
    { id: 4, client_id: 3, weight_kg: 73.8, bmi: 24.1, body_fat_percentage: 18.4, muscle_mass_kg: 33.7, blood_report_url: null, blood_report_json: null, notes: 'Week 3 check-in', recorded_at: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: 5, client_id: 3, weight_kg: 73.2, bmi: 23.9, body_fat_percentage: 17.9, muscle_mass_kg: 33.9, blood_report_url: 'uploads/blood_reports/rahul_annual.pdf', blood_report_json: JSON.stringify({ vitamin_d: { value: 18, unit: 'ng/mL', status: 'Low' }, cholesterol: { value: 182, unit: 'mg/dL', status: 'Normal' }, hemoglobin: { value: 14.2, unit: 'g/dL', status: 'Normal' }, blood_sugar: { value: 92, unit: 'mg/dL', status: 'Normal' }, calcium: { value: 9.1, unit: 'mg/dL', status: 'Normal' } }), notes: 'Latest check-in with blood report', recorded_at: new Date().toISOString() },
    // Sarah Chen (client 4) - Lean muscle gain progress
    { id: 6, client_id: 4, weight_kg: 57.0, bmi: 20.9, body_fat_percentage: 21.0, muscle_mass_kg: 26.2, blood_report_url: null, blood_report_json: null, notes: 'Initial lean gain check-in', recorded_at: new Date(Date.now() - 21 * 86400000).toISOString() },
    { id: 7, client_id: 4, weight_kg: 58.0, bmi: 21.3, body_fat_percentage: 20.0, muscle_mass_kg: 27.2, blood_report_url: null, blood_report_json: null, notes: '+1kg muscle mass gained', recorded_at: new Date().toISOString() },
    // Tom Bradley (client 5) - Weight loss plateau & inactivity
    { id: 8, client_id: 5, weight_kg: 84.5, bmi: 26.1, body_fat_percentage: 24.5, muscle_mass_kg: 35.0, blood_report_url: null, blood_report_json: null, notes: 'Initial check-in', recorded_at: new Date(Date.now() - 21 * 86400000).toISOString() },
    { id: 9, client_id: 5, weight_kg: 84.5, bmi: 26.1, body_fat_percentage: 24.5, muscle_mass_kg: 35.0, blood_report_url: null, blood_report_json: null, notes: 'Unchanged weight', recorded_at: new Date().toISOString() },
    // Marcus Vane (client 6) - Strength phase
    { id: 10, client_id: 6, weight_kg: 71.5, bmi: 22.6, body_fat_percentage: 16.5, muscle_mass_kg: 34.0, blood_report_url: null, blood_report_json: null, notes: 'Strength check-in', recorded_at: new Date(Date.now() - 14 * 86400000).toISOString() },
    { id: 11, client_id: 6, weight_kg: 71.0, bmi: 22.4, body_fat_percentage: 16.0, muscle_mass_kg: 34.2, blood_report_url: null, blood_report_json: null, notes: 'Steady strength progress', recorded_at: new Date().toISOString() },
  ],
  daily_nutrition_logs: [
    { id: 1, client_id: 3, log_date: new Date().toISOString().split('T')[0], total_calories: 2140, total_protein: 152, total_carbs: 220, total_fat: 58 },
    { id: 2, client_id: 3, log_date: new Date(Date.now() - 86400000).toISOString().split('T')[0], total_calories: 2190, total_protein: 148, total_carbs: 230, total_fat: 62 },
    { id: 3, client_id: 3, log_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], total_calories: 2080, total_protein: 155, total_carbs: 210, total_fat: 54 },
    { id: 4, client_id: 3, log_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], total_calories: 2220, total_protein: 160, total_carbs: 225, total_fat: 60 },
  ],
  meal_entries: [
    { id: 1, log_id: 1, meal_type: 'Breakfast', detected_foods: JSON.stringify(['Eggs Omelet (3 whites, 1 whole)', 'Whole Wheat Toast (2 slices)', 'Black Coffee']), total_calories: 380, total_protein: 26, total_carbs: 32, total_fat: 10, image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500', logged_at: new Date(Date.now() - 4 * 3600000).toISOString() },
    { id: 2, log_id: 1, meal_type: 'Lunch', detected_foods: JSON.stringify(['Grilled Chicken Breast (180g)', 'Brown Rice (1 cup)', 'Dal Tadka (1 bowl)', 'Green Salad']), total_calories: 680, total_protein: 58, total_carbs: 72, total_fat: 14, image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500', logged_at: new Date(Date.now() - 1 * 3600000).toISOString() },
    { id: 3, log_id: 1, meal_type: 'Evening Snack', detected_foods: JSON.stringify(['Whey Protein Shake', 'Almonds (10 pcs)']), total_calories: 240, total_protein: 30, total_carbs: 8, total_fat: 8, image_url: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500', logged_at: new Date().toISOString() },
  ],
  workout_plans: [
    { id: 1, client_id: 3, title: 'Hypertrophy & Shred Alpha', split_type: 'Push-Pull-Legs', is_published: true, created_at: new Date().toISOString() },
  ],
  workout_days: [
    { id: 1, plan_id: 1, day_name: 'Day 1', focus: 'Push (Chest, Shoulders, Triceps)', day_number: 1 },
    { id: 2, plan_id: 1, day_name: 'Day 2', focus: 'Pull (Back, Biceps, Rear Delts)', day_number: 2 },
    { id: 3, plan_id: 1, day_name: 'Day 3', focus: 'Legs & Core', day_number: 3 },
  ],
  workout_day_exercises: [
    { id: 1, day_id: 1, exercise_id: 1, sets: 4, reps: 10, rest_seconds: 90, order_index: 1 },
    { id: 2, day_id: 1, exercise_id: 7, sets: 3, reps: 12, rest_seconds: 60, order_index: 2 },
    { id: 3, day_id: 1, exercise_id: 11, sets: 3, reps: 15, rest_seconds: 45, order_index: 3 },
  ],
  exercises: [
    { id: 1, name: 'Barbell Bench Press', muscle_group: 'Chest', equipment: 'Barbell' },
    { id: 7, name: 'Overhead Shoulder Press', muscle_group: 'Shoulders', equipment: 'Dumbbells' },
    { id: 11, name: 'Cable Tricep Pushdown', muscle_group: 'Triceps', equipment: 'Cable' },
  ],
  workout_logs: [
    { id: 1, client_id: 3, plan_id: 1, day_id: 1, logged_date: new Date().toISOString().split('T')[0], duration_minutes: 52, notes: 'Solid pump, progressive overload on press', completed_sets: 10 },
    { id: 2, client_id: 3, plan_id: 1, day_id: 2, logged_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], duration_minutes: 48, notes: 'Heavy back session', completed_sets: 9 },
    { id: 3, client_id: 3, plan_id: 1, day_id: 3, logged_date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], duration_minutes: 55, notes: 'Squat day completed', completed_sets: 10 },
    // Sarah Chen (client 4) - 4 workouts this week (consistent!)
    { id: 4, client_id: 4, plan_id: 1, day_id: 1, logged_date: new Date().toISOString().split('T')[0], duration_minutes: 45, notes: 'Upper body hypertrophy', completed_sets: 12 },
    { id: 5, client_id: 4, plan_id: 1, day_id: 2, logged_date: new Date(Date.now() - 86400000).toISOString().split('T')[0], duration_minutes: 50, notes: 'Leg hypertrophy', completed_sets: 14 },
    { id: 6, client_id: 4, plan_id: 1, day_id: 3, logged_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], duration_minutes: 45, notes: 'Core & glutes', completed_sets: 10 },
    { id: 7, client_id: 4, plan_id: 1, day_id: 1, logged_date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0], duration_minutes: 40, notes: 'Conditioning', completed_sets: 8 },
    // Tom Bradley (client 5) - Inactive (1 workout in last 7 days)
    { id: 8, client_id: 5, plan_id: 1, day_id: 1, logged_date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0], duration_minutes: 30, notes: 'Cut session short', completed_sets: 4 },
    // Marcus Vane (client 6) - 3 workouts
    { id: 9, client_id: 6, plan_id: 1, day_id: 1, logged_date: new Date().toISOString().split('T')[0], duration_minutes: 60, notes: 'Heavy bench 100kg', completed_sets: 12 },
    { id: 10, client_id: 6, plan_id: 1, day_id: 2, logged_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], duration_minutes: 55, notes: 'Deadlifts 140kg', completed_sets: 10 },
    { id: 11, client_id: 6, plan_id: 1, day_id: 3, logged_date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], duration_minutes: 50, notes: 'Squats 120kg', completed_sets: 10 },
  ],
  notifications: [
    { id: 1, user_id: 3, title: 'Automated Health Report Ready', message: 'Your weekly AI health report has been generated! Health score: 88/100.', type: 'SYSTEM', is_read: false, created_at: new Date().toISOString() },
    { id: 2, user_id: 3, title: 'Coach Nudge', message: 'Coach Uday noted your 4-day workout streak. Keep it up!', type: 'TRAINER_MESSAGE', is_read: false, created_at: new Date().toISOString() },
  ],
  automated_health_reports: [],
  trainer_alerts: [],
};

let autoIncrement = {
  users: 10,
  client_profiles: 10,
  memberships: 10,
  trainer_allocations: 10,
  client_health_metrics: 10,
  daily_nutrition_logs: 10,
  meal_entries: 10,
  workout_logs: 10,
  notifications: 10,
  automated_health_reports: 1,
  trainer_alerts: 1,
};

module.exports = {
  mockData,
  autoIncrement,
};
