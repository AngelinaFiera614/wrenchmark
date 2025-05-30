
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { 
  EngineOption, 
  BrakeOption, 
  FrameOption, 
  SuspensionOption, 
  WheelOption 
} from "@/types/components";
import { fetchEngines } from "@/services/engineService";
import { fetchBrakes } from "@/services/brakeService";
import { fetchFrames } from "@/services/frameService";
import { fetchSuspensions } from "@/services/suspensionService";
import { fetchWheels } from "@/services/wheelService";

interface ComponentSelectorProps {
  componentType: 'engine' | 'brakes' | 'frame' | 'suspension' | 'wheels';
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

  // Fetch components based on type
  const { data: components, isLoading } = useQuery({
    queryKey: [`admin-${componentType}`],
    queryFn: async () => {
      switch (componentType) {
        case 'engine': return await fetchEngines();
        case 'brakes': return await fetchBrakes();
        case 'frame': return await fetchFrames();
        case 'suspension': return await fetchSuspensions();
        case 'wheels': return await fetchWheels();
        default: return [];
      }
    }
  });

  // Filter components based on search
  const filteredComponents = components?.filter(component => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      component.name?.toLowerCase().includes(searchLower) ||
      component.type?.toLowerCase().includes(searchLower) ||
      component.brand?.toLowerCase().includes(searchLower) ||
      component.material?.toLowerCase().includes(searchLower)
    );
  }) || [];

  const getComponentLabel = (component: any) => {
    switch (componentType) {
      case 'engine':
        return `${component.name} - ${component.displacement_cc}cc${component.power_hp ? `, ${component.power_hp}hp` : ''}`;
      case 'brakes':
        return `${component.type}${component.brake_brand ? ` - ${component.brake_brand}` : ''}`;
      case 'frame':
        return `${component.type}${component.material ? ` - ${component.material}` : ''}`;
      case 'suspension':
        return `${component.front_type || 'Front'} / ${component.rear_type || 'Rear'}${component.brand ? ` - ${component.brand}` : ''}`;
      case 'wheels':
        return `${component.front_size || ''} / ${component.rear_size || ''} ${component.type || 'Wheels'}`.trim();
      default:
        return component.name || 'Unknown';
    }
  };

  const getComponentDetails = (component: any) => {
    switch (componentType) {
      case 'engine':
        return [
          component.engine_type,
          component.cylinder_count ? `${component.cylinder_count} cyl` : null,
          component.cooling,
        ].filter(Boolean).join(' • ');
      case 'brakes':
        return [
          component.brake_type_front ? `Front: ${component.brake_type_front}` : null,
          component.brake_type_rear ? `Rear: ${component.brake_type_rear}` : null,
        ].filter(Boolean).join(' • ');
      case 'frame':
        return [
          component.construction_method,
          component.rake_degrees ? `${component.rake_degrees}° rake` : null,
        ].filter(Boolean).join(' • ');
      case 'suspension':
        return [
          component.adjustability,
          component.front_travel_mm ? `${component.front_travel_mm}mm travel` : null,
        ].filter(Boolean).join(' • ');
      case 'wheels':
        return [
          component.rim_material,
          component.spoke_count_front ? `${component.spoke_count_front} spokes` : null,
        ].filter(Boolean).join(' • ');
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-teal mx-auto"></div>
          <div className="mt-2 text-sm text-explorer-text-muted">Loading {componentType}...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-explorer-text capitalize">
            Select {componentType}
          </CardTitle>
          {onCreateNew && (
            <Button
              size="sm"
              onClick={onCreateNew}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create New
            </Button>
          )}
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-explorer-text-muted h-4 w-4" />
          <Input
            placeholder={`Search ${componentType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-64 overflow-y-auto">
          {filteredComponents.length === 0 ? (
            <div className="p-4 text-center text-explorer-text-muted">
              {searchTerm ? `No ${componentType} match your search.` : `No ${componentType} available.`}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredComponents.map((component) => (
                <div
                  key={component.id}
                  className={`p-3 cursor-pointer transition-colors border-b border-explorer-chrome/10 last:border-b-0 ${
                    selectedId === component.id
                      ? 'bg-accent-teal/20 border-accent-teal/30'
                      : 'hover:bg-explorer-chrome/10'
                  }`}
                  onClick={() => onSelect(component.id, component)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-explorer-text truncate">
                          {getComponentLabel(component)}
                        </span>
                        {selectedId === component.id && (
                          <Check className="h-4 w-4 text-accent-teal flex-shrink-0" />
                        )}
                      </div>
                      {getComponentDetails(component) && (
                        <div className="text-xs text-explorer-text-muted mt-1">
                          {getComponentDetails(component)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComponentSelector;
