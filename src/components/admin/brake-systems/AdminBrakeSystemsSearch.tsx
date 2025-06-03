
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface AdminBrakeSystemsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const AdminBrakeSystemsSearch = ({ searchTerm, onSearchChange }: AdminBrakeSystemsSearchProps) => {
  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardContent className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-explorer-text-muted h-4 w-4" />
          <Input
            placeholder="Search brake systems by type or brand..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminBrakeSystemsSearch;
