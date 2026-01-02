
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component to catch and handle UI errors gracefully.
 */
// Use explicit Component inheritance to ensure React's lifecycle methods and properties are correctly typed.
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  /**
   * Resets the error state and reloads the application.
   */
  private handleReset = () => {
    // setState is a method inherited from React.Component.
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
          <div className="text-center max-w-md p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/40 rounded-3xl flex items-center justify-center mx-auto mb-6 text-rose-600">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">Something went wrong</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium">
              An unexpected UI error occurred. We've been notified and are looking into it.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-none"
            >
              <RotateCcw className="w-4 h-4" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    // props is inherited from the React.Component base class.
    return this.props.children;
  }
}
