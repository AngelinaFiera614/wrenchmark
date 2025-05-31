
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Configuration } from "@/types/motorcycle";
import ComponentAssignmentGrid from "../ComponentAssignmentGrid";

interface TrimLevelDetailsProps {
  selectedConfigData: Configuration;
  onConfigChange: () => void;
}

const TrimLevelDetails = ({ selectedConfigData, onConfigChange }: TrimLevelDetailsProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="components">Components</TabsTrigger>
        <TabsTrigger value="specifications">Specifications</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader>
            <CardTitle className="text-explorer-text">
              {selectedConfigData.name || "Base"} Trim Level
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-explorer-text-muted">Market Region</p>
                <p className="text-explorer-text">{selectedConfigData.market_region || "Global"}</p>
              </div>
              <div>
                <p className="text-sm text-explorer-text-muted">Price Premium</p>
                <p className="text-explorer-text">
                  {selectedConfigData.price_premium_usd
                    ? `+$${selectedConfigData.price_premium_usd.toLocaleString()}`
                    : "Base price"
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-explorer-text-muted">Trim Status</p>
                <Badge variant={selectedConfigData.is_default ? "default" : "secondary"}>
                  {selectedConfigData.is_default ? "Base Model" : "Variant"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-explorer-text-muted">Special Equipment</p>
                <p className="text-explorer-text">
                  {selectedConfigData.optional_equipment?.length ? 
                    `${selectedConfigData.optional_equipment.length} items` : "Standard"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="components" className="space-y-4">
        <ComponentAssignmentGrid
          configuration={selectedConfigData}
          onComponentChange={(componentType, componentId) => {
            onConfigChange();
          }}
        />
      </TabsContent>

      <TabsContent value="specifications" className="space-y-4">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader>
            <CardTitle className="text-explorer-text">Physical Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-explorer-text-muted">Weight</p>
                <p className="text-explorer-text font-medium">
                  {selectedConfigData.weight_kg ? `${selectedConfigData.weight_kg} kg` : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-explorer-text-muted">Seat Height</p>
                <p className="text-explorer-text font-medium">
                  {selectedConfigData.seat_height_mm ? `${selectedConfigData.seat_height_mm} mm` : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-explorer-text-muted">Wheelbase</p>
                <p className="text-explorer-text font-medium">
                  {selectedConfigData.wheelbase_mm ? `${selectedConfigData.wheelbase_mm} mm` : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-explorer-text-muted">Ground Clearance</p>
                <p className="text-explorer-text font-medium">
                  {selectedConfigData.ground_clearance_mm ? `${selectedConfigData.ground_clearance_mm} mm` : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-explorer-text-muted">Fuel Capacity</p>
                <p className="text-explorer-text font-medium">
                  {selectedConfigData.fuel_capacity_l ? `${selectedConfigData.fuel_capacity_l} L` : "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default TrimLevelDetails;
