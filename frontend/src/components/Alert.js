import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const Alert = ({ type, message }) => {
  if (!message) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        className={`alert alert-${type}`}
        initial={{ opacity: 0, y: -50, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {type === 'success' ? (
          <FaCheckCircle style={{ marginRight: '10px', color: 'var(--success-color)' }} />
        ) : (
          <FaExclamationTriangle style={{ marginRight: '10px', color: 'var(--danger-color)' }} />
        )}
        {message}
      </motion.div>
    </AnimatePresence>
  );
};

export default Alert; 