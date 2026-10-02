-- macromate-backend/seed.sql

-- Insert Test Gym
INSERT INTO gyms (name, address, location_lat, location_lng)
VALUES ('MacroMate Headquarters', '123 Fitness Ave, Tech City', 18.5204, 73.8567);

-- Insert Admin (Password: Admin123)
INSERT INTO users (name, email, password_hash, role)
VALUES ('System Admin', 'admin@macromate.com', '$2a$10$7vNfMscYfI1m9U4aA6f8e.E4O7UqB8P0f6iK2n.t8vS6Y/5zRk9G', 'admin');

-- Insert Trainer (Password: Trainer123)
INSERT INTO users (name, email, password_hash, role)
VALUES ('Coach Uday', 'trainer@macromate.com', '$2a$10$7vNfMscYfI1m9U4aA6f8e.E4O7UqB8P0f6iK2n.t8vS6Y/5zRk9G', 'trainer');

-- Insert Client (Password: Client123)
INSERT INTO users (name, email, password_hash, role)
VALUES ('Rahul Sharma', 'client@macromate.com', '$2a$10$7vNfMscYfI1m9U4aA6f8e.E4O7UqB8P0f6iK2n.t8vS6Y/5zRk9G', 'client');

-- Insert Client Profile for Rahul
INSERT INTO client_profiles (client_id, age, gender, height_cm, weight_kg, bmi, fitness_goal, dietary_preference, daily_calorie_target, activity_level)
VALUES (4, 25, 'male', 175, 75, 24.5, 'muscle_gain', 'non_veg', 2200, 'moderate');

-- Insert Membership Plan
INSERT INTO membership_plans (gym_id, name, duration_months, price)
VALUES (1, 'Platinum Plan', 12, 12000);

-- Insert Active Membership
INSERT INTO memberships (client_id, plan_id, start_date, end_date, status)
VALUES (4, 1, '2026-01-01', '2026-12-15', 'active');

-- Insert Trainer Allocation
INSERT INTO trainer_allocations (client_id, trainer_id, assigned_at)
VALUES (4, 3, NOW());

-- Seed Exercises
INSERT INTO exercises (name, muscle_group, equipment, description) VALUES
('Bench Press', 'Chest', 'Barbell', 'Lying on a bench and pressing a weight upwards.'),
('Incline DB Press', 'Chest', 'Dumbbells', 'Pressing dumbbells on an incline bench.'),
('Deadlift', 'Back', 'Barbell', 'Lifting a loaded barbell off the ground to the level of the hips.'),
('Lat Pulldown', 'Back', 'Cable Machine', 'Pulling a bar down towards the chest.'),
('Squat', 'Legs', 'Barbell', 'Lowering hips from a standing position and then standing back up.'),
('Leg Extension', 'Legs', 'Machine', 'Extending legs against resistance.'),
('Shoulder Press', 'Shoulders', 'Dumbbells', 'Pressing weights overhead.'),
('Lateral Raise', 'Shoulders', 'Dumbbells', 'Raising weights out to the sides.'),
('Bicep Curl', 'Biceps', 'Dumbbells', 'Curling weights towards the shoulders.'),
('Hammer Curl', 'Biceps', 'Dumbbells', 'Neutral grip bicep curls.'),
('Tricep Pushdown', 'Triceps', 'Cable Machine', 'Pushing a bar down to extend the arms.'),
('Skull Crusher', 'Triceps', 'EZ Bar', 'Extending arms overhead with a weight.'),
('Plank', 'Core', 'Bodyweight', 'Holding a push-up position.'),
('Crunches', 'Core', 'Bodyweight', 'Standard abdominal crunch.'),
('Lunges', 'Legs', 'Dumbbells', 'Stepping forward and lowering hips.');

-- Seed Workout Plan
INSERT INTO workout_plans (client_id, title, split_type, is_published)
VALUES (4, 'Muscle Gain Alpha', 'PPL Split', true);

-- Seed Workout Days
INSERT INTO workout_days (plan_id, day_name, focus, day_number) VALUES
(1, 'Day 1', 'Push (Chest/Shoulders/Triceps)', 1),
(1, 'Day 2', 'Pull (Back/Biceps)', 2),
(1, 'Day 3', 'Legs', 3);

-- Seed Exercises for Day 1
INSERT INTO workout_day_exercises (day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES
(1, 1, 4, 10, 90, 1),
(1, 7, 3, 12, 60, 2),
(1, 11, 3, 15, 45, 3);

-- Seed Notifications
INSERT INTO notifications (user_id, title, message, type) VALUES
(4, 'Workout Assigned', 'Coach Uday assigned you a new Muscle Gain Alpha plan.', 'DIET_UPDATE'),
(4, 'Membership Status', 'Your Platinum Plan is active and expires on 15 Dec 2026.', 'MEMBERSHIP_ALERT'),
(4, 'Coach Tip', 'Increase lean protein intake today for better recovery.', 'TRAINER_MESSAGE'),
(4, 'Goal Milestone', 'Great progress! You have stayed consistent for 2 weeks.', 'SYSTEM'),
(4, 'New Task', 'Please upload your latest blood report for review.', 'DIET_UPDATE');
