
import React from "react";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium">{title}</h4>
      {children}
    </div>
  );
}
