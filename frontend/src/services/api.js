import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token from localStorage
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => {
    // Only consider response with success: true or status 2xx as successful
    if (response.data && response.data.success === false) {
      return Promise.reject(new Error(response.data.message || 'Operation failed'));
    }
    return response;
  },
  error => {
    // Handle 401 errors (unauthorized)
    if (error.response && error.response.status === 401) {
      console.error('Authentication error:', error.response.data);
      
      // If 401 error occurs on a protected route, clear token
      // This will trigger a logout process
      if (error.config.url !== '/auth/login' && error.config.url !== '/auth/register') {
        console.log('Unauthorized access, clearing token');
        localStorage.removeItem('token');
        // Optionally, you could redirect to login page here
      }
    }
    
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Helper function to ensure valid IDs
const ensureValidId = (id) => {
  if (!id) throw new Error('ID is required');
  return String(id).trim();
};

// Todo API calls
export const todoApi = {
  // Get all todos
  getAll: async () => {
    // Check if token exists first
    if (!localStorage.getItem('token')) {
      throw new Error('Authentication required');
    }
    
    const response = await apiClient.get('/todos');
    return response.data;
  },
  
  // Get a single todo by ID
  getById: async (id) => {
    if (!localStorage.getItem('token')) {
      throw new Error('Authentication required');
    }
    
    const validId = ensureValidId(id);
    const response = await apiClient.get(`/todos/${validId}`);
    return response.data;
  },
  
  // Create a new todo
  create: async (todoData) => {
    if (!localStorage.getItem('token')) {
      throw new Error('Authentication required');
    }
    
    const response = await apiClient.post('/todos', todoData);
    return response.data;
  },
  
  // Update a todo
  update: async (id, todoData) => {
    if (!localStorage.getItem('token')) {
      throw new Error('Authentication required');
    }
    
    const validId = ensureValidId(id);
    console.log('Sending update to API with ID:', validId);
    const response = await apiClient.put(`/todos/${validId}`, todoData);
    return response.data;
  },
  
  // Delete a todo
  delete: async (id) => {
    if (!localStorage.getItem('token')) {
      throw new Error('Authentication required');
    }
    
    const validId = ensureValidId(id);
    console.log('Sending delete to API with ID:', validId);
    const response = await apiClient.delete(`/todos/${validId}`);
    return response.data;
  }
};

export default {
  todo: todoApi
}; 