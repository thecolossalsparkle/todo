const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/todo-app';

console.log('Attempting to connect to MongoDB at:', MONGO_URI);

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB');
    
    // Test read from Users collection
    try {
      const User = mongoose.connection.collection('users');
      const usersCount = await User.countDocuments();
      console.log(`Database has ${usersCount} users`);
      
      // List a few recent users
      if (usersCount > 0) {
        const users = await User.find({})
          .limit(5)
          .sort({ createdAt: -1 })
          .toArray();
        
        console.log('Most recent users:');
        users.forEach(user => {
          console.log(` - ${user.name} (${user.email})`);
        });
      }
    } catch (error) {
      console.error('Error accessing users collection:', error);
    }
    
    // Close connection
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
  }); 