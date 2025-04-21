import React, { useState, useEffect, memo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTasks, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// Enhanced logo animation for desktop
const logoVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20
    }
  },
  hover: {
    scale: 1.05,
    rotate: -5,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 15
    }
  },
  tap: { scale: 0.95 }
};

const navLinkVariants = {
  initial: { y: -10, opacity: 0 },
  animate: (index) => ({
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25,
      delay: index * 0.1
    }
  }),
  hover: {
    y: -3,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20
    }
  }
};

const avatarVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 20,
      delay: 0.3
    }
  },
  hover: {
    scale: 1.08,
    boxShadow: "0 6px 12px rgba(94, 96, 206, 0.3)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15
    }
  },
  tap: { scale: 0.95 }
};

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.9, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -10,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

const dropdownItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { 
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
};

// Memo-ize the Header component to prevent unnecessary re-renders
const Header = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Use a throttled scroll handler to improve performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <motion.div 
              className="logo-icon"
              variants={logoVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
            >
              <FaTasks />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 500,
                damping: 25,
                delay: 0.1
              }}
            >
              TaskFlow
            </motion.h1>
          </Link>
        </div>

        <div className="header-right">
          <nav className="nav-links desktop-nav">
            <div className="nav-links-container">
              {isAuthenticated ? (
                <>
                  <motion.div
                    custom={0}
                    variants={navLinkVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                  >
                    <Link 
                      to="/" 
                      className={isActive('/') ? 'active' : ''}
                    >
                      Home
                    </Link>
                  </motion.div>
                  <motion.div
                    custom={1}
                    variants={navLinkVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                  >
                    <Link 
                      to="/todos" 
                      className={isActive('/todos') ? 'active' : ''}
                    >
                      My Tasks
                    </Link>
                  </motion.div>
                  <div className="user-avatar-container" ref={dropdownRef}>
                    <motion.button
                      onClick={toggleDropdown}
                      className="user-avatar"
                      aria-label="User menu"
                      variants={avatarVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </motion.button>
                    
                    <AnimatePresence>
                      {showDropdown && (
                        <motion.div 
                          className="user-dropdown"
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <div className="user-dropdown-header">
                            <div className="dropdown-avatar">
                              {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="dropdown-user-info">
                              <p className="dropdown-user-name">{user?.name}</p>
                              <p className="dropdown-user-email">{user?.email}</p>
                            </div>
                          </div>
                          <div className="user-dropdown-menu">
                            <motion.div
                              variants={dropdownItemVariants}
                              className="dropdown-item"
                            >
                              <Link to="/profile" onClick={() => setShowDropdown(false)}>
                                <FaUser className="dropdown-icon" />
                                <span>Profile</span>
                              </Link>
                            </motion.div>
                            <motion.div
                              variants={dropdownItemVariants}
                              className="dropdown-item"
                            >
                              <button onClick={() => { logout(); setShowDropdown(false); }}>
                                <FaSignOutAlt className="dropdown-icon" />
                                <span>Logout</span>
                              </button>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <motion.div
                    custom={0}
                    variants={navLinkVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                  >
                    <Link 
                      to="/" 
                      className={isActive('/') ? 'active' : ''}
                    >
                      Home
                    </Link>
                  </motion.div>
                  <motion.div
                    custom={1}
                    variants={navLinkVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                  >
                    <Link 
                      to="/login" 
                      className={`nav-button ${isActive('/login') ? 'active' : ''}`}
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div
                    custom={2}
                    variants={navLinkVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                  >
                    <Link 
                      to="/register" 
                      className={`nav-button primary ${isActive('/register') ? 'active' : ''}`}
                    >
                      Register
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
});

export default Header; 