import React from "react";

/**
 * ErrorBoundary
 *
 * React error boundaries catch JavaScript errors thrown during
 * rendering, in lifecycle methods, or in constructors of the
 * component tree below them — things a try/catch around an API call
 * can never catch, because those happen during render, not inside an
 * event handler.
 *
 * This must be a class component; React does not yet provide a Hook
 * equivalent of getDerivedStateFromError/componentDidCatch.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In a real production app this is where you'd forward the error
    // to a monitoring service (Sentry, Bugsnag, etc.).
    console.error("Uncaught UI error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <p>An unexpected error occurred while rendering this page.</p>
          <button className="btn" onClick={this.handleReset}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
