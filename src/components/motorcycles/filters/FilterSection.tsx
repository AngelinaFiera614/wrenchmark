
import React from "react";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export default function FilterSection({ title, children, action }: FilterSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{title}</h4>
        {action}
      </div>
      {children}
    </div>
  );
}
