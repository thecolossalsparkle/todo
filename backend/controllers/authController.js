const User = require('../models/User');

// Register a new user
const register = async (req, res) => {
  try {
    console.log('Register endpoint hit with body:', { ...req.body, password: req.body.password ? '******' : undefined });
    
    const { name, email, password } = req.body;
    
    // Validate inputs
    if (!name || !email || !password) {
      console.log('Registration failed: Missing required fields');
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    
    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      console.log('Registration failed: Email already exists:', email);
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    
    // Create user
    console.log('Creating new user with name:', name, 'and email:', email);
    const user = await User.create({ name, email, password });
    
    // Generate token
    const token = user.createJWT();
    
    console.log('User registered successfully:', user._id);
    res.status(201).json({
      success: true,
      user: { 
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login a user
const login = async (req, res) => {
  try {
    console.log('Login endpoint hit with email:', req.body.email);
    
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    
    // Find user with password included
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('Login failed: User not found with email:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Compare password
    console.log('Comparing passwords for user:', user._id);
    console.log('Password from request:', password ? 'Provided' : 'Missing');
    console.log('Stored password hash exists:', !!user.password);
    
    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      console.log('Login failed: Incorrect password for user:', user._id);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = user.createJWT();
    
    console.log('User logged in successfully:', user._id);
    res.status(200).json({
      success: true,
      user: { 
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      user: { 
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
}; 