
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

/**
 * A reusable checkbox list component for multi-select filters
 * Handles selection state and provides consistent styling
 * 
 * @param items - Array of checkbox items with id, label, and value
 * @param selectedValues - Currently selected values
 * @param onChange - Callback when selection changes
 * @param idPrefix - Prefix for checkbox IDs to ensure uniqueness
 */
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
    <div className="space-y-2">
      {items.map((item) => {
        const isChecked = selectedValues.includes(item.value);
        const checkboxId = `${idPrefix}-${item.id}`;
        
        return (
          <div key={item.id} className="flex items-center space-x-2">
            <Checkbox
              id={checkboxId}
              checked={isChecked}
              onCheckedChange={(checked) => onChange(item.value, checked as boolean)}
            />
            <Label 
              htmlFor={checkboxId}
              className={`text-sm cursor-pointer ${
                isChecked ? 'font-medium text-white' : 'text-white/80'
              }`}
            >
              {item.label}
            </Label>
          </div>
        );
      })}
    </div>
  );
}
