
import React from "react";

interface TabItem {
  key: string;
  label: string;
  condition?: boolean;
}

interface MotorcycleDetailTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasComponentData: boolean;
  selectedConfigurationName?: string;
}

export function MotorcycleDetailTabs({ 
  activeTab, 
  onTabChange, 
  hasComponentData, 
  selectedConfigurationName 
}: MotorcycleDetailTabsProps) {
  const tabs: TabItem[] = [
    { key: "specifications", label: "Specifications" },
    { key: "interactive", label: "Interactive Specs" },
    { 
      key: "components", 
      label: `Components${selectedConfigurationName ? ` (${selectedConfigurationName})` : ''}`,
      condition: hasComponentData 
    },
    { key: "features", label: "Features" },
    { key: "related", label: "Related Models" },
    { key: "safety", label: "Safety" },
    { key: "manuals", label: "Manuals" }
  ];

  return (
    <div className="border-b border-border/40 mb-6">
      <div className="flex flex-wrap -mb-px text-sm font-medium">
        {tabs.map((tab) => {
          if (tab.condition === false) return null;
          
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`mr-4 py-3 border-b-2 ${
                activeTab === tab.key
                  ? 'border-accent-teal text-accent-teal'
                  : 'border-transparent hover:border-border/70 text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
