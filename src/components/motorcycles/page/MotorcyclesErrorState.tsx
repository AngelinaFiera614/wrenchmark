
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Info } from "lucide-react";

interface MotorcyclesErrorStateProps {
  error: string;
  dataQualityInfo?: any;
  debugInfo?: any;
  onRetry: () => void;
}

export function MotorcyclesErrorState({ 
  error, 
  dataQualityInfo, 
  debugInfo, 
  onRetry 
}: MotorcyclesErrorStateProps) {
  return (
    <div className="flex-1">
      <div className="container px-4 md:px-6 py-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-4">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Error Loading Motorcycles</h1>
          </div>
          <p className="text-muted-foreground mb-6">{error}</p>
          
          {dataQualityInfo && (
            <Alert className="mb-6 text-left">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium">Data Quality Info:</div>
                  <div className="text-sm space-y-1">
                    <div>Total motorcycles: {dataQualityInfo.total}</div>
                    <div>With engine data: {dataQualityInfo.withEngine}</div>
                    <div>With component data: {dataQualityInfo.withComponentData}</div>
                    <div>Placeholder motorcycles: {dataQualityInfo.placeholders}</div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {debugInfo?.errorDetails && (
            <Alert className="mb-6 text-left">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium">Error Details:</div>
                  <div className="text-sm space-y-1">
                    <div>Type: {debugInfo.errorDetails.type}</div>
                    <div>Message: {debugInfo.errorDetails.message}</div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-3">
            <Button onClick={onRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()} className="w-full">
              Refresh Page
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-muted rounded-lg text-left">
            <h3 className="font-semibold text-sm mb-2">Troubleshooting Tips:</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Check database connection</li>
              <li>• Verify motorcycle data is published (is_draft = false)</li>
              <li>• Check for relationship mapping issues in queries</li>
              <li>• Contact administrator if issue persists</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
