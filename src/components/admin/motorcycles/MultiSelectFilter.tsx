
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, X } from 'lucide-react';

interface MultiSelectOption {
  value: string;
  label: string;
  count?: number;
}

interface MultiSelectFilterProps {
  title: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  maxDisplayCount?: number;
}

const MultiSelectFilter = ({
  title,
  options,
  selectedValues,
  onChange,
  placeholder = "Select options",
  maxDisplayCount = 3
}: MultiSelectFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  const handleClear = () => {
    onChange([]);
  };

  const displayText = selectedValues.length === 0 
    ? placeholder 
    : selectedValues.length <= maxDisplayCount
      ? selectedValues.join(', ')
      : `${selectedValues.slice(0, maxDisplayCount).join(', ')} +${selectedValues.length - maxDisplayCount} more`;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-explorer-text">{title}</label>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between bg-explorer-dark border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
          >
            <span className="truncate">{displayText}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-80 p-0 bg-explorer-card border-explorer-chrome/30">
          <div className="p-3 border-b border-explorer-chrome/30">
            <div className="flex items-center justify-between">
              <span className="font-medium text-explorer-text">{title}</span>
              {selectedValues.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-auto p-1 text-explorer-text-muted hover:text-explorer-text"
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 p-3 hover:bg-explorer-chrome/10 cursor-pointer"
                onClick={() => handleToggle(option.value)}
              >
                <Checkbox
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleToggle(option.value)}
                />
                <span className="flex-1 text-sm text-explorer-text">
                  {option.label}
                </span>
                {option.count !== undefined && (
                  <span className="text-xs text-explorer-text-muted">
                    ({option.count})
                  </span>
                )}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedValues.map((value) => {
            const option = options.find(opt => opt.value === value);
            return (
              <Badge
                key={value}
                variant="secondary"
                className="bg-accent-teal/20 text-accent-teal border-accent-teal/30 text-xs"
              >
                {option?.label || value}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => handleToggle(value)}
                />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultiSelectFilter;
