
import React from "react";
import { Input } from "@/components/ui/input";
import { ListFilter } from "lucide-react";

interface AdminLessonsSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function AdminLessonsSearch({ 
  searchQuery, 
  setSearchQuery 
}: AdminLessonsSearchProps) {
  return (
    <div className="p-4 flex items-center gap-4 border-b">
      <div className="relative flex-1">
        <ListFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search lessons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
}
