import React, { ErrorInfo } from "react";
import {
  ErrorBoundary as ReactErrorBoundary,
  FallbackProps,
} from "react-error-boundary";
import { Button } from "./ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import config from "@/config";

const ErrorFallback = ({ resetErrorBoundary, error }: FallbackProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-md p-8 border border-border rounded-lg shadow-sm bg-background">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="h-6 w-6 text-foreground" />
          <h2 className="text-xl font-semibold text-foreground">
            Something went wrong
          </h2>
        </div>

        <div className="mb-6">
          <p className="text-muted-foreground text-sm leading-relaxed">
            We encountered an unexpected error. Please try refreshing the page
            or contact support if the problem continues.
          </p>
        </div>

        {error && config.env !== "production" && (
          <details className="mb-6 group">
            <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none">
              <span className="inline-flex items-center gap-1">
                View technical details
                <span className="text-xs group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </span>
            </summary>
            <div className="mt-3 p-3 rounded-md bg-muted border border-border">
              <div className="text-xs font-mono text-foreground space-y-2">
                {error.message && (
                  <div>
                    <div className="font-medium mb-1">Error:</div>
                    <div className="whitespace-pre-wrap break-words text-muted-foreground">
                      {error.message}
                    </div>
                  </div>
                )}
                {error.stack && (
                  <div>
                    <div className="font-medium mb-1">Stack trace:</div>
                    <pre className="whitespace-pre-wrap break-words text-muted-foreground overflow-auto max-h-48 text-xs">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </details>
        )}

        <div className="flex gap-3">
          <Button
            onClick={resetErrorBoundary}
            className="flex-1 flex items-center gap-2"
            variant="default"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="flex-1"
          >
            Reload Page
          </Button>
        </div>
      </div>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onReset?: () => void;
  onError?: (error: Error) => void;
  fallback?: React.ComponentType<FallbackProps>;
}

export const AppErrorBoundary = ({
  children,
  onReset,
  onError,
  fallback,
}: ErrorBoundaryProps) => {
  const handleReset = () => {
    onReset?.();
  };

  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // Log error for debugging
    console.error("Error caught by boundary:", error, errorInfo);
    onError?.(error);
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={fallback || ErrorFallback}
      onReset={handleReset}
      onError={handleError}
      resetKeys={[]} // Add reset keys if needed
    >
      {children}
    </ReactErrorBoundary>
  );
};
