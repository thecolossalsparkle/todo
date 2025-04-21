import React from 'react';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';

// Desktop-optimized animation variants
const buttonVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
      delay: 0.3
    }
  },
  hover: { 
    scale: 1.1, 
    y: -8,
    boxShadow: "0 12px 30px rgba(94, 96, 206, 0.5)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15
    }
  },
  tap: { 
    scale: 0.9,
    boxShadow: "0 6px 15px rgba(94, 96, 206, 0.4)"
  }
};

const iconVariants = {
  initial: { rotate: 0 },
  animate: { 
    rotate: 180,
    transition: { 
      duration: 0.6, 
      ease: [0.4, 0, 0.2, 1] 
    }
  },
  hover: { 
    scale: 1.2,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 10
    }
  }
};

const FloatingActionButton = ({ onClick }) => {
  return (
    <motion.button
      className="floating-action-button"
      onClick={onClick}
      variants={buttonVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
    >
      <motion.div
        variants={iconVariants}
        animate="animate"
        whileHover="hover"
      >
        <FaPlus />
      </motion.div>
    </motion.button>
  );
};

export default FloatingActionButton; 