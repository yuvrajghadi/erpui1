'use client';

import React from 'react';

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details only in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    this.setState({ errorInfo });
    
    // Log to external service in production (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {
      // Sentry or other error tracking service would go here
    }
  }

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDev = process.env.NODE_ENV === 'development';
      
      return (
        <div style={{ 
          padding: 24, 
          maxWidth: 600, 
          margin: '50px auto',
          backgroundColor: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            marginBottom: 8, 
            color: '#ff4d4f',
            fontSize: 24 
          }}>
            ⚠️ Something went wrong
          </h2>
          <p style={{ 
            marginBottom: 16,
            color: '#595959',
            lineHeight: 1.6
          }}>
            The application encountered an unexpected error. This might be due to:
          </p>
          <ul style={{ 
            marginBottom: 16,
            paddingLeft: 20,
            color: '#595959'
          }}>
            <li>Network connectivity issues</li>
            <li>Missing configuration</li>
            <li>Temporary server problems</li>
          </ul>
          
          {isDev && this.state.error && (
            <details style={{
              marginBottom: 16,
              padding: 12,
              backgroundColor: '#f5f5f5',
              borderRadius: 4,
              fontSize: 13,
              fontFamily: 'monospace'
            }}>
              <summary style={{ cursor: 'pointer', marginBottom: 8, fontWeight: 600 }}>
                Error Details (Development Only)
              </summary>
              <div style={{ color: '#cf1322' }}>
                <strong>Error:</strong> {this.state.error.message}
              </div>
              {this.state.errorInfo && (
                <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
                  <strong>Stack Trace:</strong>
                  <pre style={{ 
                    overflow: 'auto', 
                    maxHeight: 200,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </details>
          )}
          
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              onClick={this.handleReload}
              style={{
                background: '#1677ff',
                border: 'none',
                borderRadius: 6,
                color: '#fff',
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                transition: 'background 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#4096ff'}
              onMouseOut={(e) => e.currentTarget.style.background = '#1677ff'}
            >
              🔄 Reload Page
            </button>
            
            {isDev && (
              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  background: '#fff',
                  border: '1px solid #d9d9d9',
                  borderRadius: 6,
                  color: '#595959',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500,
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#1677ff';
                  e.currentTarget.style.color = '#1677ff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#d9d9d9';
                  e.currentTarget.style.color = '#595959';
                }}
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
