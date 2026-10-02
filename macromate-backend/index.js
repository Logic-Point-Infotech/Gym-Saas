// macromate-backend/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} from ${req.ip}`);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads', 'blood_reports');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const healthRoutes = require('./routes/healthRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/attendance', attendanceRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  const response = { message };
  if (process.env.NODE_ENV === 'development') {
    response.error = err.message;
    response.stack = err.stack;
  }

  res.status(status).json(response);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Try accessing: http://192.168.137.1:${PORT}/api/health`);
});
