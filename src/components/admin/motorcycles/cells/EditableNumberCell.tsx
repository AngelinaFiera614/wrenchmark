
import React from "react";
import { Input } from "@/components/ui/input";

interface EditableNumberCellProps {
  value?: number | null;
  isEditing: boolean;
  onChange: (value: number | null) => void;
  error?: string;
  min?: number;
  max?: number;
  allowNull?: boolean;
  placeholder?: string;
}

export function EditableNumberCell({
  value,
  isEditing,
  onChange,
  error,
  min,
  max,
  allowNull = false,
  placeholder = "",
}: EditableNumberCellProps) {
  if (isEditing) {
    return (
      <div className="relative">
        <Input
          type="number"
          value={value === null || value === undefined ? "" : value}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "" && allowNull) {
              onChange(null);
            } else {
              const numVal = parseInt(val, 10);
              if (!isNaN(numVal)) {
                onChange(numVal);
              }
            }
          }}
          min={min}
          max={max}
          className={error ? "border-red-500" : ""}
          placeholder={placeholder}
        />
        {error && (
          <div className="text-red-500 text-xs mt-1 absolute">{error}</div>
        )}
      </div>
    );
  }

  return <span>{value === null || value === undefined ? (placeholder || "-") : value}</span>;
}
