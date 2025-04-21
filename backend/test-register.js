const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Define test user
const testUser = {
  name: 'Test User',
  email: 'testuser' + Date.now() + '@example.com', // Using timestamp to ensure unique email
  password: 'password123'
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/todo-app')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Check if email already exists
      const existingUser = await User.findOne({ email: testUser.email });
      if (existingUser) {
        console.log('Email already exists:', testUser.email);
        process.exit(1);
      }
      
      // Create user directly through the model
      console.log('Creating test user with email:', testUser.email);
      const user = await User.create(testUser);
      
      console.log('User created successfully:', {
        id: user._id,
        name: user.name,
        email: user.email
      });
      
      // Generate JWT token to verify it works
      const token = user.createJWT();
      console.log('Generated token successfully');
      
    } catch (error) {
      console.error('Error creating test user:', error);
    } finally {
      mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
  }); 