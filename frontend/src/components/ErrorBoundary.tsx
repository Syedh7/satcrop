import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Sprout, RotateCcw, Home, AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      errorMessage: error?.message || 'Display rendering error' 
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('satcrop_token');
      localStorage.removeItem('satcrop_user');
    } catch {}
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  private handleRecoverToDashboard = () => {
    this.setState({ hasError: false, errorMessage: '' });
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
              Recovering agricultural interface... Tap below to reload your dashboard cleanly.
            </p>
          </div>

          {this.state.errorMessage && (
            <div className="text-[10px] text-rose-300/80 bg-rose-950/40 p-2.5 rounded-xl max-w-xs font-mono break-all border border-rose-800/40">
              {this.state.errorMessage}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-xs">
            <button
              onClick={this.handleRecoverToDashboard}
              className="flex-1 py-3 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-extrabold text-xs shadow-xl shadow-brand-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Continue to Dashboard</span>
            </button>

            <button
              onClick={this.handleReset}
              className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 font-bold text-xs border border-slate-700 flex items-center justify-center space-x-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
