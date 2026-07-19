import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-sports-grayBg">
          <div className="bg-white rounded-2xl p-8 max-w-md shadow-premium border border-slate-100 space-y-4">
            <span className="text-4xl" role="img" aria-label="error icon">⚠️</span>
            <h2 className="text-2xl font-bold text-sports-navy font-display">Something went wrong</h2>
            <p className="text-sm text-sports-muted leading-relaxed">
              An unexpected error occurred in this dashboard. Please refresh the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-lg text-xs font-bold text-white bg-sports-blue hover:bg-sports-blueLight transition-all focus:outline-none focus:ring-2 focus:ring-sports-blueLight"
              role="button"
            >
              Refresh Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
