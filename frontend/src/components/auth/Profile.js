import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaEnvelope, FaSignOutAlt, FaUser, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import '../../styles/auth.css';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Here you would call your API to update the user profile
      // For now we'll just update the user state
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || ''
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  return (
    <motion.div 
      className="profile-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-header">
        <motion.div 
          className="profile-avatar"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </motion.div>
        
        {!isEditing ? (
          <>
            <motion.h1 
              className="profile-name"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {user?.name}
            </motion.h1>
            
            <motion.p 
              className="profile-email"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {user?.email}
            </motion.p>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="profile-edit-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            
            <div className="form-actions">
              <button
                type="button"
                onClick={cancelEdit}
                className="btn-cancel"
                disabled={loading}
              >
                <FaTimes className="icon-left" />
                Cancel
              </button>
              
              <button
                type="submit"
                className="btn-save"
                disabled={loading}
              >
                {loading ? 'Saving...' : (
                  <>
                    <FaSave className="icon-left" />
                    Save
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
      
      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}
      
      <motion.div 
        className="profile-info"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="info-header">
          <h2>Profile Information</h2>
          
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)} 
              className="edit-profile-btn"
            >
              <FaEdit className="icon-left" />
              Edit Profile
            </button>
          )}
        </div>
        
        <div className="info-group">
          <div className="info-label">
            <FaUser className="inline-block mr-2 mb-1" />
            Full Name
          </div>
          <div className="info-value">{user?.name}</div>
        </div>
        
        <div className="info-group">
          <div className="info-label">
            <FaEnvelope className="inline-block mr-2 mb-1" />
            Email Address
          </div>
          <div className="info-value">{user?.email}</div>
        </div>
        
        <div className="info-group">
          <div className="info-label">
            <FaUser className="inline-block mr-2 mb-1" />
            Account Status
          </div>
          <div className="info-value">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              Active
            </span>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <button
          onClick={logout}
          className="logout-btn"
        >
          <FaSignOutAlt className="inline-block mr-2" />
          Logout
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Profile; 