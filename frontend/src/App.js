import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import TodoPage from './pages/TodoPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/auth/Profile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import ServerStatus from './components/ServerStatus';
import { TodoProvider } from './context/TodoContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import './styles/auth.css';

function App() {
  // Global error handler for uncaught errors
  useEffect(() => {
    const handleError = (event) => {
      console.error('Uncaught error:', event.error);
      // You could also send errors to a monitoring service here
    };

    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <TodoProvider>
              <div className="app-container">
                <Header />
                <ServerStatus />
                <main className="container">
                  <ErrorBoundary>
                    <Suspense fallback={<div className="loading">Loading...</div>}>
                      <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={<HomePage />} />
                        <Route path="/todos" element={
                          <ProtectedRoute>
                            <TodoPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        } />
                      </Routes>
                    </Suspense>
                  </ErrorBoundary>
                </main>
                <Footer />
              </div>
            </TodoProvider>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
