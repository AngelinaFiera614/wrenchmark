
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, PlusCircle } from "lucide-react";

interface AdminBrakeSystemsTableProps {
  filteredBrakeSystems: any[];
  onEditBrakeSystem: (brakeSystem: any) => void;
  onDeleteBrakeSystem: (brakeSystem: any) => void;
  onCreateBrakeSystem: () => void;
  isChecking: boolean;
}

const AdminBrakeSystemsTable = ({ 
  filteredBrakeSystems, 
  onEditBrakeSystem, 
  onDeleteBrakeSystem, 
  onCreateBrakeSystem,
  isChecking 
}: AdminBrakeSystemsTableProps) => {
  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <CardTitle className="text-explorer-text">
          Brake Systems ({filteredBrakeSystems.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredBrakeSystems.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-explorer-chrome/20">
                <TableHead className="text-explorer-text">Type</TableHead>
                <TableHead className="text-explorer-text">Front</TableHead>
                <TableHead className="text-explorer-text">Rear</TableHead>
                <TableHead className="text-explorer-text">Brand</TableHead>
                <TableHead className="text-explorer-text">Features</TableHead>
                <TableHead className="text-explorer-text">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBrakeSystems.map((brakeSystem) => (
                <TableRow key={brakeSystem.id} className="border-explorer-chrome/20">
                  <TableCell>
                    <div className="font-medium text-explorer-text">{brakeSystem.type}</div>
                  </TableCell>
                  <TableCell className="text-explorer-text">
                    <div>{brakeSystem.brake_type_front || '-'}</div>
                    {brakeSystem.front_disc_size_mm && (
                      <div className="text-xs text-explorer-text-muted">{brakeSystem.front_disc_size_mm}mm disc</div>
                    )}
                  </TableCell>
                  <TableCell className="text-explorer-text">
                    <div>{brakeSystem.brake_type_rear || '-'}</div>
                    {brakeSystem.rear_disc_size_mm && (
                      <div className="text-xs text-explorer-text-muted">{brakeSystem.rear_disc_size_mm}mm disc</div>
                    )}
                  </TableCell>
                  <TableCell className="text-explorer-text">{brakeSystem.brake_brand || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {brakeSystem.has_traction_control && (
                        <Badge variant="outline" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30 text-xs">
                          TC
                        </Badge>
                      )}
                      {brakeSystem.caliper_type && (
                        <Badge variant="outline" className="bg-explorer-chrome/20 text-explorer-text border-explorer-chrome/30 text-xs">
                          {brakeSystem.caliper_type}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditBrakeSystem(brakeSystem)}
                        className="h-8 px-2 text-xs"
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteBrakeSystem(brakeSystem)}
                        disabled={isChecking}
                        className="h-8 px-2 text-xs text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        {isChecking ? "Checking..." : "Delete"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <div className="text-explorer-text-muted">
              No brake systems found. Start by adding your first brake system.
            </div>
            <Button 
              variant="outline" 
              onClick={onCreateBrakeSystem}
              className="mt-4"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Brake System
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminBrakeSystemsTable;
