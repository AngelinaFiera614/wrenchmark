
import React from "react";
import { Input } from "@/components/ui/input";

interface EditableTextCellProps {
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export function EditableTextCell({
  value,
  isEditing,
  onChange,
  error,
  placeholder,
}: EditableTextCellProps) {
  if (isEditing) {
    return (
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={error ? "border-red-500" : ""}
          placeholder={placeholder}
        />
        {error && (
          <div className="text-red-500 text-xs mt-1 absolute">{error}</div>
        )}
      </div>
    );
  }

  return <span>{value || placeholder || "-"}</span>;
}
