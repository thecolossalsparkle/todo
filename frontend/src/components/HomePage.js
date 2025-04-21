import React from 'react';
import { FaCheckCircle, FaListUl, FaRegClock, FaStar, FaChartLine, FaMobileAlt, FaCloudDownloadAlt, FaUsers, FaShieldAlt, FaBell, FaCalendarAlt, FaTags, FaRedo, FaPaperclip, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to TaskFlow
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="hero-tagline"
        >
          The intelligent task management solution for individuals and teams
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="hero-description"
        >
          TaskFlow helps you organize your work, prioritize tasks, and boost productivity with our intuitive interface and powerful features.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="hero-buttons"
        >
          <Link to={isAuthenticated ? "/todos" : "/register"} className="btn btn-primary">
            {isAuthenticated ? "My Tasks" : "Get Started Free"}
          </Link>
          {!isAuthenticated && (
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
          )}
        </motion.div>
      </section>

      {/* Product Highlights Section */}
      <section className="product-highlight-section">
        <h2>Why Choose TaskFlow?</h2>
        <div className="highlight-grid">
          <div className="highlight-card">
            <h3>Easy to Use</h3>
            <p>Intuitive interface designed for maximum productivity with minimal learning curve.</p>
          </div>
          <div className="highlight-card">
            <h3>Free to Start</h3>
            <p>Create an account and start organizing your tasks at no cost.</p>
          </div>
          <div className="highlight-card">
            <h3>Secure & Reliable</h3>
            <p>Your data is protected with industry-standard security protocols.</p>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-container">
              <FaListUl />
            </div>
            <h3>Task Management</h3>
            <p>Create, edit, and organize tasks with a clean, intuitive interface.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-container">
              <FaCheckCircle />
            </div>
            <h3>Priority Levels</h3>
            <p>Set priorities to help focus on what matters most to you.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-container">
              <FaRegClock />
            </div>
            <h3>Due Dates</h3>
            <p>Never miss a deadline with our intuitive date tracking.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-container">
              <FaStar />
            </div>
            <h3>Status Tracking</h3>
            <p>Monitor progress as tasks move from pending to completed.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-container">
              <FaChartLine />
            </div>
            <h3>Performance Analytics</h3>
            <p>Track your productivity with detailed insights and progress reports.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-container">
              <FaUsers />
            </div>
            <h3>Team Collaboration</h3>
            <p>Share tasks and collaborate with team members in real-time.</p>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2>How TaskFlow Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Sign Up for Free</h3>
            <p>Create your account in seconds with just your name and email.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Create & Organize Tasks</h3>
            <p>Add tasks with descriptions, priorities, and deadlines.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Track Your Progress</h3>
            <p>Monitor task statuses and celebrate completed items.</p>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>Testimonials</h2>
        <div className="testimonials-container">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"TaskFlow has transformed how our team manages projects. The intuitive interface and powerful features have boosted our productivity by 30%."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">JD</div>
              <div className="author-info">
                <h4>Jane Doe</h4>
                <p>Project Manager, Tech Solutions Inc.</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"As a freelancer, keeping track of multiple client projects used to be a nightmare. With TaskFlow, everything is organized and I never miss deadlines anymore."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">JS</div>
              <div className="author-info">
                <h4>John Smith</h4>
                <p>Independent Consultant</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Additional Features Section */}
      <section className="additional-features-section">
        <h2>More Powerful Features</h2>
        <div className="additional-features-grid">
          <div className="additional-feature">
            <FaMobileAlt className="additional-feature-icon" />
            <div>
              <h3>Mobile Access</h3>
              <p>Access your tasks from anywhere with our mobile-friendly interface.</p>
            </div>
          </div>
          <div className="additional-feature">
            <FaCloudDownloadAlt className="additional-feature-icon" />
            <div>
              <h3>Cloud Sync</h3>
              <p>Your data is automatically synced across all your devices.</p>
            </div>
          </div>
          <div className="additional-feature">
            <FaShieldAlt className="additional-feature-icon" />
            <div>
              <h3>Secure Data</h3>
              <p>Enterprise-grade security keeps your information safe and protected.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2>Ready to Get Organized?</h2>
        <p>Join thousands of users who have transformed their productivity with TaskFlow.</p>
        <div className="cta-buttons">
          <Link to={isAuthenticated ? "/todos" : "/register"} className="btn btn-primary">
            {isAuthenticated ? "View My Tasks" : "Create Free Account"}
          </Link>
          {!isAuthenticated && (
            <Link to="/login" className="btn btn-outline">
              Login to Your Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage; 