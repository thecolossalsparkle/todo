const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication invalid' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Attach user info to request object
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Authentication invalid' });
  }
};

module.exports = auth; 