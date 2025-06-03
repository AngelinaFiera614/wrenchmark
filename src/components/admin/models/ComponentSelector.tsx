
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Check, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ComponentSelectorProps {
  componentType: "engine" | "brakes" | "frame" | "suspension" | "wheels";
  selectedId?: string;
  onSelect: (componentId: string, component: any) => void;
  onCreateNew?: () => void;
}

const ComponentSelector = ({ 
  componentType, 
  selectedId, 
  onSelect, 
  onCreateNew 
}: ComponentSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Map component types to their database table names
  const tableMap = {
    engine: "engines",
    brakes: "brake_systems", 
    frame: "frames",
    suspension: "suspensions",
    wheels: "wheels"
  };

  const tableName = tableMap[componentType];

  const { data: components, isLoading } = useQuery({
    queryKey: [tableName, searchTerm],
    queryFn: async () => {
      let query = supabase.from(tableName).select("*");
      
      if (searchTerm) {
        // Search in different fields based on component type
        if (componentType === "engine") {
          query = query.or(`name.ilike.%${searchTerm}%,engine_type.ilike.%${searchTerm}%,displacement_cc.eq.${searchTerm}`);
        } else if (componentType === "brakes") {
          query = query.or(`type.ilike.%${searchTerm}%,brake_brand.ilike.%${searchTerm}%`);
        } else if (componentType === "frame") {
          query = query.or(`type.ilike.%${searchTerm}%,material.ilike.%${searchTerm}%`);
        } else if (componentType === "suspension") {
          query = query.or(`front_type.ilike.%${searchTerm}%,rear_type.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`);
        } else if (componentType === "wheels") {
          query = query.or(`type.ilike.%${searchTerm}%,front_size.ilike.%${searchTerm}%,rear_size.ilike.%${searchTerm}%`);
        }
      }
      
      const { data, error } = await query.order('created_at', { ascending: false }).limit(50);
      if (error) throw error;
      return data;
    }
  });

  const getDisplayName = (component: any) => {
    switch (componentType) {
      case "engine":
        return `${component.name || 'Unknown'} - ${component.displacement_cc}cc`;
      case "brakes":
        return `${component.type || 'Unknown'} ${component.brake_brand ? `(${component.brake_brand})` : ''}`;
      case "frame":
        return `${component.type || 'Unknown'} ${component.material ? `- ${component.material}` : ''}`;
      case "suspension":
        return `${component.front_type || 'Unknown'} / ${component.rear_type || 'Unknown'}`;
      case "wheels":
        return `${component.type || 'Unknown'} ${component.front_size ? `(${component.front_size})` : ''}`;
      default:
        return 'Unknown';
    }
  };

  const getDisplayDetails = (component: any) => {
    switch (componentType) {
      case "engine":
        return `${component.power_hp ? `${component.power_hp}hp` : ''} ${component.torque_nm ? `${component.torque_nm}Nm` : ''}`.trim();
      case "brakes":
        return `${component.front_disc_size_mm ? `Front: ${component.front_disc_size_mm}mm` : ''} ${component.rear_disc_size_mm ? `Rear: ${component.rear_disc_size_mm}mm` : ''}`.trim();
      case "frame":
        return component.construction_method || '';
      case "suspension":
        return `${component.front_travel_mm ? `F: ${component.front_travel_mm}mm` : ''} ${component.rear_travel_mm ? `R: ${component.rear_travel_mm}mm` : ''}`.trim();
      case "wheels":
        return `${component.front_size || ''} / ${component.rear_size || ''}`.trim();
      default:
        return '';
    }
  };

  const componentTypeDisplayNames = {
    engine: "Engine",
    brakes: "Brake System",
    frame: "Frame",
    suspension: "Suspension",
    wheels: "Wheels"
  };

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-explorer-text">
            {componentTypeDisplayNames[componentType]}
          </CardTitle>
          {onCreateNew && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCreateNew}
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          )}
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
          <Input
            placeholder={`Search ${componentTypeDisplayNames[componentType].toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 max-h-64 overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-4 text-explorer-text-muted">
            Loading {componentTypeDisplayNames[componentType].toLowerCase()}...
          </div>
        ) : !components || components.length === 0 ? (
          <div className="text-center py-4 text-explorer-text-muted">
            No {componentTypeDisplayNames[componentType].toLowerCase()} found
          </div>
        ) : (
          components.map((component) => (
            <div
              key={component.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedId === component.id
                  ? "bg-accent-teal/20 border-accent-teal"
                  : "bg-explorer-dark border-explorer-chrome/30 hover:border-explorer-chrome/50"
              }`}
              onClick={() => onSelect(component.id, component)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-explorer-text text-sm">
                    {getDisplayName(component)}
                  </div>
                  {getDisplayDetails(component) && (
                    <div className="text-xs text-explorer-text-muted mt-1">
                      {getDisplayDetails(component)}
                    </div>
                  )}
                </div>
                {selectedId === component.id && (
                  <Check className="h-4 w-4 text-accent-teal" />
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ComponentSelector;
