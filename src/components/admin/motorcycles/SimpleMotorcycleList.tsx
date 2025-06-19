
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Eye, FileText, ToggleLeft, ToggleRight } from "lucide-react";
import { Motorcycle } from "@/types";

interface SimpleMotorcycleListProps {
  motorcycles: Motorcycle[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  isDraftMode?: boolean;
  onToggleDraftMode?: () => void;
}

const SimpleMotorcycleList = ({ 
  motorcycles, 
  isLoading, 
  error, 
  onRefresh,
  isDraftMode = false,
  onToggleDraftMode 
}: SimpleMotorcycleListProps) => {
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-800 mb-4">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Error Loading Motorcycles</span>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading motorcycles...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">
            Motorcycles ({motorcycles.length})
          </h3>
          {onToggleDraftMode && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onToggleDraftMode}
              className="flex items-center gap-2"
            >
              {isDraftMode ? (
                <>
                  <ToggleRight className="h-4 w-4 text-accent-teal" />
                  Draft Mode
                </>
              ) : (
                <>
                  <ToggleLeft className="h-4 w-4" />
                  Published Only
                </>
              )}
            </Button>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      {motorcycles.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              No {isDraftMode ? 'draft' : 'published'} motorcycles found
            </p>
            <Button variant="outline" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {motorcycles.slice(0, 10).map((motorcycle) => (
            <Card key={motorcycle.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant={motorcycle.is_draft ? "secondary" : "default"}
                      className={motorcycle.is_draft ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"}
                    >
                      {motorcycle.is_draft ? (
                        <>
                          <FileText className="mr-1 h-3 w-3" />
                          Draft
                        </>
                      ) : (
                        <>
                          <Eye className="mr-1 h-3 w-3" />
                          Published
                        </>
                      )}
                    </Badge>
                    <div>
                      <h4 className="font-medium">
                        {motorcycle.make} {motorcycle.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {motorcycle.type} • Brand ID: {motorcycle.brand_id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ID: {motorcycle.id}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {motorcycle.production_start_year && (
                      <p>Since {motorcycle.production_start_year}</p>
                    )}
                    {motorcycle.engine_size && (
                      <p>{motorcycle.engine_size}cc</p>
                    )}
                    {motorcycle.horsepower && (
                      <p>{motorcycle.horsepower}hp</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {motorcycles.length > 10 && (
            <Card className="border-dashed">
              <CardContent className="p-4 text-center text-muted-foreground">
                ... and {motorcycles.length - 10} more motorcycles
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default SimpleMotorcycleList;
