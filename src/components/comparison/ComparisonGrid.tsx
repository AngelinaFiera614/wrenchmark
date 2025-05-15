
import { useState } from "react";
import { Motorcycle } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import ComparisonOverview from "./sections/ComparisonOverview";
import ComparisonPerformance from "./sections/ComparisonPerformance";
import ComparisonDimensions from "./sections/ComparisonDimensions";
import ComparisonFeatures from "./sections/ComparisonFeatures";
import { useMobile } from "@/hooks/use-mobile";

interface ComparisonGridProps {
  motorcycles: Motorcycle[];
}

export default function ComparisonGrid({ motorcycles }: ComparisonGridProps) {
  const [activeSection, setActiveSection] = useState("overview");
  const isMobile = useMobile();

  const handleSectionChange = (value: string) => {
    setActiveSection(value);
    
    // On mobile, scroll to top of tab content for better UX
    if (isMobile) {
      setTimeout(() => {
        const element = document.getElementById(`section-${value}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <div>
      {/* Section navigation */}
      <div className="mb-6">
        <Tabs 
          value={activeSection}
          onValueChange={handleSectionChange}
          className="w-full"
        >
          <TabsList className="w-full md:w-auto flex bg-muted/80 border border-border/30">
            <TabsTrigger 
              value="overview" 
              className="flex-1 md:flex-none text-foreground data-[state=active]:bg-accent-teal data-[state=active]:text-black"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="performance" 
              className="flex-1 md:flex-none text-foreground data-[state=active]:bg-accent-teal data-[state=active]:text-black"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger 
              value="dimensions" 
              className="flex-1 md:flex-none text-foreground data-[state=active]:bg-accent-teal data-[state=active]:text-black"
            >
              Dimensions
            </TabsTrigger>
            <TabsTrigger 
              value="features" 
              className="flex-1 md:flex-none text-foreground data-[state=active]:bg-accent-teal data-[state=active]:text-black"
            >
              Features
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main comparison grid */}
      <div className="space-y-8 pb-12">
        {/* Desktop view has all sections showing, mobile shows only selected tab */}
        <div id="section-overview" className={cn(!isMobile || activeSection === "overview" ? "block" : "hidden")}>
          <ComparisonOverview motorcycles={motorcycles} />
        </div>
        
        <div id="section-performance" className={cn(!isMobile || activeSection === "performance" ? "block" : "hidden")}>
          <ComparisonPerformance motorcycles={motorcycles} />
        </div>
        
        <div id="section-dimensions" className={cn(!isMobile || activeSection === "dimensions" ? "block" : "hidden")}>
          <ComparisonDimensions motorcycles={motorcycles} />
        </div>
        
        <div id="section-features" className={cn(!isMobile || activeSection === "features" ? "block" : "hidden")}>
          <ComparisonFeatures motorcycles={motorcycles} />
        </div>
      </div>
    </div>
  );
}
