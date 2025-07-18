
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface MediaSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MediaSearchInput({ 
  value, 
  onChange, 
  placeholder = "Search media..." 
}: MediaSearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
