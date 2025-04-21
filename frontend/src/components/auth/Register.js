import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaUser, FaUserPlus } from 'react-icons/fa';
import '../../styles/auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState('');
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Simple validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    
    try {
      // Register user - we don't send confirmPassword to the backend
      const { confirmPassword, ...userData } = formData;
      console.log('Attempting to register with:', { ...userData, password: '******' });
      
      // Clear any previous errors
      setFormError('');
      
      const result = await register(userData);
      console.log('Registration result:', result);
      
      if (result && result.success) {
        console.log('Registration successful, navigating to home');
        navigate('/');
      } else {
        console.error('Registration failed:', result);
        setFormError(result?.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Exception during registration:', err);
      setFormError('An unexpected error occurred. Please try again later.');
    }
  };

  // If there's an error from the auth context, show it
  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

  return (
    <motion.div 
      className="auth-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="auth-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <FaUserPlus className="inline-block mr-2 mb-1" />
        Create Account
      </motion.h1>
      
      {formError && (
        <motion.div 
          className="auth-error"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          {formError}
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <motion.div 
          className="form-group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="form-label" htmlFor="name">
            <FaUser className="inline-block mr-2 mb-1" />
            Name
          </label>
          <input
            className="form-control"
            id="name"
            type="text"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </motion.div>
        
        <motion.div 
          className="form-group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="form-label" htmlFor="email">
            <FaEnvelope className="inline-block mr-2 mb-1" />
            Email
          </label>
          <input
            className="form-control"
            id="email"
            type="email"
            name="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </motion.div>
        
        <motion.div 
          className="form-group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="form-label" htmlFor="password">
            <FaLock className="inline-block mr-2 mb-1" />
            Password
          </label>
          <input
            className="form-control"
            id="password"
            type="password"
            name="password"
            placeholder="Your password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </motion.div>
        
        <motion.div 
          className="form-group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label className="form-label" htmlFor="confirmPassword">
            <FaLock className="inline-block mr-2 mb-1" />
            Confirm Password
          </label>
          <input
            className="form-control"
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
          />
        </motion.div>
        
        <motion.div 
          className="form-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <button
            className="auth-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Registering...
              </>
            ) : (
              <>
                <FaUserPlus className="inline-block mr-2" />
                Register
              </>
            )}
          </button>
          
          <Link className="auth-link" to="/login">
            Already have an account? Login
          </Link>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Register; 