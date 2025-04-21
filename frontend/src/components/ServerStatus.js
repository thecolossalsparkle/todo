import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaServer, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const ServerStatus = () => {
  const { serverAvailable, error } = useAuth();
  const [visible, setVisible] = useState(false);
  
  // Add a delay before showing the error to prevent flickering
  useEffect(() => {
    let timeout;
    if (!serverAvailable) {
      // Wait 2 seconds before showing the error
      timeout = setTimeout(() => setVisible(true), 2000);
    } else {
      setVisible(false);
    }
    
    return () => clearTimeout(timeout);
  }, [serverAvailable]);

  // Don't show anything if server is available or if it's not yet determined as unavailable
  if (serverAvailable || !visible) {
    return null;
  }

  return (
    <div className="server-status-error">
      <div className="server-status-icon">
        <FaExclamationTriangle />
      </div>
      <div className="server-status-content">
        <h3>Server Connection Error</h3>
        <p>
          {error || "Cannot connect to the backend server. Please ensure it's running at http://localhost:5000"}
        </p>
        <div className="server-status-help">
          <FaServer className="inline-block mr-2" />
          <span>
            Run <code>cd backend && npm run dev</code> in your terminal
          </span>
        </div>
      </div>
      <button 
        className="server-status-close"
        onClick={() => setVisible(false)}
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default React.memo(ServerStatus); 