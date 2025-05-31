
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Edit, ExternalLink, MapPin } from "lucide-react";

interface ComponentDetailDialogProps {
  component: any;
  componentType: string;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (component: any) => void;
}

const ComponentDetailDialog = ({ 
  component, 
  componentType, 
  isOpen, 
  onClose, 
  onEdit 
}: ComponentDetailDialogProps) => {
  if (!component) return null;

  const renderComponentDetails = () => {
    switch (componentType) {
      case 'engines':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-explorer-text">Displacement</p>
                <p className="text-explorer-text-muted">{component.displacement_cc}cc</p>
              </div>
              <div>
                <p className="text-sm font-medium text-explorer-text">Power</p>
                <p className="text-explorer-text-muted">
                  {component.power_hp ? `${component.power_hp}hp` : 'N/A'}
                  {component.power_rpm ? ` @ ${component.power_rpm}rpm` : ''}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-explorer-text">Torque</p>
                <p className="text-explorer-text-muted">
                  {component.torque_nm ? `${component.torque_nm}Nm` : 'N/A'}
                  {component.torque_rpm ? ` @ ${component.torque_rpm}rpm` : ''}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-explorer-text">Configuration</p>
                <p className="text-explorer-text-muted">
                  {component.cylinder_count || '?'} cylinders • {component.cooling}
                </p>
              </div>
            </div>
            
            {component.engine_type && (
              <div>
                <p className="text-sm font-medium text-explorer-text">Engine Type</p>
                <p className="text-explorer-text-muted">{component.engine_type}</p>
              </div>
            )}
          </div>
        );

      case 'brakes':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-explorer-text">Type</p>
                <p className="text-explorer-text-muted">{component.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-explorer-text">Brand</p>
                <p className="text-explorer-text-muted">{component.brake_brand || 'Standard'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-explorer-text">Front Type</p>
                <p className="text-explorer-text-muted">{component.brake_type_front || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-explorer-text">Rear Type</p>
                <p className="text-explorer-text-muted">{component.brake_type_rear || 'N/A'}</p>
              </div>
            </div>
          </div>
        );

      case 'frames':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-explorer-text">Type</p>
                <p className="text-explorer-text-muted">{component.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-explorer-text">Material</p>
                <p className="text-explorer-text-muted">{component.material || 'Standard'}</p>
              </div>
            </div>
            
            {component.rake_degrees && (
              <div>
                <p className="text-sm font-medium text-explorer-text">Geometry</p>
                <p className="text-explorer-text-muted">
                  {component.rake_degrees}° rake
                  {component.trail_mm && ` • ${component.trail_mm}mm trail`}
                </p>
              </div>
            )}
          </div>
        );

      case 'suspensions':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-explorer-text">Front Type</p>
                <p className="text-explorer-text-muted">{component.front_type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-explorer-text">Rear Type</p>
                <p className="text-explorer-text-muted">{component.rear_type || 'N/A'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-explorer-text">Brand</p>
                <p className="text-explorer-text-muted">{component.brand || 'Standard'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-explorer-text">Adjustability</p>
                <p className="text-explorer-text-muted">{component.adjustability || 'Fixed'}</p>
              </div>
            </div>
          </div>
        );

      case 'wheels':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-explorer-text">Wheel Sizes</p>
                <p className="text-explorer-text-muted">
                  {component.front_size} / {component.rear_size}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-explorer-text">Type</p>
                <p className="text-explorer-text-muted">{component.type || 'Standard'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-explorer-text">Material</p>
                <p className="text-explorer-text-muted">{component.rim_material || 'Standard'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-explorer-text">Tire Sizes</p>
                <p className="text-explorer-text-muted">
                  {component.front_tire_size} / {component.rear_tire_size}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-4">
            <p className="text-explorer-text-muted">Component details not available</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-explorer-card border-explorer-chrome/30 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-explorer-text flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>{component.name}</span>
              <Badge variant="outline" className="text-xs">
                {componentType.slice(0, -1).toUpperCase()}
              </Badge>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(component)}
                  className="bg-explorer-chrome/20 border-explorer-chrome/30 text-explorer-text"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="bg-explorer-chrome/20 border-explorer-chrome/30 text-explorer-text"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Full Details
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="bg-explorer-dark border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text text-lg">Component Details</CardTitle>
            </CardHeader>
            <CardContent>
              {renderComponentDetails()}
            </CardContent>
          </Card>

          <Card className="bg-explorer-dark border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Usage Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-explorer-text">Component ID</p>
                  <p className="text-xs text-explorer-text-muted font-mono">{component.id}</p>
                </div>
                <Separator className="bg-explorer-chrome/30" />
                <div>
                  <p className="text-sm font-medium text-explorer-text">Created</p>
                  <p className="text-explorer-text-muted">
                    {component.created_at ? new Date(component.created_at).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-explorer-text">Last Updated</p>
                  <p className="text-explorer-text-muted">
                    {component.updated_at ? new Date(component.updated_at).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentDetailDialog;
