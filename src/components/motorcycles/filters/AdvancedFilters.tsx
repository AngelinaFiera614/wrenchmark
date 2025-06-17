import React, { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown, Settings, X } from "lucide-react";
import FilterSection from "@/components/common/FilterSection";
import { MotorcycleFilters } from "@/types";
import { Slider } from "@/components/ui/slider";

interface AdvancedFiltersProps {
  filters: MotorcycleFilters;
  onFilterChange: (filters: MotorcycleFilters) => void;
}

export default function AdvancedFilters({ filters, onFilterChange }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const transmissionOptions = ["Manual", "Automatic", "CVT", "DCT", "6-speed", "5-speed"];
  const driveTypeOptions = ["Chain", "Belt", "Shaft", "Hub"];
  const coolingSystemOptions = ["Air-cooled", "Liquid-cooled", "Oil-cooled", "Air/Oil-cooled"];
  const licenseLevelOptions = ["Learner's Permit", "A1 (125cc)", "A2 (35kW)", "Full License", "MSF Course"];
  const useCaseOptions = ["Commuting", "Touring", "Sport", "Off-road", "Track", "Urban", "Adventure"];
  const engineTypeOptions = ["Single", "Parallel Twin", "V-Twin", "Inline-4", "V4", "Boxer", "Triple"];
  const cylinderCountOptions = [1, 2, 3, 4, 6, 8];
  const brakeTypeOptions = ["Disc", "Drum", "ABS", "CBS", "Linked"];

  const handleTransmissionChange = (transmission: string, checked: boolean) => {
    const updated = checked 
      ? [...(filters.transmission || []), transmission]
      : (filters.transmission || []).filter(t => t !== transmission);
    
    onFilterChange({
      ...filters,
      transmission: updated
    });
  };

  const handleDriveTypeChange = (driveType: string, checked: boolean) => {
    const updated = checked 
      ? [...(filters.driveType || []), driveType]
      : (filters.driveType || []).filter(d => d !== driveType);
    
    onFilterChange({
      ...filters,
      driveType: updated
    });
  };

  const handleCoolingSystemChange = (coolingSystem: string, checked: boolean) => {
    const updated = checked 
      ? [...(filters.coolingSystem || []), coolingSystem]
      : (filters.coolingSystem || []).filter(c => c !== coolingSystem);
    
    onFilterChange({
      ...filters,
      coolingSystem: updated
    });
  };

  const handleUseCaseChange = (useCase: string, checked: boolean) => {
    const updated = checked 
      ? [...(filters.useCases || []), useCase]
      : (filters.useCases || []).filter(u => u !== useCase);
    
    onFilterChange({
      ...filters,
      useCases: updated
    });
  };

  const handleLicenseLevelChange = (level: string, checked: boolean) => {
    const updated = checked 
      ? [...(filters.licenseLevelFilter || []), level]
      : (filters.licenseLevelFilter || []).filter(l => l !== level);
    
    onFilterChange({
      ...filters,
      licenseLevelFilter: updated
    });
  };

  const handleAdvancedSearchChange = (field: string, value: string, checked: boolean) => {
    const currentAdvanced = filters.advancedSearch || {};
    const currentArray = currentAdvanced[field as keyof typeof currentAdvanced] || [];
    
    const updated = checked 
      ? [...currentArray, value]
      : currentArray.filter((item: any) => item !== value);
    
    onFilterChange({
      ...filters,
      advancedSearch: {
        ...currentAdvanced,
        [field]: updated
      }
    });
  };

  const clearAdvancedFilters = () => {
    onFilterChange({
      ...filters,
      transmission: [],
      driveType: [],
      coolingSystem: [],
      useCases: [],
      licenseLevelFilter: [],
      powerToWeightRange: [0, 2.0],
      isEntryLevel: null,
      hasSmartFeatures: null,
      fuelCapacityRange: [0, 30],
      topSpeedRange: [0, 350],
      torqueRange: [0, 200],
      advancedSearch: {
        engineType: [],
        cylinderCount: [],
        brakeType: [],
        frameType: [],
        suspensionType: []
      }
    });
  };

  const activeAdvancedFiltersCount = [
    ...(filters.transmission || []),
    ...(filters.driveType || []),
    ...(filters.coolingSystem || []),
    ...(filters.useCases || []),
    ...(filters.licenseLevelFilter || []),
    ...(filters.advancedSearch?.engineType || []),
    ...(filters.advancedSearch?.cylinderCount || []),
    ...(filters.advancedSearch?.brakeType || [])
  ].length + 
  (filters.isEntryLevel !== null ? 1 : 0) +
  (filters.hasSmartFeatures !== null ? 1 : 0);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between"
          size="sm"
        >
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Advanced Filters
            {activeAdvancedFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-accent-teal/20 text-accent-teal">
                {activeAdvancedFiltersCount}
              </Badge>
            )}
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-4 mt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Technical Specifications</h3>
          {activeAdvancedFiltersCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAdvancedFilters}
              className="text-xs h-6 px-2"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {/* Power-to-Weight Ratio */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Power-to-Weight Ratio: {filters.powerToWeightRange?.[0] || 0} - {filters.powerToWeightRange?.[1] || 2.0} hp/kg</Label>
          <Slider
            value={filters.powerToWeightRange || [0, 2.0]}
            onValueChange={(values) => onFilterChange({
              ...filters,
              powerToWeightRange: [values[0], values[1]]
            })}
            min={0}
            max={2.0}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Fuel Capacity */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Fuel Capacity: {filters.fuelCapacityRange?.[0] || 0} - {filters.fuelCapacityRange?.[1] || 30} L</Label>
          <Slider
            value={filters.fuelCapacityRange || [0, 30]}
            onValueChange={(values) => onFilterChange({
              ...filters,
              fuelCapacityRange: [values[0], values[1]]
            })}
            min={0}
            max={30}
            step={1}
            className="w-full"
          />
        </div>

        {/* Top Speed */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Top Speed: {filters.topSpeedRange?.[0] || 0} - {filters.topSpeedRange?.[1] || 350} km/h</Label>
          <Slider
            value={filters.topSpeedRange || [0, 350]}
            onValueChange={(values) => onFilterChange({
              ...filters,
              topSpeedRange: [values[0], values[1]]
            })}
            min={0}
            max={350}
            step={10}
            className="w-full"
          />
        </div>

        {/* Torque */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Torque: {filters.torqueRange?.[0] || 0} - {filters.torqueRange?.[1] || 200} Nm</Label>
          <Slider
            value={filters.torqueRange || [0, 200]}
            onValueChange={(values) => onFilterChange({
              ...filters,
              torqueRange: [values[0], values[1]]
            })}
            min={0}
            max={200}
            step={5}
            className="w-full"
          />
        </div>

        {/* Transmission */}
        <FilterSection title="Transmission">
          <div className="grid grid-cols-2 gap-2">
            {transmissionOptions.map((transmission) => (
              <div key={transmission} className="flex items-center space-x-2">
                <Checkbox
                  id={`transmission-${transmission}`}
                  checked={filters.transmission?.includes(transmission) || false}
                  onCheckedChange={(checked) => 
                    handleTransmissionChange(transmission, checked as boolean)
                  }
                />
                <Label htmlFor={`transmission-${transmission}`} className="text-sm">
                  {transmission}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Drive Type */}
        <FilterSection title="Drive Type">
          <div className="grid grid-cols-2 gap-2">
            {driveTypeOptions.map((driveType) => (
              <div key={driveType} className="flex items-center space-x-2">
                <Checkbox
                  id={`drive-type-${driveType}`}
                  checked={filters.driveType?.includes(driveType) || false}
                  onCheckedChange={(checked) => 
                    handleDriveTypeChange(driveType, checked as boolean)
                  }
                />
                <Label htmlFor={`drive-type-${driveType}`} className="text-sm">
                  {driveType}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Cooling System */}
        <FilterSection title="Cooling System">
          <div className="space-y-2">
            {coolingSystemOptions.map((cooling) => (
              <div key={cooling} className="flex items-center space-x-2">
                <Checkbox
                  id={`cooling-${cooling}`}
                  checked={filters.coolingSystem?.includes(cooling) || false}
                  onCheckedChange={(checked) => 
                    handleCoolingSystemChange(cooling, checked as boolean)
                  }
                />
                <Label htmlFor={`cooling-${cooling}`} className="text-sm">
                  {cooling}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Use Cases */}
        <FilterSection title="Use Cases">
          <div className="grid grid-cols-2 gap-2">
            {useCaseOptions.map((useCase) => (
              <div key={useCase} className="flex items-center space-x-2">
                <Checkbox
                  id={`use-case-${useCase}`}
                  checked={filters.useCases?.includes(useCase) || false}
                  onCheckedChange={(checked) => 
                    handleUseCaseChange(useCase, checked as boolean)
                  }
                />
                <Label htmlFor={`use-case-${useCase}`} className="text-sm">
                  {useCase}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* License Level */}
        <FilterSection title="Recommended License Level">
          <div className="space-y-2">
            {licenseLevelOptions.map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  id={`license-${level}`}
                  checked={filters.licenseLevelFilter?.includes(level) || false}
                  onCheckedChange={(checked) => 
                    handleLicenseLevelChange(level, checked as boolean)
                  }
                />
                <Label htmlFor={`license-${level}`} className="text-sm">
                  {level}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Entry Level Toggle */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="entry-level"
            checked={filters.isEntryLevel === true}
            onCheckedChange={(checked) => 
              onFilterChange({
                ...filters,
                isEntryLevel: checked ? true : null
              })
            }
          />
          <Label htmlFor="entry-level" className="text-sm">
            Entry-level motorcycles only
          </Label>
        </div>

        {/* Smart Features Toggle */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="smart-features"
            checked={filters.hasSmartFeatures === true}
            onCheckedChange={(checked) => 
              onFilterChange({
                ...filters,
                hasSmartFeatures: checked ? true : null
              })
            }
          />
          <Label htmlFor="smart-features" className="text-sm">
            Has smart features
          </Label>
        </div>

        {/* Engine Details */}
        <FilterSection title="Engine Details">
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium">Engine Type</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {engineTypeOptions.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`engine-type-${type}`}
                      checked={filters.advancedSearch?.engineType?.includes(type) || false}
                      onCheckedChange={(checked) => 
                        handleAdvancedSearchChange('engineType', type, checked as boolean)
                      }
                    />
                    <Label htmlFor={`engine-type-${type}`} className="text-xs">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium">Cylinder Count</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {cylinderCountOptions.map((count) => (
                  <div key={count} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cylinder-${count}`}
                      checked={filters.advancedSearch?.cylinderCount?.includes(count.toString()) || false}
                      onCheckedChange={(checked) => 
                        handleAdvancedSearchChange('cylinderCount', count.toString(), checked as boolean)
                      }
                    />
                    <Label htmlFor={`cylinder-${count}`} className="text-xs">
                      {count}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FilterSection>
      </CollapsibleContent>
    </Collapsible>
  );
}
