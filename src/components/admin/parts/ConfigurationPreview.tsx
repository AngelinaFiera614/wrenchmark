
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Share, Print } from "lucide-react";
import { Configuration } from "@/types/motorcycle";

interface ConfigurationPreviewProps {
  configuration: Configuration;
  isOpen: boolean;
  onClose: () => void;
}

const ConfigurationPreview = ({
  configuration,
  isOpen,
  onClose
}: ConfigurationPreviewProps) => {
  const componentSections = [
    {
      title: "Engine",
      component: configuration.engine,
      icon: "🔧",
      details: configuration.engine ? [
        `${configuration.engine.displacement_cc}cc`,
        configuration.engine.power_hp && `${configuration.engine.power_hp}hp`,
        configuration.engine.torque_nm && `${configuration.engine.torque_nm}Nm`,
        configuration.engine.engine_type,
        `${configuration.engine.cylinder_count || '?'} cylinders`,
        configuration.engine.cooling
      ].filter(Boolean) : []
    },
    {
      title: "Brake System",
      component: configuration.brakes,
      icon: "🛑",
      details: configuration.brakes ? [
        configuration.brakes.type,
        configuration.brakes.brake_type_front && `Front: ${configuration.brakes.brake_type_front}`,
        configuration.brakes.brake_type_rear && `Rear: ${configuration.brakes.brake_type_rear}`,
        configuration.brakes.has_traction_control && "Traction Control"
      ].filter(Boolean) : []
    },
    {
      title: "Frame",
      component: configuration.frame,
      icon: "🏗️",
      details: configuration.frame ? [
        configuration.frame.type,
        configuration.frame.material,
        configuration.frame.rake_degrees && `${configuration.frame.rake_degrees}° rake`,
        configuration.frame.trail_mm && `${configuration.frame.trail_mm}mm trail`
      ].filter(Boolean) : []
    },
    {
      title: "Suspension",
      component: configuration.suspension,
      icon: "🔩",
      details: configuration.suspension ? [
        `Front: ${configuration.suspension.front_type || 'N/A'}`,
        `Rear: ${configuration.suspension.rear_type || 'N/A'}`,
        configuration.suspension.brand,
        configuration.suspension.adjustability,
        configuration.suspension.front_travel_mm && `${configuration.suspension.front_travel_mm}mm front travel`
      ].filter(Boolean) : []
    },
    {
      title: "Wheels",
      component: configuration.wheels,
      icon: "⚫",
      details: configuration.wheels ? [
        `Front: ${configuration.wheels.front_size || 'N/A'}`,
        `Rear: ${configuration.wheels.rear_size || 'N/A'}`,
        configuration.wheels.type,
        configuration.wheels.rim_material,
        configuration.wheels.spoke_count_front && `${configuration.wheels.spoke_count_front} front spokes`
      ].filter(Boolean) : []
    }
  ];

  const specifications = [
    { label: "Weight", value: configuration.weight_kg ? `${configuration.weight_kg} kg` : "—" },
    { label: "Seat Height", value: configuration.seat_height_mm ? `${configuration.seat_height_mm} mm` : "—" },
    { label: "Wheelbase", value: configuration.wheelbase_mm ? `${configuration.wheelbase_mm} mm` : "—" },
    { label: "Ground Clearance", value: configuration.ground_clearance_mm ? `${configuration.ground_clearance_mm} mm` : "—" },
    { label: "Fuel Capacity", value: configuration.fuel_capacity_l ? `${configuration.fuel_capacity_l} L` : "—" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-explorer-dark border-explorer-chrome/30">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-explorer-text text-xl">
              Configuration Preview: {configuration.name || "Standard"}
            </DialogTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="bg-explorer-card border-explorer-chrome/30 text-explorer-text">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button size="sm" variant="outline" className="bg-explorer-card border-explorer-chrome/30 text-explorer-text">
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button size="sm" variant="outline" className="bg-explorer-card border-explorer-chrome/30 text-explorer-text">
                <Print className="mr-2 h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Configuration Header */}
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-explorer-text-muted">Configuration</p>
                  <p className="text-lg font-semibold text-explorer-text">{configuration.name || "Standard"}</p>
                </div>
                <div>
                  <p className="text-sm text-explorer-text-muted">Trim Level</p>
                  <p className="text-lg font-semibold text-explorer-text">{configuration.trim_level || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-explorer-text-muted">Market</p>
                  <p className="text-lg font-semibold text-explorer-text">{configuration.market_region || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-explorer-text-muted">Status</p>
                  <Badge variant={configuration.is_default ? "default" : "secondary"} className="mt-1">
                    {configuration.is_default ? "Default" : "Alternative"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Components Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {componentSections.map((section) => (
              <Card key={section.title} className="bg-explorer-card border-explorer-chrome/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-explorer-text flex items-center gap-2 text-lg">
                    <span>{section.icon}</span>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {section.component ? (
                    <div className="space-y-3">
                      <div className="font-medium text-explorer-text">
                        {section.component.name || section.title}
                      </div>
                      <div className="space-y-1">
                        {section.details.map((detail, index) => (
                          <div key={index} className="text-sm text-explorer-text-muted">
                            {detail}
                          </div>
                        ))}
                      </div>
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                        Assigned
                      </Badge>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-explorer-text-muted">
                        No {section.title.toLowerCase()} assigned
                      </div>
                      <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                        Not Assigned
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Physical Specifications */}
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Physical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {specifications.map((spec) => (
                  <div key={spec.label} className="text-center">
                    <p className="text-sm text-explorer-text-muted">{spec.label}</p>
                    <p className="text-lg font-semibold text-explorer-text">{spec.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Optional Equipment & Features */}
          {(configuration.optional_equipment?.length || configuration.special_features?.length) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {configuration.optional_equipment && configuration.optional_equipment.length > 0 && (
                <Card className="bg-explorer-card border-explorer-chrome/30">
                  <CardHeader>
                    <CardTitle className="text-explorer-text">Optional Equipment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {configuration.optional_equipment.map((equipment, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-2">
                          {equipment}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {configuration.special_features && configuration.special_features.length > 0 && (
                <Card className="bg-explorer-card border-explorer-chrome/30">
                  <CardHeader>
                    <CardTitle className="text-explorer-text">Special Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {configuration.special_features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-2 bg-accent-teal/20 text-accent-teal">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationPreview;
