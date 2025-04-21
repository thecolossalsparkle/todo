const Todo = require('../models/Todo');
const mongoose = require('mongoose');

/**
 * Validate and possibly fix a MongoDB ID
 * @param {string} id - The ID to validate
 * @returns {object} - Object with isValid flag and sanitized ID
 */
const validateMongoId = (id) => {
  if (!id) return { isValid: false, id: null };
  
  // Check if already valid
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { isValid: true, id };
  }
  
  // Try to sanitize the ID
  const sanitizedId = id.toString().trim();
  
  // Check if sanitized ID is valid
  if (mongoose.Types.ObjectId.isValid(sanitizedId)) {
    return { isValid: true, id: sanitizedId };
  }
  
  return { isValid: false, id: sanitizedId };
};

/**
 * @desc   Get all todos for the logged in user
 * @route  GET /api/todos
 * @access Private
 */
const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ createdBy: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch todos', 
      error: error.message 
    });
  }
};

/**
 * @desc   Get a single todo
 * @route  GET /api/todos/:id
 * @access Private
 */
const getTodo = async (req, res) => {
  try {
    // Validate if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      });
    }
    
    const todo = await Todo.findOne({
      _id: req.params.id,
      createdBy: req.user.userId
    });
    
    if (!todo) {
      return res.status(404).json({ 
        success: false,
        message: 'Todo not found' 
      });
    }
    res.status(200).json(todo);
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch todo', 
      error: error.message 
    });
  }
};

/**
 * @desc   Create a new todo
 * @route  POST /api/todos
 * @access Private
 */
const createTodo = async (req, res) => {
  try {
    // Validate request body
    if (!req.body.title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }
    
    // Add user ID to todo
    req.body.createdBy = req.user.userId;
    
    const newTodo = await Todo.create(req.body);
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to create todo', 
      error: error.message 
    });
  }
};

/**
 * @desc   Update a todo
 * @route  PUT /api/todos/:id
 * @access Private
 */
const updateTodo = async (req, res) => {
  try {
    console.log('Update request for ID:', req.params.id);
    
    // Enhanced validation
    const { isValid, id } = validateMongoId(req.params.id);
    console.log('ID validation:', { isValid, id });
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      });
    }
    
    const todo = await Todo.findOne({
      _id: id,
      createdBy: req.user.userId
    });
    
    if (!todo) {
      return res.status(404).json({ 
        success: false,
        message: 'Todo not found or not authorized' 
      });
    }
    
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to update todo', 
      error: error.message 
    });
  }
};

/**
 * @desc   Delete a todo
 * @route  DELETE /api/todos/:id
 * @access Private
 */
const deleteTodo = async (req, res) => {
  try {
    console.log('Delete request for ID:', req.params.id);
    
    // Enhanced validation
    const { isValid, id } = validateMongoId(req.params.id);
    console.log('ID validation:', { isValid, id });
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      });
    }
    
    const todo = await Todo.findOne({
      _id: id,
      createdBy: req.user.userId
    });
    
    if (!todo) {
      return res.status(404).json({ 
        success: false,
        message: 'Todo not found or not authorized' 
      });
    }
    
    await Todo.findByIdAndDelete(id);
    
    res.status(200).json({ 
      success: true,
      message: 'Todo deleted successfully',
      data: todo._id
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete todo', 
      error: error.message 
    });
  }
};

module.exports = {
  getAllTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo
}; 