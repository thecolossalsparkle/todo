import React from 'react';
import { Link } from 'react-router-dom';
import { FaTasks, FaListAlt, FaClock, FaRegStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const featureItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100 }
  }
};

const HomePage = () => {
  return (
    <div>
      <motion.section 
        style={{ textAlign: 'center', padding: '3rem 0' }}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <motion.h1 
          style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}
        >
          Welcome to TaskFlow
        </motion.h1>
        <motion.p 
          style={{ fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', marginBottom: '2rem', color: 'var(--text-secondary)' }}
        >
          Streamline your workflow with our professional task management solution
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/todos" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
            Get Started
          </Link>
        </motion.div>
      </motion.section>

      <motion.section 
        style={{ padding: '3rem 0', backgroundColor: 'var(--card-color)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--box-shadow)' }}
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container">
          <motion.h2 
            style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--primary-dark)' }}
            variants={fadeIn}
          >
            Key Features
          </motion.h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <motion.div style={{ textAlign: 'center' }} variants={featureItem}>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <FaTasks style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }} />
              </motion.div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Task Management</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Create, edit, and organize tasks with a clean, intuitive interface.</p>
            </motion.div>
            
            <motion.div style={{ textAlign: 'center' }} variants={featureItem}>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <FaListAlt style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }} />
              </motion.div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Priority Levels</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Set priorities to help focus on what matters most to you.</p>
            </motion.div>
            
            <motion.div style={{ textAlign: 'center' }} variants={featureItem}>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <FaClock style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }} />
              </motion.div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Due Dates</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Never miss a deadline with our intuitive date tracking.</p>
            </motion.div>
            
            <motion.div style={{ textAlign: 'center' }} variants={featureItem}>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              >
                <FaRegStar style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }} />
              </motion.div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Status Tracking</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Monitor progress as tasks move from pending to completed.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      <motion.section 
        style={{ padding: '3rem 0', textAlign: 'center' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="container">
          <motion.h2 
            style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Ready to Get Organized?
          </motion.h2>
          <motion.p 
            style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Start managing your tasks efficiently and boost your productivity.
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/todos" className="btn btn-primary">
              View My Tasks
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage; 