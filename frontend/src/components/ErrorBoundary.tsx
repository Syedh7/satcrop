import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Sprout, RefreshCw, Home, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-emerald-950/80 border border-emerald-800/80 text-brand-400 flex items-center justify-center shadow-2xl">
            <Sprout className="w-8 h-8 text-emerald-400" />
          </div>

          <div className="space-y-1.5 max-w-sm">
            <h1 className="text-xl font-black text-white">
              SATCROP Intelligence
            </h1>
            <p className="text-xs text-slate-400">
              A temporary display error occurred. Tap below to return to your dashboard smoothly.
            </p>
          </div>

          <button
            onClick={this.handleReset}
            className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-xl shadow-brand-600/30 flex items-center space-x-2 transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
