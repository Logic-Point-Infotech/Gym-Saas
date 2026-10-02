# MacroMate Backend API

Professional Node.js REST API for the MacroMate gym management and AI fitness coaching platform.

## Tech Stack
- **Node.js & Express**: HTTP Framework
- **MySQL (mysql2)**: Relational Database
- **JWT**: Stateless Authentication
- **Bcryptjs**: Password Hashing
- **Multer**: File Upload Handling (Blood Reports)
- **Dotenv**: Environment Variable Management

## Prerequisites
- Node.js (v18 or higher)
- MySQL Server installed and running locally
- A database named `macromate_db` with the required schema

## Getting Started

1. **Install Dependencies**
   ```bash
   cd macromate-backend
   npm install
   ```

2. **Setup Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5002
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=macromate_db
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

3. **Run the Server**
   - Development mode (with nodemon):
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new client
- `POST /api/auth/login`: Login and receive JWT

### Profile
- `GET /api/profile`: Get full client profile
- `PUT /api/profile/update`: Update profile and recalculate BMI

### Health Metrics
- `GET /api/health/metrics`: Get historical biometrics
- `POST /api/health/metrics`: Log weight, fat %, muscle mass, etc.
- `POST /api/health/blood-report`: Upload PDF and get mock AI insights

### Nutrition
- `GET /api/nutrition/log/today`: Today's macros and meal list
- `POST /api/nutrition/meal`: Log a new meal and update daily totals
- `GET /api/nutrition/history`: Last 7 days of nutrition logs

### Workouts
- `GET /api/workout/plan`: Get current assigned workout routine
- `POST /api/workout/log`: Log a completed session with sets/reps
- `GET /api/workout/history`: Historical workout logs

### Notifications
- `GET /api/notifications`: Get recent notifications (last 20)
- `PUT /api/notifications/:id/read`: Mark notification as read

### Attendance
- `GET /api/attendance`: View last 30 gym check-ins

### System
- `GET /api/health`: Server health check

## Testing with Postman
1. Call `POST /api/auth/register` or `login`.
2. Copy the `token` from the response.
3. For all other routes, go to the **Authorization** tab in Postman.
4. Select **Type: Bearer Token** and paste your token.
