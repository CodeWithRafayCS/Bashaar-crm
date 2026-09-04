"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./Button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: any[];
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      errorInfo,
    });
    this.props.onError?.(error, errorInfo);
    
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error);
      console.error("Error info:", errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset error state if resetKeys change
    if (
      this.state.hasError &&
      this.props.resetKeys &&
      prevProps.resetKeys &&
      this.props.resetKeys.some((key, index) => key !== prevProps.resetKeys?.[index])
    ) {
      this.resetError();
    }
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-icon">⚠️</div>
          <h2 className="error-boundary-title">Something went wrong</h2>
          <p className="error-boundary-message">
            We're sorry, but an unexpected error occurred. Please try again.
          </p>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <div className="error-boundary-details">
              <details>
                <summary className="error-details-summary">Error Details</summary>
                <pre className="error-details-pre">
                  {this.state.error.toString()}
                  {this.state.errorInfo && (
                    <div className="error-stack">
                      {this.state.errorInfo.componentStack}
                    </div>
                  )}
                </pre>
              </details>
            </div>
          )}
          <div className="error-boundary-actions">
            <Button
              variant="ghost"
              onClick={() => window.location.reload()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Refresh Page
            </Button>
            <Button
              variant="gold"
              onClick={this.resetError}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Try Again
            </Button>
          </div>

          <style jsx>{`
            .error-boundary {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 3rem 2rem;
              background: rgba(255, 255, 255, 0.02);
              border: 1px solid rgba(255, 255, 255, 0.04);
              border-radius: 16px;
              min-height: 300px;
              text-align: center;
              gap: 1rem;
              max-width: 600px;
              margin: 0 auto;
            }

            .error-boundary-icon {
              font-size: 3rem;
              opacity: 0.4;
              animation: pulse 2s ease-in-out infinite;
            }

            @keyframes pulse {
              0%, 100% { opacity: 0.4; transform: scale(1); }
              50% { opacity: 0.6; transform: scale(1.05); }
            }

            .error-boundary-title {
              font-size: 1.5rem;
              font-weight: 700;
              color: rgba(255, 255, 255, 0.7);
              margin: 0;
            }

            .error-boundary-message {
              font-size: 0.95rem;
              color: rgba(255, 255, 255, 0.3);
              margin: 0;
              max-width: 400px;
              line-height: 1.6;
            }

            .error-boundary-actions {
              display: flex;
              gap: 0.5rem;
              margin-top: 0.5rem;
              flex-wrap: wrap;
              justify-content: center;
            }

            .error-boundary-actions :global(.btn-ghost) {
              background: rgba(255, 255, 255, 0.04) !important;
              border: 1px solid rgba(255, 255, 255, 0.06) !important;
              border-radius: 8px !important;
              color: rgba(255, 255, 255, 0.4) !important;
              padding: 0.5rem 1rem !important;
              font-size: 0.85rem !important;
              display: inline-flex !important;
              align-items: center !important;
              gap: 0.4rem !important;
              transition: all 0.3s !important;
              font-family: inherit !important;
            }

            .error-boundary-actions :global(.btn-ghost):hover {
              background: rgba(255, 255, 255, 0.08) !important;
              color: rgba(255, 255, 255, 0.7) !important;
            }

            .error-boundary-actions :global(.btn-gold) {
              padding: 0.5rem 1.2rem !important;
              background: linear-gradient(135deg, #f4c542, #d4a030) !important;
              border: none !important;
              border-radius: 8px !important;
              color: #0a0a0a !important;
              font-weight: 600 !important;
              font-size: 0.85rem !important;
              display: inline-flex !important;
              align-items: center !important;
              gap: 0.4rem !important;
              transition: all 0.3s !important;
              font-family: inherit !important;
            }

            .error-boundary-actions :global(.btn-gold):hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
            }

            /* Error Details (Dev Only) */
            .error-boundary-details {
              width: 100%;
              max-width: 500px;
              margin-top: 0.5rem;
            }

            .error-details-summary {
              font-size: 0.75rem;
              color: rgba(255, 255, 255, 0.15);
              cursor: pointer;
              text-align: left;
              padding: 0.3rem 0;
              transition: color 0.3s;
            }

            .error-details-summary:hover {
              color: rgba(255, 255, 255, 0.3);
            }

            .error-details-pre {
              font-size: 0.7rem;
              color: rgba(255, 255, 255, 0.15);
              background: rgba(0, 0, 0, 0.3);
              padding: 0.75rem;
              border-radius: 8px;
              overflow-x: auto;
              white-space: pre-wrap;
              word-break: break-word;
              max-height: 200px;
              overflow-y: auto;
              text-align: left;
              margin-top: 0.3rem;
              font-family: "JetBrains Mono", monospace;
            }

            .error-stack {
              margin-top: 0.5rem;
              padding-top: 0.5rem;
              border-top: 1px solid rgba(255, 255, 255, 0.02);
              color: rgba(255, 68, 68, 0.3);
            }

            /* Responsive */
            @media (max-width: 768px) {
              .error-boundary {
                padding: 2rem 1.5rem;
                min-height: 200px;
                margin: 0 1rem;
              }

              .error-boundary-title {
                font-size: 1.2rem;
              }

              .error-boundary-message {
                font-size: 0.85rem;
              }

              .error-boundary-icon {
                font-size: 2.5rem;
              }

              .error-boundary-actions {
                flex-direction: column;
                width: 100%;
              }

              .error-boundary-actions :global(.btn-ghost),
              .error-boundary-actions :global(.btn-gold) {
                width: 100%;
                justify-content: center;
              }
            }

            @media (max-width: 480px) {
              .error-boundary {
                padding: 1.5rem 1rem;
                min-height: 150px;
              }

              .error-boundary-title {
                font-size: 1rem;
              }

              .error-boundary-message {
                font-size: 0.75rem;
              }

              .error-boundary-icon {
                font-size: 2rem;
              }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}