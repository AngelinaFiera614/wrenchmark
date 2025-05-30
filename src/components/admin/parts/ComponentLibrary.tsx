
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchEngines } from "@/services/engineService";
import { fetchBrakes } from "@/services/brakeService";
import { fetchFrames } from "@/services/frameService";
import { fetchSuspensions } from "@/services/suspensionService";
import { fetchWheels } from "@/services/wheelService";

const ComponentLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("engines");

  // Fetch all component types
  const { data: engines } = useQuery({
    queryKey: ["engines"],
    queryFn: fetchEngines
  });

  const { data: brakes } = useQuery({
    queryKey: ["brakes"],
    queryFn: fetchBrakes
  });

  const { data: frames } = useQuery({
    queryKey: ["frames"],
    queryFn: fetchFrames
  });

  const { data: suspensions } = useQuery({
    queryKey: ["suspensions"],
    queryFn: fetchSuspensions
  });

  const { data: wheels } = useQuery({
    queryKey: ["wheels"],
    queryFn: fetchWheels
  });

  const componentTabs = [
    { id: 'engines', label: 'Engines', data: engines || [], icon: '🔧' },
    { id: 'brakes', label: 'Brakes', data: brakes || [], icon: '🛑' },
    { id: 'frames', label: 'Frames', data: frames || [], icon: '🏗️' },
    { id: 'suspensions', label: 'Suspension', data: suspensions || [], icon: '🔩' },
    { id: 'wheels', label: 'Wheels', data: wheels || [], icon: '⚫' }
  ];

  const filterComponents = (components: any[]) => {
    if (!searchTerm) return components;
    
    return components.filter(component =>
      component.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.displacement_cc?.toString().includes(searchTerm) ||
      component.power_hp?.toString().includes(searchTerm)
    );
  };

  const renderComponentCard = (component: any, type: string) => {
    return (
      <Card key={component.id} className="bg-explorer-card border-explorer-chrome/30 hover:border-accent-teal/30 transition-colors">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-explorer-text">{component.name}</h3>
              <Badge variant="outline" className="text-xs">
                {type.slice(0, -1).toUpperCase()}
              </Badge>
            </div>

            {/* Type-specific details */}
            {type === 'engines' && (
              <div className="space-y-1 text-sm">
                <div className="text-explorer-text">
                  {component.displacement_cc}cc
                  {component.power_hp && ` • ${component.power_hp}hp`}
                  {component.torque_nm && ` • ${component.torque_nm}Nm`}
                </div>
                <div className="text-explorer-text-muted">
                  {component.engine_type} • {component.cylinder_count || '?'} cylinders • {component.cooling}
                </div>
              </div>
            )}

            {type === 'brakes' && (
              <div className="space-y-1 text-sm">
                <div className="text-explorer-text">{component.type}</div>
                <div className="text-explorer-text-muted">
                  {component.brake_type_front && `Front: ${component.brake_type_front}`}
                  {component.brake_type_rear && ` • Rear: ${component.brake_type_rear}`}
                </div>
              </div>
            )}

            {type === 'frames' && (
              <div className="space-y-1 text-sm">
                <div className="text-explorer-text">{component.type}</div>
                <div className="text-explorer-text-muted">
                  {component.material}
                  {component.rake_degrees && ` • ${component.rake_degrees}° rake`}
                </div>
              </div>
            )}

            {type === 'suspensions' && (
              <div className="space-y-1 text-sm">
                <div className="text-explorer-text">
                  {component.front_type} / {component.rear_type}
                </div>
                <div className="text-explorer-text-muted">
                  {component.brand}
                  {component.adjustability && ` • ${component.adjustability}`}
                </div>
              </div>
            )}

            {type === 'wheels' && (
              <div className="space-y-1 text-sm">
                <div className="text-explorer-text">
                  {component.front_size} / {component.rear_size}
                </div>
                <div className="text-explorer-text-muted">
                  {component.type} • {component.rim_material}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" className="flex-1">
                Edit
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                View Usage
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Actions */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-explorer-text">Component Library</CardTitle>
            <Button className="bg-accent-teal text-black hover:bg-accent-teal/80">
              <Plus className="mr-2 h-4 w-4" />
              Add Component
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-explorer-text-muted h-4 w-4" />
              <Input
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
              />
            </div>
            <Button variant="outline" className="bg-explorer-card border-explorer-chrome/30 text-explorer-text">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Component Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          {componentTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <Badge variant="secondary" className="text-xs">
                {tab.data.length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {componentTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filterComponents(tab.data).map((component) =>
                renderComponentCard(component, tab.id)
              )}
            </div>

            {filterComponents(tab.data).length === 0 && (
              <Card className="bg-explorer-card border-explorer-chrome/30">
                <CardContent className="p-8 text-center">
                  <div className="text-explorer-text-muted">
                    {searchTerm
                      ? `No ${tab.label.toLowerCase()} match your search.`
                      : `No ${tab.label.toLowerCase()} available.`
                    }
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 bg-explorer-card border-explorer-chrome/30 text-explorer-text"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add {tab.label.slice(0, -1)}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ComponentLibrary;
