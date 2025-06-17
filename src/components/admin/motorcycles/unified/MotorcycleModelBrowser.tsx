
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader, RefreshCw } from "lucide-react";
import { Motorcycle } from "@/types";
import { calculateDataCompleteness } from "@/utils/dataCompleteness";
import { DataCompletenessIndicator } from "@/components/motorcycles/DataCompletenessIndicator";

interface MotorcycleModelBrowserProps {
  motorcycles: Motorcycle[];
  selectedMotorcycle: Motorcycle | null;
  onSelectMotorcycle: (motorcycle: Motorcycle) => void;
  isLoading: boolean;
  onRefresh?: () => void;
}

const MotorcycleModelBrowser = ({ 
  motorcycles, 
  selectedMotorcycle, 
  onSelectMotorcycle, 
  isLoading,
  onRefresh 
}: MotorcycleModelBrowserProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMotorcycles = motorcycles.filter(motorcycle => 
    motorcycle.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    motorcycle.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    motorcycle.model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30 h-full">
        <CardContent className="p-8 flex items-center justify-center h-full">
          <div className="text-center">
            <Loader className="h-8 w-8 text-accent-teal mx-auto mb-4 animate-spin" />
            <p className="text-explorer-text-muted">Loading motorcycles...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30 h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-explorer-text">Model Browser</CardTitle>
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-explorer-text-muted h-4 w-4" />
          <Input
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-explorer-dark border-explorer-chrome/30"
          />
        </div>
      </CardHeader>
      <CardContent className="p-2 h-[500px] overflow-y-auto">
        <div className="space-y-2">
          {filteredMotorcycles.length === 0 ? (
            <div className="text-center py-8 text-explorer-text-muted">
              {searchTerm ? "No motorcycles match your search" : "No motorcycles available"}
            </div>
          ) : (
            filteredMotorcycles.map((motorcycle) => {
              const completeness = calculateDataCompleteness(motorcycle);
              const isSelected = selectedMotorcycle?.id === motorcycle.id;
              
              return (
                <div
                  key={motorcycle.id}
                  onClick={() => onSelectMotorcycle(motorcycle)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-accent-teal/20 border-accent-teal'
                      : 'bg-explorer-dark border-explorer-chrome/30 hover:border-explorer-chrome/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-explorer-text">
                        {motorcycle.make || motorcycle.name?.split(' ')[0]} {motorcycle.model || motorcycle.name}
                      </div>
                      <div className="text-sm text-explorer-text-muted">
                        {motorcycle.category} • {motorcycle.year || 'Unknown Year'}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {motorcycle.is_draft && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                            Draft
                          </Badge>
                        )}
                        <DataCompletenessIndicator 
                          status={completeness} 
                          variant="admin" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MotorcycleModelBrowser;
