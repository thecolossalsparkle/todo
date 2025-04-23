const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Test route to verify API is accessible
router.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Auth API is running' 
  });
});

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Get current user route (protected)
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router; 