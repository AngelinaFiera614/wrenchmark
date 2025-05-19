
import { MotorcycleModel } from '@/types/motorcycle';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ComparisonOverview from './sections/ComparisonOverview';
import ComparisonEngine from './sections/ComparisonEngine';
import ComparisonChassis from './sections/ComparisonChassis';
import ComparisonFeatures from './sections/ComparisonFeatures';

interface ComparisonTabsProps {
  models: MotorcycleModel[];
  activeTab: string;
  setActiveTab: (value: string) => void;
  getSelectedYear: (model: MotorcycleModel) => any;
  getSelectedConfig: (model: MotorcycleModel) => any;
}

export default function ComparisonTabs({
  models,
  activeTab,
  setActiveTab,
  getSelectedYear,
  getSelectedConfig
}: ComparisonTabsProps) {
  return (
    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="engine">Engine</TabsTrigger>
        <TabsTrigger value="chassis">Chassis</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-6">
        <ComparisonOverview
          models={models}
          getSelectedYear={getSelectedYear}
          getSelectedConfig={getSelectedConfig}
        />
      </TabsContent>
      
      <TabsContent value="engine" className="mt-6">
        <ComparisonEngine
          models={models}
          getSelectedYear={getSelectedYear}
          getSelectedConfig={getSelectedConfig}
        />
      </TabsContent>
      
      <TabsContent value="chassis" className="mt-6">
        <ComparisonChassis
          models={models}
          getSelectedYear={getSelectedYear}
          getSelectedConfig={getSelectedConfig}
        />
      </TabsContent>
      
      <TabsContent value="features" className="mt-6">
        <div className="text-center py-8 text-muted-foreground">
          Feature comparison will be implemented in the next update.
        </div>
      </TabsContent>
    </Tabs>
  );
}
