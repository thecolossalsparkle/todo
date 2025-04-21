const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Todo title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['Not Started', 'In Progress', 'Completed'],
      message: '{VALUE} is not a valid status'
    },
    default: 'Not Started',
    set: function(val) {
      // Map common variations to standard values
      if (val) {
        val = val.trim();
        if (val.toLowerCase() === 'pending' || 
            val.toLowerCase() === 'not started') {
          return 'Not Started';
        } else if (val.toLowerCase() === 'in progress') {
          return 'In Progress';
        } else if (val.toLowerCase() === 'completed' || 
                  val.toLowerCase() === 'done') {
          return 'Completed';
        }
      }
      return val;
    }
  },
  priority: {
    type: String,
    enum: {
      values: ['Low', 'Medium', 'High'],
      message: '{VALUE} is not a valid priority'
    },
    default: 'Medium',
    set: function(val) {
      // Capitalize first letter for consistency
      if (val && typeof val === 'string') {
        val = val.trim();
        if (val.toLowerCase() === 'low') {
          return 'Low';
        } else if (val.toLowerCase() === 'medium') {
          return 'Medium';
        } else if (val.toLowerCase() === 'high') {
          return 'High';
        }
      }
      return val;
    }
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value instanceof Date;
      },
      message: 'Due date must be a valid date'
    }
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user']
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Set the completed field based on status and normalize case issues
TodoSchema.pre('save', function(next) {
  // Normalize status casing
  if (this.status && typeof this.status === 'string') {
    if (this.status.toLowerCase() === 'completed' || this.status.toLowerCase() === 'done') {
      this.status = 'Completed';
      this.completed = true;
    } else if (this.status.toLowerCase() === 'in progress') {
      this.status = 'In Progress';
      this.completed = false;
    } else if (this.status.toLowerCase() === 'not started' || this.status.toLowerCase() === 'pending') {
      this.status = 'Not Started';
      this.completed = false;
    }
  }
  
  // Normalize priority casing
  if (this.priority && typeof this.priority === 'string') {
    if (this.priority.toLowerCase() === 'high') {
      this.priority = 'High';
    } else if (this.priority.toLowerCase() === 'medium') {
      this.priority = 'Medium';
    } else if (this.priority.toLowerCase() === 'low') {
      this.priority = 'Low';
    }
  }
  
  // Update the updatedAt field
  this.updatedAt = Date.now();
  
  next();
});

// Also add this hook for update operations
TodoSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  
  // Normalize status casing
  if (update.status && typeof update.status === 'string') {
    if (update.status.toLowerCase() === 'completed' || update.status.toLowerCase() === 'done') {
      update.status = 'Completed';
      update.completed = true;
    } else if (update.status.toLowerCase() === 'in progress') {
      update.status = 'In Progress';
      update.completed = false;
    } else if (update.status.toLowerCase() === 'not started' || update.status.toLowerCase() === 'pending') {
      update.status = 'Not Started';
      update.completed = false;
    }
  }
  
  // Normalize priority casing
  if (update.priority && typeof update.priority === 'string') {
    if (update.priority.toLowerCase() === 'high') {
      update.priority = 'High';
    } else if (update.priority.toLowerCase() === 'medium') {
      update.priority = 'Medium';
    } else if (update.priority.toLowerCase() === 'low') {
      update.priority = 'Low';
    }
  }
  
  // Update the updatedAt field
  update.updatedAt = Date.now();
  
  next();
});

module.exports = mongoose.model('Todo', TodoSchema); 