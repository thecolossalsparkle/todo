import React, { useState, useEffect } from 'react';
import { useTodoContext } from '../context/TodoContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSave, FaTimes, FaPlus, FaCalendarAlt, FaFlag, FaClipboardCheck, FaClock } from 'react-icons/fa';
import '../styles/App.css';

const TodoForm = ({ todoToEdit, setTodoToEdit, onClose }) => {
  const { addTodo, updateTodo, loading } = useTodoContext();
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const initialFormState = {
    title: '',
    description: '',
    status: 'Not Started',
    priority: 'Medium',
    dueDate: '',
    dueTime: '12:00',
  };
  
  const [formData, setFormData] = useState(initialFormState);
  
  useEffect(() => {
    if (todoToEdit) {
      const { title, description, status, priority, dueDate } = todoToEdit;
      
      // Parse date and time from dueDate if it exists
      let formattedDate = '';
      let formattedTime = '12:00';
      
      if (dueDate) {
        const date = new Date(dueDate);
        formattedDate = date.toISOString().substr(0, 10);
        
        // Extract time if available
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        formattedTime = `${hours}:${minutes}`;
      }
      
      setFormData({
        title,
        description: description || '',
        status,
        priority,
        dueDate: formattedDate,
        dueTime: formattedTime,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [todoToEdit]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear any errors when user starts typing
    if (formError) setFormError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim()) {
      setFormError('Title is required');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Combine date and time for submission
      const combinedData = { ...formData };
      
      if (formData.dueDate) {
        // Combine date and time
        const dateObj = new Date(`${formData.dueDate}T${formData.dueTime}`);
        combinedData.dueDate = dateObj.toISOString();
        delete combinedData.dueTime; // Remove the separate time field before sending to API
      }
      
      if (todoToEdit) {
        await updateTodo(todoToEdit._id, combinedData);
        setTodoToEdit(null);
      } else {
        await addTodo(combinedData);
      }
      setFormData(initialFormState);
      if (onClose) onClose();
    } catch (error) {
      console.error('Error in form submission:', error);
      setFormError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    setTodoToEdit(null);
    setFormData(initialFormState);
    if (onClose) onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };
  
  return (
    <div className="form-modal" onClick={handleCancel}>
      <motion.div 
        className="form-container"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 500, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="form-header">
          <motion.h2 
            className="form-title"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {todoToEdit ? 'Edit Task' : 'Add New Task'}
          </motion.h2>
          <motion.button 
            className="form-close"
            onClick={handleCancel}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes />
          </motion.button>
        </div>
        
        {formError && (
          <motion.div 
            className="form-error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {formError}
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">
              Title <span className="required">*</span>
            </label>
            <motion.input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              required
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileFocus={{ scale: 1.01, boxShadow: '0 0 0 3px rgba(94, 96, 206, 0.25)' }}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <motion.textarea
              className="form-control form-textarea"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add details about this task..."
              rows="3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileFocus={{ scale: 1.01, boxShadow: '0 0 0 3px rgba(94, 96, 206, 0.25)' }}
            ></motion.textarea>
          </div>
          
          <div className="form-row">
            <motion.div 
              className="form-group form-group-icon"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="status">
                <FaClipboardCheck className="form-icon" /> Status
              </label>
              <motion.select
                className="form-control form-select"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                whileFocus={{ scale: 1.01, boxShadow: '0 0 0 3px rgba(94, 96, 206, 0.25)' }}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </motion.select>
            </motion.div>
            
            <motion.div 
              className="form-group form-group-icon"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="priority">
                <FaFlag className="form-icon" /> Priority
              </label>
              <motion.select
                className="form-control form-select"
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                whileFocus={{ scale: 1.01, boxShadow: '0 0 0 3px rgba(94, 96, 206, 0.25)' }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </motion.select>
            </motion.div>
          </div>
          
          <div className="form-row">
            <motion.div 
              className="form-group form-group-icon"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="dueDate">
                <FaCalendarAlt className="form-icon" /> Due Date
              </label>
              <motion.input
                type="date"
                className="form-control"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                whileFocus={{ scale: 1.01, boxShadow: '0 0 0 3px rgba(94, 96, 206, 0.25)' }}
              />
            </motion.div>
            
            <motion.div 
              className="form-group form-group-icon"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              <label htmlFor="dueTime">
                <FaClock className="form-icon" /> Due Time
              </label>
              <motion.input
                type="time"
                className="form-control"
                id="dueTime"
                name="dueTime"
                value={formData.dueTime}
                onChange={handleChange}
                whileFocus={{ scale: 1.01, boxShadow: '0 0 0 3px rgba(94, 96, 206, 0.25)' }}
              />
            </motion.div>
          </div>
          
          <motion.div 
            className="form-actions"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button 
              type="button" 
              className="btn btn-outline" 
              onClick={handleCancel}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={submitting}
            >
              <FaTimes /> Cancel
            </motion.button>
            
            <motion.button 
              type="submit" 
              className="btn btn-primary" 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={submitting}
            >
              {submitting ? (
                <span className="button-loader">
                  <svg className="loading-spinner" viewBox="0 0 50 50" width="20" height="20">
                    <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="5"></circle>
                  </svg>
                  Saving...
                </span>
              ) : (
                <>
                  {todoToEdit ? <FaSave /> : <FaPlus />} {todoToEdit ? 'Save Changes' : 'Add Task'}
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default TodoForm; 