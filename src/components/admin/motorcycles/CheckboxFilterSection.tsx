
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface CheckboxFilterSectionProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  isOpen: boolean;
  onToggle: () => void;
  maxHeight?: string;
}

const CheckboxFilterSection = ({
  title,
  options,
  selectedValues,
  onChange,
  isOpen,
  onToggle,
  maxHeight = "200px"
}: CheckboxFilterSectionProps) => {
  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  const handleSelectAll = () => {
    onChange(options.map(opt => opt.value));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="bg-explorer-card border border-explorer-chrome/30 rounded-lg">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-4 h-auto font-medium text-explorer-text hover:bg-explorer-chrome/10"
          >
            <div className="flex items-center gap-2">
              <span>{title}</span>
              {selectedValues.length > 0 && (
                <Badge variant="secondary" className="bg-accent-teal text-black">
                  {selectedValues.length}
                </Badge>
              )}
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="px-4 pb-4">
          <div className="flex gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="text-xs bg-explorer-dark border-explorer-chrome/30"
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              disabled={selectedValues.length === 0}
              className="text-xs bg-explorer-dark border-explorer-chrome/30"
            >
              Clear All
            </Button>
          </div>

          <div className="space-y-2" style={{ maxHeight, overflowY: 'auto' }}>
            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 p-2 rounded hover:bg-explorer-chrome/10 cursor-pointer"
                onClick={() => handleToggle(option.value)}
              >
                <Checkbox
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleToggle(option.value)}
                  className="border-explorer-chrome/50"
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
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CheckboxFilterSection;
