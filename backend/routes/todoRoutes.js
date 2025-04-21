const express = require('express');
const router = express.Router();
const {
  getAllTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo
} = require('../controllers/todoController');

// GET all todos
router.get('/', getAllTodos);

// GET single todo
router.get('/:id', getTodo);

// POST new todo
router.post('/', createTodo);

// UPDATE todo
router.put('/:id', updateTodo);

// DELETE todo
router.delete('/:id', deleteTodo);

module.exports = router; 