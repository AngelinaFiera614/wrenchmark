
import React from "react";
import { Grid, List } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BrandsMobileViewToggleProps {
  viewMode: "table" | "card";
  setViewMode: (mode: "table" | "card") => void;
}

const BrandsMobileViewToggle = ({ viewMode, setViewMode }: BrandsMobileViewToggleProps) => {
  return (
    <div className="sm:hidden flex justify-end mb-4">
      <Tabs 
        value={viewMode} 
        onValueChange={(val) => setViewMode(val as "table" | "card")}
      >
        <TabsList className="bg-background border">
          <TabsTrigger value="table" className="data-[state=active]:bg-muted">
            <List className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="card" className="data-[state=active]:bg-muted">
            <Grid className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default BrandsMobileViewToggle;
