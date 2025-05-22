
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Brand } from "@/types";
import BrandOverview from "./tabs/BrandOverview";
import BrandHistory from "./tabs/BrandHistory";
import BrandModels from "./tabs/BrandModels";
import BrandMedia from "./tabs/BrandMedia";

interface BrandDetailTabsProps {
  brand: Brand;
  motorcycles: any[];
}

export default function BrandDetailTabs({ brand, motorcycles }: BrandDetailTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full mt-6">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsTrigger value="models">Models</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <BrandOverview brand={brand} motorcycles={motorcycles} />
      </TabsContent>
      
      <TabsContent value="history" className="space-y-4">
        <BrandHistory brand={brand} />
      </TabsContent>
      
      <TabsContent value="models" className="space-y-4">
        <BrandModels brand={brand} motorcycles={motorcycles} />
      </TabsContent>
      
      <TabsContent value="media" className="space-y-4">
        <BrandMedia brand={brand} />
      </TabsContent>
    </Tabs>
  );
}
