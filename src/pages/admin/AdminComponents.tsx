
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Loader2 } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { fetchEngines, fetchBrakeSystems, fetchFrames, fetchSuspensions, fetchWheels } from "@/services/componentService";
import { ComponentDialogManager } from "@/components/admin/motorcycles/form/ComponentDialogManager";

const AdminComponents = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("engines");
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  // Fetch component data
  const { 
    data: engines, 
    isLoading: enginesLoading,
    refetch: refetchEngines
  } = useQuery({
    queryKey: ["engines"],
    queryFn: fetchEngines
  });

  const { 
    data: brakeSystems, 
    isLoading: brakesLoading,
    refetch: refetchBrakes
  } = useQuery({
    queryKey: ["brake-systems"],
    queryFn: fetchBrakeSystems
  });

  const { 
    data: frames, 
    isLoading: framesLoading,
    refetch: refetchFrames
  } = useQuery({
    queryKey: ["frames"],
    queryFn: fetchFrames
  });

  const { 
    data: suspensions, 
    isLoading: suspensionsLoading,
    refetch: refetchSuspensions
  } = useQuery({
    queryKey: ["suspensions"],
    queryFn: fetchSuspensions
  });

  const { 
    data: wheels, 
    isLoading: wheelsLoading,
    refetch: refetchWheels
  } = useQuery({
    queryKey: ["wheels"],
    queryFn: fetchWheels
  });

  const handleAddComponent = (type: string) => {
    setActiveDialog(type);
  };

  const handleComponentCreated = () => {
    // Refetch the appropriate data based on the active tab
    switch (activeTab) {
      case "engines":
        refetchEngines();
        break;
      case "brakes":
        refetchBrakes();
        break;
      case "frames":
        refetchFrames();
        break;
      case "suspensions":
        refetchSuspensions();
        break;
      case "wheels":
        refetchWheels();
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Motorcycle Components</h1>
        <Button 
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
          onClick={() => handleAddComponent(activeTab === "brakes" ? "brake" : activeTab.slice(0, -1))}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New {activeTab === "brakes" ? "Brake System" : activeTab.slice(0, -1)}
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        Manage reusable motorcycle components that can be shared across different models.
      </p>
      
      <Tabs defaultValue="engines" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="engines">Engines</TabsTrigger>
          <TabsTrigger value="brakes">Brakes</TabsTrigger>
          <TabsTrigger value="frames">Frames</TabsTrigger>
          <TabsTrigger value="suspensions">Suspensions</TabsTrigger>
          <TabsTrigger value="wheels">Wheels</TabsTrigger>
        </TabsList>
        
        {/* Engines Tab Content */}
        <TabsContent value="engines">
          {enginesLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
            </div>
          ) : engines && engines.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Size (cc)</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Power (HP)</TableHead>
                    <TableHead>Torque (Nm)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {engines.map((engine) => (
                    <TableRow key={engine.id}>
                      <TableCell className="font-medium">{engine.name}</TableCell>
                      <TableCell>{engine.displacement_cc}</TableCell>
                      <TableCell>{engine.engine_type || "N/A"}</TableCell>
                      <TableCell>{engine.power_hp || "N/A"}</TableCell>
                      <TableCell>{engine.torque_nm || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="border rounded-md p-8 text-center">
              <p className="text-muted-foreground">No engines found. Add your first engine to get started.</p>
            </div>
          )}
        </TabsContent>
        
        {/* Brakes Tab Content */}
        <TabsContent value="brakes">
          {brakesLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
            </div>
          ) : brakeSystems && brakeSystems.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Front Brakes</TableHead>
                    <TableHead>Rear Brakes</TableHead>
                    <TableHead>Traction Control</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brakeSystems.map((brake) => (
                    <TableRow key={brake.id}>
                      <TableCell className="font-medium">{brake.type}</TableCell>
                      <TableCell>{brake.brake_type_front || "N/A"}</TableCell>
                      <TableCell>{brake.brake_type_rear || "N/A"}</TableCell>
                      <TableCell>{brake.has_traction_control ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="border rounded-md p-8 text-center">
              <p className="text-muted-foreground">No brake systems found. Add your first brake system to get started.</p>
            </div>
          )}
        </TabsContent>
        
        {/* Frames Tab Content */}
        <TabsContent value="frames">
          {framesLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
            </div>
          ) : frames && frames.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {frames.map((frame) => (
                    <TableRow key={frame.id}>
                      <TableCell className="font-medium">{frame.type}</TableCell>
                      <TableCell>{frame.material || "N/A"}</TableCell>
                      <TableCell>{frame.notes || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="border rounded-md p-8 text-center">
              <p className="text-muted-foreground">No frames found. Add your first frame to get started.</p>
            </div>
          )}
        </TabsContent>
        
        {/* Suspensions Tab Content */}
        <TabsContent value="suspensions">
          {suspensionsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
            </div>
          ) : suspensions && suspensions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Front Type</TableHead>
                    <TableHead>Rear Type</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Adjustability</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suspensions.map((suspension) => (
                    <TableRow key={suspension.id}>
                      <TableCell className="font-medium">{suspension.front_type || "N/A"}</TableCell>
                      <TableCell>{suspension.rear_type || "N/A"}</TableCell>
                      <TableCell>{suspension.brand || "N/A"}</TableCell>
                      <TableCell>{suspension.adjustability || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="border rounded-md p-8 text-center">
              <p className="text-muted-foreground">No suspensions found. Add your first suspension to get started.</p>
            </div>
          )}
        </TabsContent>
        
        {/* Wheels Tab Content */}
        <TabsContent value="wheels">
          {wheelsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
            </div>
          ) : wheels && wheels.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Front Size</TableHead>
                    <TableHead>Rear Size</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wheels.map((wheel) => (
                    <TableRow key={wheel.id}>
                      <TableCell className="font-medium">{wheel.type || "N/A"}</TableCell>
                      <TableCell>{wheel.front_size || "N/A"}</TableCell>
                      <TableCell>{wheel.rear_size || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="border rounded-md p-8 text-center">
              <p className="text-muted-foreground">No wheels found. Add your first wheel set to get started.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <ComponentDialogManager
        activeDialog={activeDialog}
        onClose={() => setActiveDialog(null)}
        onComponentCreated={handleComponentCreated}
      />
    </div>
  );
};

export default AdminComponents;
