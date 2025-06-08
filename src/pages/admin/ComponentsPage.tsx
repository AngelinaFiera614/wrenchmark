
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cog, Disc, Box, Waves, Circle } from "lucide-react";
import EnginesManager from "@/components/admin/components/EnginesManager";
import BrakesManager from "@/components/admin/components/BrakesManager";
import FramesManager from "@/components/admin/components/FramesManager";
import SuspensionsManager from "@/components/admin/components/SuspensionsManager";
import WheelsManager from "@/components/admin/components/WheelsManager";

const ComponentsPage = () => {
  const [activeTab, setActiveTab] = useState("engines");

  const componentTabs = [
    { id: 'engines', label: 'Engines', icon: Cog, component: EnginesManager },
    { id: 'brakes', label: 'Brake Systems', icon: Disc, component: BrakesManager },
    { id: 'frames', label: 'Frames', icon: Box, component: FramesManager },
    { id: 'suspensions', label: 'Suspensions', icon: Waves, component: SuspensionsManager },
    { id: 'wheels', label: 'Wheels', icon: Circle, component: WheelsManager }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Technical Components Management</CardTitle>
          <p className="text-explorer-text-muted">
            Manage all technical components for motorcycles. Add, edit, and organize engines, brake systems, frames, suspensions, and wheels.
          </p>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {componentTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {componentTabs.map((tab) => {
          const Component = tab.component;
          return (
            <TabsContent key={tab.id} value={tab.id} className="space-y-4">
              <Component />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default ComponentsPage;
