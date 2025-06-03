
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ComponentLibrary from "../ComponentLibrary";

interface ComponentLibraryEnhancedProps {
  selectedConfig: string | null;
  selectedConfigData?: any;
  handleComponentLinked: () => void;
}

const ComponentLibraryEnhanced = ({ 
  selectedConfig, 
  selectedConfigData, 
  handleComponentLinked 
}: ComponentLibraryEnhancedProps) => {
  return (
    <div className="space-y-6">
      {/* Enhanced Library Header */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Component Library</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-purple-200 bg-purple-50">
            <AlertCircle className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-800">
              Manage motorcycle components with usage analytics, dependency tracking, and archive capabilities.
              Components show usage statistics and can be archived instead of deleted.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Enhanced Component Library */}
      <ComponentLibrary />
    </div>
  );
};

export default ComponentLibraryEnhanced;
