import React from 'react';
import '../styles/auth.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('Error caught by error boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary">
          <h2 className="error-title">Something went wrong</h2>
          <details className="error-details">
            <summary>Error details</summary>
            <pre className="error-message">{this.state.error && this.state.error.toString()}</pre>
            <pre className="error-stack">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          <button 
            className="error-reset-btn"
            onClick={() => window.location.reload()}
          >
            Refresh the page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 