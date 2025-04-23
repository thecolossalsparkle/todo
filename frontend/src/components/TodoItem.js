import React, { useState } from 'react';
import { useTodoContext } from '../context/TodoContext';
import { FaEdit, FaTrash, FaClock, FaCalendarAlt, FaCheckCircle, FaArrowUp, FaArrowRight, FaArrowDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isAfter, isBefore, isToday } from 'date-fns';

const TodoItem = ({ todo, onEdit }) => {
  const { updateTodo, deleteTodo } = useTodoContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const { _id, title, description, status, priority, dueDate, completed } = todo;

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  };
  
  const formatTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return format(date, 'h:mm a');
  };

  const handleToggleComplete = async () => {
    try {
      console.log('Toggling todo:', todo);
      await updateTodo(todo._id, { 
        completed: !completed,
        status: !completed ? 'Completed' : 'Not Started'
      });
    } catch (error) {
      console.error("Error toggling complete:", error);
      alert(`Failed to update task: ${error.message || 'Unknown error'}`);
    }
  };

  const handleEdit = () => {
    onEdit(todo);
  };

  const handleDelete = async () => {
    try {
      console.log('Deleting todo:', todo);
      setIsDeleting(true);
      await deleteTodo(todo._id);
    } catch (error) {
      setIsDeleting(false);
      console.error("Error deleting todo:", error);
      alert(`Failed to delete task: ${error.message || 'Unknown error'}`);
    }
  };

  const isOverdue = () => {
    if (!dueDate || completed) return false;
    const now = new Date();
    const due = new Date(dueDate);
    return isBefore(due, now);
  };

  const getDueDateLabel = () => {
    if (!dueDate) return null;
    
    const due = new Date(dueDate);
    const today = new Date();
    
    if (isToday(due)) return "Today";
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (isToday(tomorrow)) return "Tomorrow";
    
    if (isOverdue()) return "Overdue";
    
    return formatDate(dueDate);
  };

  const getPriorityIcon = () => {
    const priorityLower = priority?.toLowerCase() || 'medium';
    switch(priorityLower) {
      case 'high':
        return <FaArrowUp />;
      case 'medium':
        return <FaArrowRight />;
      case 'low':
        return <FaArrowDown />;
      default:
        return <FaArrowRight />;
    }
  };

  // Space-efficient card animations
  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    hover: { 
      y: -3, 
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.06), 0 4px 8px rgba(0, 0, 0, 0.03)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    },
    tap: { 
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 20
      }
    }
  };

  const checkboxVariants = {
    unchecked: { 
      scale: 1,
      backgroundColor: 'transparent',
      borderColor: 'var(--gray-400)'
    },
    checked: { 
      scale: 1,
      backgroundColor: 'var(--success)',
      borderColor: 'var(--success)'
    },
    hover: { 
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    },
    tap: { scale: 0.9 }
  };

  return (
    <motion.div 
      className="task"
      data-status={status?.toLowerCase() || 'not-started'}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -10, transition: { duration: 0.2 } }}
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      layout
    >
      <div className="task-header">
        <motion.div 
          className="task-title-container"
          layout
        >
          <motion.button
            className="checkbox-container"
            onClick={handleToggleComplete}
            whileHover="hover"
            whileTap="tap"
            variants={checkboxVariants}
          >
            <motion.div 
              className={`checkbox ${completed ? 'completed' : ''}`}
              variants={checkboxVariants}
              initial={completed ? "checked" : "unchecked"}
              animate={completed ? "checked" : "unchecked"}
            >
              {completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 500,
                    damping: 15
                  }}
                >
                  <FaCheckCircle />
                </motion.div>
              )}
            </motion.div>
          </motion.button>
          
          <h3 className={completed ? 'completed' : ''}>{title}</h3>
        </motion.div>

        <motion.button 
          className="task-expand-button"
          onClick={() => setShowDetails(!showDetails)}
          whileHover={{ scale: 1.1, backgroundColor: 'var(--gray-200)' }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ rotate: showDetails ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 5L8 11L14 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.button>
      </div>

      <div className="task-badges">
        <motion.span 
          className={`badge status-badge status-${status?.toLowerCase().replace(/\s+/g, '-') || 'not-started'}`}
          whileHover={{ y: -2, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {status || 'Not Started'}
        </motion.span>
        <motion.span 
          className={`badge priority-badge priority-${priority?.toLowerCase() || 'medium'}`}
          whileHover={{ y: -2, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {getPriorityIcon()} {priority || 'Medium'}
        </motion.span>
        
        {dueDate && (
          <motion.span 
            className={`badge date-badge ${isOverdue() ? 'overdue' : ''}`}
            whileHover={{ y: -2, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCalendarAlt style={{ marginRight: '4px', fontSize: '10px' }} />
            {getDueDateLabel()}
          </motion.span>
        )}
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div 
            className="task-details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: 1, 
              height: 'auto',
              transition: {
                height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.2, delay: 0.1 }
              }
            }}
            exit={{ 
              opacity: 0, 
              height: 0,
              transition: {
                height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.15 }
              }
            }}
          >
            {description && (
              <motion.div 
                className="task-description"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.2 }}
              >
                {description}
              </motion.div>
            )}
            
            {dueDate && (
              <motion.div 
                className="due-time-container"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.2 }}
              >
                <FaClock style={{ marginRight: '5px', fontSize: '12px' }} />
                <span>{formatTime(dueDate)}</span>
              </motion.div>
            )}
            
            <motion.div 
              className="task-actions"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.2 }}
            >
              <motion.button 
                className="action-button edit"
                onClick={handleEdit}
                whileHover={{ 
                  y: -2, 
                  scale: 1.1,
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--white)'
                }}
                whileTap={{ scale: 0.9 }}
                disabled={isDeleting}
              >
                <FaEdit />
              </motion.button>
              
              <motion.button 
                className="action-button delete"
                onClick={handleDelete}
                whileHover={{ 
                  y: -2, 
                  scale: 1.1,
                  backgroundColor: 'var(--danger)',
                  color: 'var(--white)'
                }}
                whileTap={{ scale: 0.9 }}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{ display: 'inline-block' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                ) : (
                  <FaTrash />
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TodoItem; 