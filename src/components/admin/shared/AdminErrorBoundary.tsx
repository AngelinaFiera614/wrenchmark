
import React, { Component, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class AdminErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Admin Error Boundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-explorer-dark p-4 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
              <div>
                <h2 className="text-lg font-semibold">Something went wrong</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  An error occurred while loading this page.
                </p>
              </div>
              <div className="space-y-2">
                <Button onClick={this.handleReload} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>
                <Button variant="outline" onClick={() => window.history.back()} className="w-full">
                  Go Back
                </Button>
              </div>
              {this.state.error && (
                <details className="text-left text-xs text-muted-foreground">
                  <summary>Error Details</summary>
                  <pre className="mt-2 whitespace-pre-wrap break-all">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdminErrorBoundary;
