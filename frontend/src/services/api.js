import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

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
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      // Clear token on 401 Unauthorized response
      localStorage.removeItem('token');
    }
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
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await apiClient.get('/todos');
    return response.data;
  },
  
  // Get a single todo by ID
  getById: async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const validId = ensureValidId(id);
    const response = await apiClient.get(`/todos/${validId}`);
    return response.data;
  },
  
  // Create a new todo
  create: async (todoData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await apiClient.post('/todos', todoData);
    return response.data;
  },
  
  // Update a todo
  update: async (id, todoData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const validId = ensureValidId(id);
    const response = await apiClient.put(`/todos/${validId}`, todoData);
    return response.data;
  },
  
  // Delete a todo
  delete: async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const validId = ensureValidId(id);
    const response = await apiClient.delete(`/todos/${validId}`);
    return response.data;
  }
};

// Create the API object
const api = {
  todo: todoApi
};

export default api; 