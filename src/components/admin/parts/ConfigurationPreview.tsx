
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Configuration } from "@/types/motorcycle";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NotesDisplay from "./trim-level-editor/NotesDisplay";

interface ConfigurationPreviewProps {
  configuration: Configuration;
  isOpen: boolean;
  onClose: () => void;
}

const ConfigurationPreview = ({ configuration, isOpen, onClose }: ConfigurationPreviewProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-explorer-dark border-explorer-chrome/30">
        <DialogHeader>
          <DialogTitle className="text-explorer-text flex items-center gap-2">
            {configuration.name}
            {configuration.is_default && (
              <Badge className="bg-accent-teal text-black">Default</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {configuration.trim_level && (
                <div>
                  <span className="text-sm text-explorer-text-muted">Trim Level:</span>
                  <p className="text-explorer-text">{configuration.trim_level}</p>
                </div>
              )}
              {configuration.market_region && (
                <div>
                  <span className="text-sm text-explorer-text-muted">Market Region:</span>
                  <p className="text-explorer-text">{configuration.market_region}</p>
                </div>
              )}
              {configuration.price_premium_usd && (
                <div>
                  <span className="text-sm text-explorer-text-muted">Price Premium:</span>
                  <p className="text-explorer-text">${configuration.price_premium_usd}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes and Description */}
          <NotesDisplay 
            description={configuration.description}
            notes={configuration.notes}
          />

          {/* Components */}
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {configuration.engine && (
                <div className="flex justify-between">
                  <span className="text-explorer-text-muted">Engine:</span>
                  <span className="text-explorer-text">{configuration.engine.name}</span>
                </div>
              )}
              {configuration.brakes && (
                <div className="flex justify-between">
                  <span className="text-explorer-text-muted">Brake System:</span>
                  <span className="text-explorer-text">{configuration.brakes.type}</span>
                </div>
              )}
              {configuration.frame && (
                <div className="flex justify-between">
                  <span className="text-explorer-text-muted">Frame:</span>
                  <span className="text-explorer-text">{configuration.frame.type}</span>
                </div>
              )}
              {configuration.suspension && (
                <div className="flex justify-between">
                  <span className="text-explorer-text-muted">Suspension:</span>
                  <span className="text-explorer-text">{configuration.suspension.front_type}</span>
                </div>
              )}
              {configuration.wheels && (
                <div className="flex justify-between">
                  <span className="text-explorer-text-muted">Wheels:</span>
                  <span className="text-explorer-text">{configuration.wheels.type}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dimensions */}
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {configuration.weight_kg && (
                <div className="flex justify-between">
                  <span className="text-explorer-text-muted">Weight:</span>
                  <span className="text-explorer-text">{configuration.weight_kg} kg</span>
                </div>
              )}
              {configuration.seat_height_mm && (
                <div className="flex justify-between">
                  <span className="text-explorer-text-muted">Seat Height:</span>
                  <span className="text-explorer-text">{configuration.seat_height_mm} mm</span>
                </div>
              )}
              {configuration.wheelbase_mm && (
                <div className="flex justify-between">
                  <span className="text-explorer-text-muted">Wheelbase:</span>
                  <span className="text-explorer-text">{configuration.wheelbase_mm} mm</span>
                </div>
              )}
              {configuration.fuel_capacity_l && (
                <div className="flex justify-between">
                  <span className="text-explorer-text-muted">Fuel Capacity:</span>
                  <span className="text-explorer-text">{configuration.fuel_capacity_l} L</span>
                </div>
              )}
              {configuration.ground_clearance_mm && (
                <div className="flex justify-between">
                  <span className="text-explorer-text-muted">Ground Clearance:</span>
                  <span className="text-explorer-text">{configuration.ground_clearance_mm} mm</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationPreview;
