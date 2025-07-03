
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronDown, Search, X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectFilterProps {
  label: string;
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  maxDisplayed?: number;
}

const MultiSelectFilter = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "Select options...",
  maxDisplayed = 3
}: MultiSelectFilterProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  const handleRemove = (value: string) => {
    onChange(selectedValues.filter(v => v !== value));
  };

  const selectedLabels = selectedValues.map(value => 
    options.find(opt => opt.value === value)?.label || value
  );

  return (
    <div>
      <label className="text-sm font-medium text-explorer-text mb-2 block">
        {label}
      </label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between bg-explorer-dark border-explorer-chrome/30 text-left"
          >
            <div className="flex items-center gap-2">
              {selectedValues.length === 0 ? (
                <span className="text-explorer-text-muted">{placeholder}</span>
              ) : (
                <div className="flex items-center gap-1 flex-wrap">
                  {selectedLabels.slice(0, maxDisplayed).map((label, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-accent-teal/20 text-accent-teal text-xs"
                    >
                      {label}
                    </Badge>
                  ))}
                  {selectedValues.length > maxDisplayed && (
                    <Badge variant="secondary" className="bg-accent-teal/20 text-accent-teal text-xs">
                      +{selectedValues.length - maxDisplayed} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-80 p-0" align="start">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardContent className="p-4">
              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
                <Input
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-explorer-dark border-explorer-chrome/30"
                />
              </div>

              {/* Options */}
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-accent-teal/20 text-accent-teal' 
                          : 'hover:bg-explorer-chrome/10'
                      }`}
                      onClick={() => handleToggle(option.value)}
                    >
                      <span className="text-sm">{option.label}</span>
                      {isSelected && <Check className="h-4 w-4" />}
                    </div>
                  );
                })}
                
                {filteredOptions.length === 0 && (
                  <div className="text-center py-4 text-explorer-text-muted text-sm">
                    No options found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>

      {/* Selected items as removable badges */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedLabels.map((label, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-accent-teal/20 text-accent-teal border-accent-teal/30"
            >
              {label}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => handleRemove(selectedValues[index])}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectFilter;
