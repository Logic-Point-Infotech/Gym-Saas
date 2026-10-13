-- macromate-backend/seed_postgres.sql

-- Insert Test Gym
INSERT INTO gyms (id, name, address, location_lat, location_lng)
VALUES (1, 'MacroMate Headquarters', '123 Fitness Ave, Tech City', 18.5204, 73.8567)
ON CONFLICT (id) DO NOTHING;

-- Insert Admin
INSERT INTO users (id, name, email, password_hash, role, member_id)
VALUES (1, 'System Admin', 'admin@macromate.com', '$2a$10$7vNfMscYfI1m9U4aA6f8e.E4O7UqB8P0f6iK2n.t8vS6Y/5zRk9G', 'admin', 'MM-2026-A0001')
ON CONFLICT (id) DO NOTHING;

-- Insert Trainer
INSERT INTO users (id, name, email, password_hash, role, member_id)
VALUES (2, 'Coach Uday', 'trainer@macromate.com', '$2a$10$xaabKJjmzb1xyoquV1QcZeXMpJDZi4VHddg2LAE5NckOVgHqO/6By', 'trainer', 'MM-2026-T0001')
ON CONFLICT (id) DO NOTHING;

-- Insert Client
INSERT INTO users (id, name, email, password_hash, role, member_id)
VALUES (3, 'Rahul Sharma', 'client@macromate.com', '$2a$10$xaabKJjmzb1xyoquV1QcZeXMpJDZi4VHddg2LAE5NckOVgHqO/6By', 'client', 'MM-2026-00001')
ON CONFLICT (id) DO NOTHING;

-- Insert Client Profile
INSERT INTO client_profiles (id, client_id, age, gender, height_cm, weight_kg, bmi, fitness_goal, dietary_preference, daily_calorie_target, activity_level)
VALUES (1, 3, 25, 'male', 175, 75, 24.5, 'muscle_gain', 'non_veg', 2200, 'moderate')
ON CONFLICT (id) DO NOTHING;

-- Insert Membership Plan
INSERT INTO membership_plans (id, gym_id, name, duration_months, price)
VALUES (1, 1, 'Platinum Plan', 12, 12000)
ON CONFLICT (id) DO NOTHING;

-- Insert Active Membership
INSERT INTO memberships (id, client_id, plan_id, start_date, end_date, status, amount_paid)
VALUES (1, 3, 1, '2026-01-01', '2026-12-15', 'active', 12000)
ON CONFLICT (id) DO NOTHING;

-- Insert Trainer Allocation
INSERT INTO trainer_allocations (id, client_id, trainer_id, assigned_at)
VALUES (1, 3, 2, NOW())
ON CONFLICT (id) DO NOTHING;

-- Seed Exercises
INSERT INTO exercises (id, name, muscle_group, equipment, description) VALUES
(1, 'Bench Press', 'Chest', 'Barbell', 'Lying on a bench and pressing a weight upwards.'),
(2, 'Incline DB Press', 'Chest', 'Dumbbells', 'Pressing dumbbells on an incline bench.'),
(3, 'Deadlift', 'Back', 'Barbell', 'Lifting a loaded barbell off the ground to the level of the hips.'),
(4, 'Lat Pulldown', 'Back', 'Cable Machine', 'Pulling a bar down towards the chest.'),
(5, 'Squat', 'Legs', 'Barbell', 'Lowering hips from a standing position and then standing back up.'),
(6, 'Leg Extension', 'Legs', 'Machine', 'Extending legs against resistance.'),
(7, 'Shoulder Press', 'Shoulders', 'Dumbbells', 'Pressing weights overhead.'),
(8, 'Lateral Raise', 'Shoulders', 'Dumbbells', 'Raising weights out to the sides.'),
(9, 'Bicep Curl', 'Biceps', 'Dumbbells', 'Curling weights towards the shoulders.'),
(10, 'Hammer Curl', 'Biceps', 'Dumbbells', 'Neutral grip bicep curls.'),
(11, 'Tricep Pushdown', 'Triceps', 'Cable Machine', 'Pushing a bar down to extend the arms.'),
(12, 'Skull Crusher', 'Triceps', 'EZ Bar', 'Extending arms overhead with a weight.'),
(13, 'Plank', 'Core', 'Bodyweight', 'Holding a push-up position.'),
(14, 'Crunches', 'Core', 'Bodyweight', 'Standard abdominal crunch.'),
(15, 'Lunges', 'Legs', 'Dumbbells', 'Stepping forward and lowering hips.')
ON CONFLICT (id) DO NOTHING;

-- Seed Workout Plan
INSERT INTO workout_plans (id, client_id, title, split_type, is_published)
VALUES (1, 3, 'Muscle Gain Alpha', 'PPL Split', true)
ON CONFLICT (id) DO NOTHING;

-- Seed Workout Days
INSERT INTO workout_days (id, plan_id, day_name, focus, day_number) VALUES
(1, 1, 'Day 1', 'Push (Chest/Shoulders/Triceps)', 1),
(2, 1, 'Day 2', 'Pull (Back/Biceps)', 2),
(3, 1, 'Day 3', 'Legs', 3)
ON CONFLICT (id) DO NOTHING;

-- Seed Notifications
INSERT INTO notifications (id, user_id, title, message, type) VALUES
(1, 3, 'Workout Assigned', 'Coach Uday assigned you a new Muscle Gain Alpha plan.', 'DIET_UPDATE'),
(2, 3, 'Membership Status', 'Your Platinum Plan is active and expires on 15 Dec 2026.', 'MEMBERSHIP_ALERT'),
(3, 3, 'Coach Tip', 'Increase lean protein intake today for better recovery.', 'TRAINER_MESSAGE')
ON CONFLICT (id) DO NOTHING;

-- Adjust sequence values
SELECT setval('gyms_id_seq', (SELECT MAX(id) FROM gyms));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('client_profiles_id_seq', (SELECT MAX(id) FROM client_profiles));
SELECT setval('membership_plans_id_seq', (SELECT MAX(id) FROM membership_plans));
SELECT setval('memberships_id_seq', (SELECT MAX(id) FROM memberships));
SELECT setval('trainer_allocations_id_seq', (SELECT MAX(id) FROM trainer_allocations));
SELECT setval('exercises_id_seq', (SELECT MAX(id) FROM exercises));
SELECT setval('workout_plans_id_seq', (SELECT MAX(id) FROM workout_plans));
SELECT setval('workout_days_id_seq', (SELECT MAX(id) FROM workout_days));
SELECT setval('notifications_id_seq', (SELECT MAX(id) FROM notifications));
