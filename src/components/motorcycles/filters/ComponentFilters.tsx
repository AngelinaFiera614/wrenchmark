
import React, { useState, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown, Cog, X } from "lucide-react";
import { MotorcycleFilters } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import FilterSection from "@/components/common/FilterSection";

interface ComponentFiltersProps {
  filters: MotorcycleFilters;
  onFilterChange: (filters: MotorcycleFilters) => void;
}

interface ComponentOption {
  id: string;
  name: string;
  type?: string;
  material?: string;
  brand?: string;
}

export default function ComponentFilters({ filters, onFilterChange }: ComponentFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [engines, setEngines] = useState<ComponentOption[]>([]);
  const [brakes, setBrakes] = useState<ComponentOption[]>([]);
  const [frames, setFrames] = useState<ComponentOption[]>([]);
  const [suspensions, setSuspensions] = useState<ComponentOption[]>([]);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        // Fetch engines
        const { data: engineData } = await supabase
          .from('engines')
          .select('id, name, engine_type, cooling')
          .order('name');
        
        // Fetch brake systems
        const { data: brakeData } = await supabase
          .from('brake_systems')
          .select('id, type, brake_brand')
          .order('type');
        
        // Fetch frames
        const { data: frameData } = await supabase
          .from('frames')
          .select('id, type, material')
          .order('type');
        
        // Fetch suspensions
        const { data: suspensionData } = await supabase
          .from('suspensions')
          .select('id, front_type, rear_type, brand')
          .order('front_type');

        setEngines(engineData || []);
        setBrakes(brakeData || []);
        setFrames(frameData || []);
        setSuspensions(suspensionData || []);
      } catch (error) {
        console.error('Error fetching component data:', error);
      }
    };

    if (isOpen) {
      fetchComponents();
    }
  }, [isOpen]);

  const handleEngineFilterChange = (engineType: string, checked: boolean) => {
    const currentEngineTypes = filters.advancedSearch?.engineType || [];
    const updated = checked 
      ? [...currentEngineTypes, engineType]
      : currentEngineTypes.filter(t => t !== engineType);
    
    onFilterChange({
      ...filters,
      advancedSearch: {
        ...filters.advancedSearch,
        engineType: updated
      }
    });
  };

  const handleBrakeFilterChange = (brakeType: string, checked: boolean) => {
    const currentBrakeTypes = filters.advancedSearch?.brakeType || [];
    const updated = checked 
      ? [...currentBrakeTypes, brakeType]
      : currentBrakeTypes.filter(t => t !== brakeType);
    
    onFilterChange({
      ...filters,
      advancedSearch: {
        ...filters.advancedSearch,
        brakeType: updated
      }
    });
  };

  const handleFrameFilterChange = (frameType: string, checked: boolean) => {
    const currentFrameTypes = filters.advancedSearch?.frameType || [];
    const updated = checked 
      ? [...currentFrameTypes, frameType]
      : currentFrameTypes.filter(t => t !== frameType);
    
    onFilterChange({
      ...filters,
      advancedSearch: {
        ...filters.advancedSearch,
        frameType: updated
      }
    });
  };

  const handleSuspensionFilterChange = (suspensionType: string, checked: boolean) => {
    const currentSuspensionTypes = filters.advancedSearch?.suspensionType || [];
    const updated = checked 
      ? [...currentSuspensionTypes, suspensionType]
      : currentSuspensionTypes.filter(t => t !== suspensionType);
    
    onFilterChange({
      ...filters,
      advancedSearch: {
        ...filters.advancedSearch,
        suspensionType: updated
      }
    });
  };

  const clearComponentFilters = () => {
    onFilterChange({
      ...filters,
      advancedSearch: {
        ...filters.advancedSearch,
        engineType: [],
        brakeType: [],
        frameType: [],
        suspensionType: []
      }
    });
  };

  const activeFiltersCount = [
    ...(filters.advancedSearch?.engineType || []),
    ...(filters.advancedSearch?.brakeType || []),
    ...(filters.advancedSearch?.frameType || []),
    ...(filters.advancedSearch?.suspensionType || [])
  ].length;

  // Get unique engine types
  const engineTypes = [...new Set(engines.map(e => e.engine_type).filter(Boolean))];
  const brakeTypes = [...new Set(brakes.map(b => b.type).filter(Boolean))];
  const frameTypes = [...new Set(frames.map(f => f.type).filter(Boolean))];
  const suspensionTypes = [...new Set(
    suspensions.flatMap(s => [s.front_type, s.rear_type].filter(Boolean))
  )];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between"
          size="sm"
        >
          <div className="flex items-center gap-2">
            <Cog className="h-4 w-4" />
            Component Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-accent-teal/20 text-accent-teal">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-4 mt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Component Specifications</h3>
          {activeFiltersCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearComponentFilters}
              className="text-xs h-6 px-2"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Engine Types */}
        {engineTypes.length > 0 && (
          <FilterSection title="Engine Type">
            <div className="grid grid-cols-2 gap-2">
              {engineTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`engine-${type}`}
                    checked={filters.advancedSearch?.engineType?.includes(type) || false}
                    onCheckedChange={(checked) => 
                      handleEngineFilterChange(type, checked as boolean)
                    }
                  />
                  <Label htmlFor={`engine-${type}`} className="text-sm">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Brake Types */}
        {brakeTypes.length > 0 && (
          <FilterSection title="Brake System">
            <div className="grid grid-cols-2 gap-2">
              {brakeTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brake-${type}`}
                    checked={filters.advancedSearch?.brakeType?.includes(type) || false}
                    onCheckedChange={(checked) => 
                      handleBrakeFilterChange(type, checked as boolean)
                    }
                  />
                  <Label htmlFor={`brake-${type}`} className="text-sm">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Frame Types */}
        {frameTypes.length > 0 && (
          <FilterSection title="Frame Type">
            <div className="grid grid-cols-2 gap-2">
              {frameTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`frame-${type}`}
                    checked={filters.advancedSearch?.frameType?.includes(type) || false}
                    onCheckedChange={(checked) => 
                      handleFrameFilterChange(type, checked as boolean)
                    }
                  />
                  <Label htmlFor={`frame-${type}`} className="text-sm">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Suspension Types */}
        {suspensionTypes.length > 0 && (
          <FilterSection title="Suspension Type">
            <div className="grid grid-cols-2 gap-2">
              {suspensionTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`suspension-${type}`}
                    checked={filters.advancedSearch?.suspensionType?.includes(type) || false}
                    onCheckedChange={(checked) => 
                      handleSuspensionFilterChange(type, checked as boolean)
                    }
                  />
                  <Label htmlFor={`suspension-${type}`} className="text-sm">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
