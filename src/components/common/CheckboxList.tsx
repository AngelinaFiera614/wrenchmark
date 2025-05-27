
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface CheckboxItem {
  id: string;
  label: string;
  value: string;
}

interface CheckboxListProps {
  items: CheckboxItem[];
  selectedValues: string[];
  onChange: (value: string, checked: boolean) => void;
  idPrefix?: string;
}

export default function CheckboxList({
  items,
  selectedValues,
  onChange,
  idPrefix = 'checkbox'
}: CheckboxListProps) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {items.map((item) => {
        const isChecked = selectedValues.includes(item.value);
        const itemId = `${idPrefix}-${item.id}`;
        
        return (
          <div key={item.id} className="flex items-center space-x-2">
            <Checkbox 
              id={itemId}
              checked={isChecked}
              onCheckedChange={(checked) => 
                onChange(item.value, checked as boolean)
              }
            />
            <Label 
              htmlFor={itemId}
              className={isChecked ? "font-medium text-white" : "text-white/80"}
            >
              {item.label}
            </Label>
            {isChecked && (
              <Badge variant="outline" className="ml-auto text-xs">
                Active
              </Badge>
            )}
          </div>
        );
      })}
    </div>
  );
}
