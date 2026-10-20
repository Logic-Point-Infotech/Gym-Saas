-- macromate-backend/migrations/schema_postgres.sql

-- Gyms Table
CREATE TABLE IF NOT EXISTS gyms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8)
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'client',
    phone VARCHAR(15),
    profile_photo_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    member_id VARCHAR(20) UNIQUE NULL,
    date_of_birth DATE NULL,
    address TEXT NULL,
    emergency_contact VARCHAR(100) NULL,
    last_login TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_member_id ON users(member_id);

-- Client Profiles
CREATE TABLE IF NOT EXISTS client_profiles (
    id SERIAL PRIMARY KEY,
    client_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    age INT,
    gender VARCHAR(20),
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    bmi DECIMAL(5,2),
    fitness_goal VARCHAR(50),
    dietary_preference VARCHAR(50),
    activity_level VARCHAR(50),
    daily_calorie_target INT DEFAULT 2200,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Membership Plans
CREATE TABLE IF NOT EXISTS membership_plans (
    id SERIAL PRIMARY KEY,
    gym_id INT REFERENCES gyms(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    duration_months INT NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- Memberships
CREATE TABLE IF NOT EXISTS memberships (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES users(id) ON DELETE CASCADE,
    plan_id INT REFERENCES membership_plans(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    amount_paid DECIMAL(10,2) DEFAULT 0,
    payment_status VARCHAR(20) DEFAULT 'paid'
);

-- Trainer Allocations
CREATE TABLE IF NOT EXISTS trainer_allocations (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES users(id) ON DELETE CASCADE,
    trainer_id INT REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Client Health Metrics
CREATE TABLE IF NOT EXISTS client_health_metrics (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES users(id) ON DELETE CASCADE,
    weight_kg DECIMAL(5,2),
    bmi DECIMAL(5,2),
    body_fat_percentage DECIMAL(5,2),
    muscle_mass_kg DECIMAL(5,2),
    blood_report_url TEXT,
    blood_report_json JSONB,
    notes TEXT,
    recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Daily Nutrition Logs
CREATE TABLE IF NOT EXISTS daily_nutrition_logs (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE DEFAULT CURRENT_DATE,
    total_calories INT DEFAULT 0,
    total_protein DECIMAL(5,2) DEFAULT 0,
    total_carbs DECIMAL(5,2) DEFAULT 0,
    total_fat DECIMAL(5,2) DEFAULT 0
);

-- Meal Entries
CREATE TABLE IF NOT EXISTS meal_entries (
    id SERIAL PRIMARY KEY,
    log_id INT REFERENCES daily_nutrition_logs(id) ON DELETE CASCADE,
    meal_type VARCHAR(50),
    detected_foods JSONB,
    total_calories INT,
    image_url TEXT,
    logged_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Exercises
CREATE TABLE IF NOT EXISTS exercises (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    muscle_group VARCHAR(50),
    equipment VARCHAR(50),
    description TEXT
);

-- Workout Plans
CREATE TABLE IF NOT EXISTS workout_plans (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    split_type VARCHAR(50),
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Workout Days
CREATE TABLE IF NOT EXISTS workout_days (
    id SERIAL PRIMARY KEY,
    plan_id INT REFERENCES workout_plans(id) ON DELETE CASCADE,
    day_name VARCHAR(50),
    focus VARCHAR(100),
    day_number INT
);

-- Workout Day Exercises
CREATE TABLE IF NOT EXISTS workout_day_exercises (
    id SERIAL PRIMARY KEY,
    day_id INT REFERENCES workout_days(id) ON DELETE CASCADE,
    exercise_id INT REFERENCES exercises(id) ON DELETE CASCADE,
    sets INT,
    reps INT,
    rest_seconds INT,
    order_index INT
);

-- Workout Logs
CREATE TABLE IF NOT EXISTS workout_logs (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES users(id) ON DELETE CASCADE,
    plan_id INT REFERENCES workout_plans(id) ON DELETE CASCADE,
    day_id INT REFERENCES workout_days(id) ON DELETE CASCADE,
    logged_date DATE DEFAULT CURRENT_DATE,
    duration_minutes INT DEFAULT 0,
    notes TEXT,
    completed_sets INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Workout Set Logs
CREATE TABLE IF NOT EXISTS workout_set_logs (
    id SERIAL PRIMARY KEY,
    workout_log_id INT REFERENCES workout_logs(id) ON DELETE CASCADE,
    exercise_id INT REFERENCES exercises(id) ON DELETE CASCADE,
    set_number INT,
    reps_done INT,
    weight_kg DECIMAL(5,2),
    is_completed BOOLEAN DEFAULT TRUE
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Attendance
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    check_in_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    check_out_time TIMESTAMPTZ
);
