import React from 'react';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../styles/App.css';

const Task = ({ task, onStatusChange, onEdit, onDelete }) => {
  const { _id, title, description, status, priority, dueDate } = task;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusClass = () => {
    switch (status) {
      case 'Not Started':
        return 'status-not-started';
      case 'In Progress':
        return 'status-in-progress';
      case 'Completed':
        return 'status-completed';
      default:
        return 'status-not-started';
    }
  };

  const getPriorityClass = () => {
    switch (priority) {
      case 'Low':
        return 'priority-low';
      case 'Medium':
        return 'priority-medium';
      case 'High':
        return 'priority-high';
      default:
        return 'priority-medium';
    }
  };

  const handleStatusChange = () => {
    let newStatus;
    switch (status) {
      case 'Not Started':
        newStatus = 'In Progress';
        break;
      case 'In Progress':
        newStatus = 'Completed';
        break;
      case 'Completed':
        newStatus = 'Not Started';
        break;
      default:
        newStatus = 'Not Started';
    }
    onStatusChange(_id, newStatus);
  };

  return (
    <motion.div 
      className="task" 
      data-status={status?.toLowerCase().replace(' ', '-') || 'not-started'}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <div className="task-header">
        <h3>{title}</h3>
        <div className="task-badges">
          <span className={`badge status-badge ${getStatusClass()}`}>{status}</span>
          <span className={`badge priority-badge ${getPriorityClass()}`}>{priority}</span>
        </div>
      </div>
      
      <p className="task-description">{description}</p>
      
      {dueDate && (
        <p className="due-date">Due: {formatDate(dueDate)}</p>
      )}
      
      <div className="task-actions">
        <motion.button 
          onClick={handleStatusChange} 
          className="action-button" 
          aria-label="Change status"
          whileHover={{ scale: 1.1, color: '#2196f3' }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <FaCheck />
        </motion.button>
        <motion.button 
          onClick={() => onEdit(task)} 
          className="action-button" 
          aria-label="Edit task"
          whileHover={{ scale: 1.1, color: '#2196f3' }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <FaEdit />
        </motion.button>
        <motion.button 
          onClick={() => onDelete(_id)} 
          className="action-button" 
          aria-label="Delete task"
          whileHover={{ scale: 1.1, color: '#f44336' }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <FaTrash />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Task; 