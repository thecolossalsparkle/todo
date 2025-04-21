import React from 'react';
import { FaHeart, FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Enhanced desktop animations
const wavePathVariants = {
  initial: { opacity: 0, pathLength: 0 },
  animate: { 
    opacity: 1, 
    pathLength: 1,
    transition: { 
      duration: 2, 
      ease: "easeInOut" 
    }
  }
};

const footerItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: custom => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: custom * 0.1
    }
  })
};

const socialIconVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: custom => ({
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15,
      delay: 0.3 + (custom * 0.1)
    }
  }),
  hover: { 
    y: -8, 
    scale: 1.15,
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: { scale: 0.95 }
};

const heartIconVariants = {
  animate: {
    scale: [1, 1.2, 1],
    color: ['#ff5a5f', '#ff8086', '#ff5a5f'],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <motion.path 
            variants={wavePathVariants}
            initial="initial"
            animate="animate"
            fill="rgba(94, 96, 206, 0.1)" 
            d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,218.7C672,224,768,224,864,213.3C960,203,1056,181,1152,181.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
          </motion.path>
        </svg>
      </div>
      
      <div className="container footer-container">
        <div className="footer-content">
          <div className="footer-logo">
            <motion.h2 
              variants={footerItemVariants}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              TaskFlow
            </motion.h2>
            <motion.p
              variants={footerItemVariants}
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              Streamline your workflow and boost your productivity with our intuitive task management solution designed for professionals and teams.
            </motion.p>
          </div>
          
          <div className="footer-social">
            <motion.a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="twitter-icon"
              variants={socialIconVariants}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              whileHover="hover"
              whileTap="tap"
            >
              <FaTwitter />
            </motion.a>
            <motion.a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="linkedin-icon"
              variants={socialIconVariants}
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              whileHover="hover"
              whileTap="tap"
            >
              <FaLinkedin />
            </motion.a>
            <motion.a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-icon"
              variants={socialIconVariants}
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              whileHover="hover"
              whileTap="tap"
            >
              <FaGithub />
            </motion.a>
          </div>
        </div>
        
        <motion.div 
          className="footer-credits"
          variants={footerItemVariants}
          custom={4}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <p>
            &copy; {currentYear} TaskFlow. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 