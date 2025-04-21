import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import '../../styles/auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Simple validation
    if (!formData.email || !formData.password) {
      setFormError('Please fill in all fields');
      return;
    }
    
    try {
      console.log('Attempting to login with:', { email: formData.email, password: '******' });
      
      const result = await login(formData);
      console.log('Login result:', result);
      
      if (result.success) {
        navigate('/');
      } else {
        setFormError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Error during login:', err);
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
        <FaSignInAlt className="inline-block mr-2 mb-1" />
        Welcome Back
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
          transition={{ delay: 0.4 }}
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
            placeholder="Your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </motion.div>
        
        <motion.div 
          className="form-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            className="auth-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Logging in...
              </>
            ) : (
              <>
                <FaSignInAlt className="inline-block mr-2" />
                Login
              </>
            )}
          </button>
          
          <Link className="auth-link" to="/register">
            Don't have an account? Register
          </Link>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Login; 