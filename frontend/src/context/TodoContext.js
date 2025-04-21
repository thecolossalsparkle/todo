import { createContext, useReducer, useContext, useEffect } from 'react';
import { todoApi } from '../services/api';
import { useAuth } from './AuthContext';

const TodoContext = createContext();

// Initial state
const initialState = {
  todos: [],
  loading: false,
  error: null,
  success: false,
};

// Reducer function
const todoReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null, success: false };
    case 'GET_TODOS':
      return { ...state, todos: action.payload, loading: false, error: null };
    case 'ADD_TODO':
      return { 
        ...state, 
        todos: [action.payload, ...state.todos], 
        loading: false,
        success: true 
      };
    case 'UPDATE_TODO':
      return { 
        ...state, 
        todos: state.todos.map(todo => 
          todo._id === action.payload._id ? action.payload : todo
        ),
        loading: false,
        success: true 
      };
    case 'DELETE_TODO':
      return { 
        ...state, 
        todos: state.todos.filter(todo => todo._id !== action.payload),
        loading: false,
        success: true 
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false, success: false };
    case 'RESET_STATUS':
      return { ...state, error: null, success: false };
    case 'CLEAR_TODOS':
      return { ...state, todos: [], loading: false, error: null };
    default:
      return state;
  }
};

// Provider component
export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const { isAuthenticated, loading: authLoading, token } = useAuth();
  
  // Load todos when authenticated
  useEffect(() => {
    // Only fetch todos if we're authenticated and auth check is complete
    if (isAuthenticated && !authLoading && token) {
      console.log('User authenticated, fetching todos');
      getTodos();
    } else if (!isAuthenticated && !authLoading) {
      // Clear todos if not authenticated
      dispatch({ type: 'CLEAR_TODOS' });
    }
  }, [isAuthenticated, authLoading, token]);

  // Get all todos
  const getTodos = async () => {
    // Don't try to fetch if not authenticated
    if (!isAuthenticated) {
      console.log('Not authenticated, skipping todo fetch');
      return [];
    }
    
    dispatch({ type: 'SET_LOADING' });
    try {
      console.log('Fetching todos from API');
      const data = await todoApi.getAll();
      dispatch({ type: 'GET_TODOS', payload: data });
      return data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      
      // Handle 401 Unauthorized errors specially
      if (error.response && error.response.status === 401) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: 'Authentication required. Please log in again.' 
        });
      } else {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error.response?.data?.message || 'Failed to fetch todos' 
        });
      }
      return [];
    }
  };

  // Add a new todo
  const addTodo = async (todoData) => {
    if (!isAuthenticated) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'You must be logged in to add todos' 
      });
      throw new Error('Authentication required');
    }
    
    dispatch({ type: 'SET_LOADING' });
    try {
      const data = await todoApi.create(todoData);
      dispatch({ type: 'ADD_TODO', payload: data });
      return data;
    } catch (error) {
      console.error('Error adding todo:', error);
      
      if (error.response && error.response.status === 401) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: 'Authentication required. Please log in again.' 
        });
      } else {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error.response?.data?.message || 'Failed to add todo' 
        });
      }
      throw error;
    }
  };

  // Update a todo
  const updateTodo = async (id, todoData) => {
    if (!isAuthenticated) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'You must be logged in to update todos' 
      });
      throw new Error('Authentication required');
    }
    
    dispatch({ type: 'SET_LOADING' });
    try {
      if (!id) {
        throw new Error('Todo ID is required for update');
      }
      const data = await todoApi.update(id, todoData);
      dispatch({ type: 'UPDATE_TODO', payload: data });
      return data;
    } catch (error) {
      console.error('Error updating todo:', error);
      
      if (error.response && error.response.status === 401) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: 'Authentication required. Please log in again.' 
        });
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update todo';
        dispatch({ 
          type: 'SET_ERROR', 
          payload: errorMessage
        });
      }
      throw error;
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    if (!isAuthenticated) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'You must be logged in to delete todos' 
      });
      throw new Error('Authentication required');
    }
    
    dispatch({ type: 'SET_LOADING' });
    try {
      if (!id) {
        throw new Error('Todo ID is required for deletion');
      }
      const response = await todoApi.delete(id);
      dispatch({ type: 'DELETE_TODO', payload: id });
      return id;
    } catch (error) {
      console.error('Error deleting todo:', error);
      
      if (error.response && error.response.status === 401) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: 'Authentication required. Please log in again.' 
        });
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete todo';
        dispatch({ 
          type: 'SET_ERROR', 
          payload: errorMessage
        });
      }
      throw error;
    }
  };

  // Reset status
  const resetStatus = () => {
    dispatch({ type: 'RESET_STATUS' });
  };

  return (
    <TodoContext.Provider
      value={{
        ...state,
        getTodos,
        addTodo,
        updateTodo,
        deleteTodo,
        resetStatus
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

// Custom hook to use the todo context
export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
}; 