
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ValidationIndicator } from "../validation/ValidationEngine";
import { Badge } from "@/components/ui/badge";

interface StickyNavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  sectionStatus: Record<string, 'complete' | 'partial' | 'missing'>;
  completeness: number;
  className?: string;
}

const StickyNavigationTabs: React.FC<StickyNavigationTabsProps> = ({
  activeTab,
  onTabChange,
  sectionStatus,
  completeness,
  className = ""
}) => {
  const sections = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'components', label: 'Components' },
    { id: 'dimensions', label: 'Dimensions' },
    { id: 'metrics', label: 'Metrics' },
    { id: 'notes', label: 'Notes' }
  ];

  return (
    <div className={`sticky top-0 z-10 bg-explorer-card border-b border-explorer-chrome/30 ${className}`}>
      <div className="flex items-center justify-between px-6 py-3">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="bg-explorer-dark border-explorer-chrome/30">
            {sections.map((section) => (
              <TabsTrigger 
                key={section.id}
                value={section.id}
                className="data-[state=active]:bg-accent-teal data-[state=active]:text-black flex items-center gap-2"
              >
                <ValidationIndicator 
                  status={sectionStatus[section.id]} 
                  compact 
                />
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-3">
          <div className="text-sm text-explorer-text-muted">
            Overall Completeness
          </div>
          <Badge 
            variant="outline" 
            className={`${
              completeness >= 80 ? 'border-green-500 text-green-500' :
              completeness >= 50 ? 'border-yellow-500 text-yellow-500' :
              'border-red-500 text-red-500'
            }`}
          >
            {completeness}%
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default StickyNavigationTabs;
