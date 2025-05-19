
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditableStatusCellProps {
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  error?: string;
}

export function EditableStatusCell({
  value,
  isEditing,
  onChange,
  error,
}: EditableStatusCellProps) {
  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "review", label: "In Review" },
    { value: "published", label: "Published" },
    { value: "incomplete", label: "Incomplete" },
  ];

  const getStatusLabel = (statusValue: string) => {
    return statusOptions.find((option) => option.value === statusValue)?.label || statusValue;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-800 text-xs">Draft</span>;
      case "review":
        return <span className="px-2 py-1 rounded-full bg-amber-200 text-amber-800 text-xs">Review</span>;
      case "published":
        return <span className="px-2 py-1 rounded-full bg-green-200 text-green-800 text-xs">Published</span>;
      case "incomplete":
        return <span className="px-2 py-1 rounded-full bg-red-200 text-red-800 text-xs">Incomplete</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-blue-200 text-blue-800 text-xs">{status}</span>;
    }
  };

  if (isEditing) {
    return (
      <div className="relative">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className={error ? "border-red-500" : ""}>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && (
          <div className="text-red-500 text-xs mt-1">{error}</div>
        )}
      </div>
    );
  }

  return getStatusBadge(value);
}
