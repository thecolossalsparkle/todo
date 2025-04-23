import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Define the API base URL
const API_URL = 'http://localhost:5001/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [serverAvailable, setServerAvailable] = useState(true);

  // Check if the backend server is available
  useEffect(() => {
    const checkServerAvailability = async () => {
      try {
        console.log('Attempting to connect to:', `${API_URL}/auth`);
        const response = await axios.get(`${API_URL}/auth`);
        console.log('Server response:', response.data);
        
        if (response.data && response.data.success) {
          setServerAvailable(true);
          setError(null);
        } else {
          throw new Error('Invalid server response');
        }
      } catch (error) {
        console.error('Backend server check failed:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        setServerAvailable(false);
        setError('Cannot connect to the server. Please ensure the backend server is running.');
      }
    };

    checkServerAvailability();
    const intervalId = setInterval(checkServerAvailability, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Set auth token in axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      if (!token) {
        setLoading(false);
        setInitialCheckDone(true);
        return;
      }
      
      try {
        setLoading(true);
        const endpoint = `${API_URL}/auth/me`;
        console.log('Checking user auth status at:', endpoint);
        
        const response = await axios.get(endpoint);
        console.log('Auth check response:', response.data);
        
        if (!response.data || !response.data.success) {
          console.error('Auth check returned unsuccessful response:', response.data);
          throw new Error('Failed to validate authentication');
        }
        
        const { user } = response.data;
        
        // Transform user object to match frontend expectations
        const transformedUser = {
          ...user,
          id: user.id || user._id
        };
        
        setUser(transformedUser);
      } catch (error) {
        console.error('Authentication check failed:', error);
        
        // Handle specific error cases
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log('Error response data:', error.response.data);
          console.log('Error response status:', error.response.status);
          console.log('Error response headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Error request details:', error.request);
          setServerAvailable(false);
          setError('Cannot connect to the server. Please ensure the backend server is running.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error message:', error.message);
          console.log('Error config:', error.config);
        }
        
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
        setInitialCheckDone(true);
      }
    };

    // Only run when serverAvailable changes or token changes
    // This prevents constant re-renders and flickering
    if (serverAvailable && !initialCheckDone) {
      checkUserLoggedIn();
    }
  }, [token, serverAvailable, initialCheckDone]);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Making registration request to:', `${API_URL}/auth/register`);
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      console.log('Registration response:', response.data);
      
      if (response.data && response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        return { success: true };
      } else {
        throw new Error(response.data?.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (userData) => {
    if (!serverAvailable) {
      return { 
        success: false, 
        error: 'Cannot connect to the server. Please ensure the backend server is running.' 
      };
    }

    try {
      setLoading(true);
      setError(null);
      
      const endpoint = `${API_URL}/auth/login`;
      console.log('Making login request to:', endpoint);
      console.log('With data:', { ...userData, password: userData.password ? '******' : undefined });
      
      const response = await axios.post(endpoint, userData);
      console.log('Login response full:', response);
      console.log('Login response data:', response.data);
      
      if (!response.data || !response.data.success) {
        console.error('Server returned unsuccessful response:', response.data);
        return { 
          success: false, 
          error: response.data?.message || 'Login failed. Please try again.'
        };
      }
      
      const { token, user } = response.data;
      
      if (!token || !user) {
        console.error('Missing token or user in response:', response.data);
        return { 
          success: false, 
          error: 'Invalid response from server. Missing token or user data.'
        };
      }
      
      // Transform backend user object to match frontend expectations if needed
      const transformedUser = {
        ...user,
        // Ensure we use the right id field - backend sends id but we might need _id
        id: user.id || user._id
      };
      
      console.log('Transformed user data:', transformedUser);
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(transformedUser);
      return { success: true };
    } catch (error) {
      console.error('Login error details:', error);
      
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('Error response data:', error.response.data);
        console.log('Error response status:', error.response.status);
        console.log('Error response headers:', error.response.headers);
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        // The request was made but no response was received
        console.log('Error request details:', error.request);
        setServerAvailable(false);
        errorMessage = 'Cannot connect to the server. Please ensure the backend server is running.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error message:', error.message);
        console.log('Error config:', error.config);
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
    window.location.href = '/login'; // Force a full page refresh to clear any state
  };

  // Update user profile
  const updateProfile = async (userData) => {
    if (!serverAvailable) {
      throw new Error('Cannot connect to the server. Please ensure the backend server is running.');
    }

    if (!token) {
      throw new Error('You must be logged in to update your profile');
    }

    try {
      setLoading(true);
      setError(null);
      
      // For now, we'll just update the user state without making an API call
      // In a real application, you would make an API call to update the user in the database
      // const endpoint = `${API_URL}/auth/update-profile`;
      // const response = await axios.put(endpoint, userData);
      // const updatedUser = response.data.user;
      
      // Simulate server delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the user state with the new data
      const updatedUser = {
        ...user,
        name: userData.name,
        email: userData.email
      };
      
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        setServerAvailable(false);
        errorMessage = 'Cannot connect to the server. Please ensure the backend server is running.';
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        loading, 
        error,
        initialCheckDone,
        serverAvailable,
        register, 
        login, 
        logout,
        updateProfile,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext; 