import React from 'react';
import TodoItem from './TodoItem';
import { FaClipboardList, FaPlus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      duration: 0.4,
      when: "beforeChildren"
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20
    }  
  }
};

// Optimized empty state for better space utilization
const emptyStateVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const emptyStateChildVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25
    }
  }
};

const buttonVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25,
      delay: 0.2
    }
  },
  hover: { 
    scale: 1.05, 
    y: -3,
    boxShadow: "0 6px 15px rgba(94, 96, 206, 0.2)",
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 15
    }
  },
  tap: { 
    scale: 0.98,
    boxShadow: "0 3px 8px rgba(94, 96, 206, 0.2)"
  }
};

const TodoList = ({ todos, onEdit }) => {
  if (!todos || todos.length === 0) {
    return (
      <motion.div 
        className="empty-state"
        variants={emptyStateVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={emptyStateChildVariants}
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <FaClipboardList />
        </motion.div>
        <motion.h3 variants={emptyStateChildVariants}>
          No tasks found
        </motion.h3>
        <motion.p variants={emptyStateChildVariants}>
          Add a new task to get started with your productivity journey!
        </motion.p>
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Link to="/todos" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
            <FaPlus style={{ marginRight: '0.5rem' }} /> Add Task
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="todo-list"
      variants={container}
      initial="hidden"
      animate="show"
      layout
    >
      <div className="tasks-container">
        <AnimatePresence mode="wait">
          {todos.map(todo => (
            <motion.div
              key={todo._id}
              variants={item}
              initial="hidden"
              animate="show"
              exit={{ 
                opacity: 0, 
                y: -10, 
                transition: { 
                  duration: 0.2,
                  ease: "easeInOut"
                } 
              }}
              layout
            >
              <TodoItem 
                todo={todo} 
                onEdit={onEdit} 
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TodoList; 