import { useState } from 'react';

/**
 * Custom hook for handling API errors
 * @returns {Object} - Error state and functions to handle errors
 */
const useApiError = () => {
  const [error, setError] = useState(null);

  /**
   * Handle API error
   * @param {Error} err - The error object
   * @returns {void}
   */
  const handleError = (err) => {
    const errorMessage = 
      err.response?.data?.message || 
      err.message || 
      'An unexpected error occurred';
    
    setError(errorMessage);
    
    // Auto clear error after 5 seconds
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  /**
   * Clear error manually
   * @returns {void}
   */
  const clearError = () => {
    setError(null);
  };

  return { error, handleError, clearError };
};

export default useApiError; 