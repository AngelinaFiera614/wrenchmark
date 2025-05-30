
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Calendar, Award, Bike } from 'lucide-react';

interface TimelineFiltersProps {
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
  availableTypes: string[];
}

const filterOptions = [
  { id: 'milestones', label: 'Milestones', icon: Award },
  { id: 'launches', label: 'Model Launches', icon: Bike },
  { id: 'high-importance', label: 'Major Events', icon: Calendar }
];

export default function TimelineFilters({ 
  activeFilters, 
  onFilterChange, 
  availableTypes 
}: TimelineFiltersProps) {
  const toggleFilter = (filterId: string) => {
    if (activeFilters.includes(filterId)) {
      onFilterChange(activeFilters.filter(f => f !== filterId));
    } else {
      onFilterChange([...activeFilters, filterId]);
    }
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-explorer-teal" />
        <span className="text-sm font-medium text-explorer-text">Filter Timeline</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => {
          const Icon = option.icon;
          const isActive = activeFilters.includes(option.id);
          
          return (
            <Button
              key={option.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => toggleFilter(option.id)}
              className={`flex items-center gap-2 ${
                isActive 
                  ? 'bg-explorer-teal text-explorer-dark' 
                  : 'border-explorer-chrome/30 text-explorer-text hover:border-explorer-teal/50'
              }`}
            >
              <Icon className="h-3 w-3" />
              {option.label}
            </Button>
          );
        })}
      </div>
      
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-explorer-text-muted">Active filters:</span>
          {activeFilters.map((filter) => {
            const option = filterOptions.find(o => o.id === filter);
            return option ? (
              <Badge key={filter} variant="secondary" className="text-xs">
                {option.label}
              </Badge>
            ) : null;
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange([])}
            className="text-xs text-explorer-text-muted hover:text-explorer-teal"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
