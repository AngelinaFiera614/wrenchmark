
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Grid, List } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BrandsHeaderProps {
  handleAddBrand: () => void;
  viewMode: "table" | "card";
  setViewMode: (mode: "table" | "card") => void;
}

const BrandsHeader = ({ handleAddBrand, viewMode, setViewMode }: BrandsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">Brands</h1>
        <p className="text-muted-foreground">
          Manage motorcycle brands. Add new manufacturers, update information, or remove brands.
        </p>
      </div>
      <div className="flex gap-2">
        <Tabs 
          value={viewMode} 
          onValueChange={(val) => setViewMode(val as "table" | "card")}
          className="hidden sm:flex"
        >
          <TabsList className="bg-background border">
            <TabsTrigger value="table" className="data-[state=active]:bg-muted">
              <List className="h-4 w-4 mr-1" /> Table
            </TabsTrigger>
            <TabsTrigger value="card" className="data-[state=active]:bg-muted">
              <Grid className="h-4 w-4 mr-1" /> Cards
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button 
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
          onClick={handleAddBrand}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
    </div>
  );
};

export default BrandsHeader;
