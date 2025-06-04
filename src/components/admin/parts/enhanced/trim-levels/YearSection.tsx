
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import TrimLevelCard from "./TrimLevelCard";

interface YearSectionProps {
  yearId: string;
  yearConfigs: any[];
  isExpanded: boolean;
  onToggle: (yearId: string) => void;
  onCreateNew: (yearIds: string[]) => void;
  onEdit: (config: any) => void;
  onCopy: (config: any) => void;
  onDelete: (config: any) => void;
  onPreview: (config: any) => void;
}

const YearSection = ({
  yearId,
  yearConfigs,
  isExpanded,
  onToggle,
  onCreateNew,
  onEdit,
  onCopy,
  onDelete,
  onPreview
}: YearSectionProps) => {
  return (
    <Collapsible open={isExpanded} onOpenChange={() => onToggle(yearId)}>
      <Card className="bg-explorer-dark border-explorer-chrome/30">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-explorer-chrome/10 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-explorer-text-muted" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-explorer-text-muted" />
                )}
                <div className="text-sm font-medium text-explorer-text">
                  Model Year (ID: {yearId.slice(0, 8)}...)
                </div>
                <Badge variant="secondary" className="text-xs">
                  {yearConfigs.length} trims
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateNew([yearId]);
                }}
                className="border-accent-teal/30 text-accent-teal hover:bg-accent-teal/10"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Trim
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            {yearConfigs.length === 0 ? (
              <div className="text-center py-8 text-explorer-text-muted">
                No trim levels configured for this year
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCreateNew([yearId])}
                    className="border-accent-teal/30 text-accent-teal hover:bg-accent-teal/10"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Create First Trim
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {yearConfigs.map(config => (
                  <TrimLevelCard
                    key={config.id}
                    config={config}
                    onEdit={onEdit}
                    onPreview={onPreview}
                    onCopy={onCopy}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default YearSection;
