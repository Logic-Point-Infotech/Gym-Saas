// macromate-backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { generateMemberId } = require('../utils/memberIdGenerator');

const generateToken = (id, name, email, role, member_id) => {
  const secret = process.env.JWT_SECRET || 'macromate_super_secret_key_123';
  return jwt.sign({ id, name, email, role, member_id }, secret, {
    expiresIn: '7d',
  });
};

const registerUser = async (req, res, next) => {
  const { name, email, password, age, gender, height_cm, weight_kg, fitness_goal, dietary_preference, role } = req.body;
  const userRole = role === 'trainer' ? 'trainer' : 'client';

  const connection = await db.getConnection();
  try {
    const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await connection.beginTransaction();

    try {
      const member_id = await generateMemberId(connection);

      const [userResult] = await connection.query(
        'INSERT INTO users (name, email, password_hash, role, member_id) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, userRole, member_id]
      );
      const userId = userResult.insertId;

      if (userRole === 'client') {
        const height_m = (height_cm || 170) / 100;
        const bmi = ((weight_kg || 70) / (height_m * height_m)).toFixed(1);

        await connection.query(
          'INSERT INTO client_profiles (client_id, age, gender, height_cm, weight_kg, bmi, fitness_goal, dietary_preference, daily_calorie_target) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [userId, age || 25, gender || 'male', height_cm || 170, weight_kg || 70, bmi, fitness_goal || 'muscle_gain', dietary_preference || 'non_veg', 2200]
        );
      }

      await connection.commit();

      const token = generateToken(userId, name, email, userRole, member_id);

      res.status(201).json({
        token,
        user: { id: userId, name, email, role: userRole, member_id },
      });
    } catch (err) {
      await connection.rollback();
      throw err;
    }
  } catch (error) {
    next(error);
  } finally {
    connection.release();
  }
};

const loginUser = async (req, res, next) => {
  const { member_id, email, password } = req.body;
  const loginIdentifier = member_id || email;

  try {
    const [users] = await db.query(
      'SELECT * FROM users WHERE member_id = ? OR email = ?',
      [loginIdentifier, loginIdentifier]
    );
    if (users.length === 0) {
      return res.status(404).json({ message: 'User or Member ID not found' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.name, user.email, user.role, user.member_id);

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, member_id: user.member_id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser };
