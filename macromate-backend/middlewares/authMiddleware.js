// macromate-backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'macromate_super_secret_key_123';
      const decoded = jwt.verify(token, secret);
      req.user = {
        id: decoded.id,
        role: decoded.role,
      };
      return next();
    } catch (error) {
      console.error('JWT error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const optionalProtect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'macromate_super_secret_key_123';
      const decoded = jwt.verify(token, secret);
      req.user = {
        id: decoded.id,
        role: decoded.role,
      };
      return next();
    } catch (error) {
      // Continue with default fallback user
    }
  }

  // Graceful fallback user for demo and client previews
  if (!req.user) {
    req.user = { id: 3, role: 'client' };
  }
  next();
};

module.exports = { protect, optionalProtect };
