import React from 'react';
import { motion } from 'framer-motion';

const loadingContainerVariants = {
  start: {
    transition: {
      staggerChildren: 0.1
    }
  },
  end: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const loadingCircleVariants = {
  start: {
    y: '0%'
  },
  end: {
    y: '100%'
  }
};

const loadingCircleTransition = {
  duration: 0.5,
  yoyo: Infinity,
  ease: 'easeInOut'
};

const Loader = () => {
  return (
    <motion.div 
      className="loader-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="loading-container"
        variants={loadingContainerVariants}
        initial="start"
        animate="end"
        style={{ display: 'flex', gap: '12px' }}
      >
        <motion.span
          className="loading-circle"
          variants={loadingCircleVariants}
          transition={loadingCircleTransition}
          style={{
            display: 'block',
            width: '12px',
            height: '12px',
            backgroundColor: 'var(--primary-color)',
            borderRadius: '50%'
          }}
        />
        <motion.span
          className="loading-circle"
          variants={loadingCircleVariants}
          transition={{...loadingCircleTransition, delay: 0.1}}
          style={{
            display: 'block',
            width: '12px',
            height: '12px',
            backgroundColor: 'var(--primary-color)',
            borderRadius: '50%'
          }}
        />
        <motion.span
          className="loading-circle"
          variants={loadingCircleVariants}
          transition={{...loadingCircleTransition, delay: 0.2}}
          style={{
            display: 'block',
            width: '12px',
            height: '12px',
            backgroundColor: 'var(--primary-color)',
            borderRadius: '50%'
          }}
        />
      </motion.div>
      <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading tasks...</p>
    </motion.div>
  );
};

export default Loader; 